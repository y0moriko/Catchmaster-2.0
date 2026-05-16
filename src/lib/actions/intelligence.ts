"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function batchImportCatches(data: any[]) {
  try {
    const imports = data.map(row => ({
      fishermanId: row.fishermanId,
      recordedBy: row.recordedBy,
      date: new Date(row.date || new Date()),
      location: row.location || "Agdangan",
      weatherCondition: row.weather || row.weatherCondition || "Sunny",
      temperature: row.temperature ? parseFloat(row.temperature) : null,
      windSpeed: row.windSpeed ? parseFloat(row.windSpeed) : null,
      tideLevel: row.tideLevel || null,
      details: {
        create: (row.details || [row]).map((d: any) => ({
          fishId: d.fishId,
          quantity: parseInt(d.quantity) || 1,
          weight: parseFloat(d.weight) || 0
        }))
      }
    }));

    await prisma.$transaction(
      imports.map(item => prisma.catch.create({ data: item }))
    );

    revalidatePath("/dashboard");
    revalidatePath("/catches");
    return { success: true as const, count: imports.length };
  } catch (error) {
    console.error("Batch import failed:", error);
    return { success: false as const, error: "Failed to import records" };
  }
}

export async function generateReport(templateId: string, params: any) {
  // Mock report generation logic
  // In a real system, we'd fetch data based on params and use a library like jspdf
  return { 
    success: true, 
    downloadUrl: `/api/reports/download/${templateId}/mock`,
    message: "Report generated successfully" 
  };
}

export async function getCatchIntelligence() {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Fetch catches for today and yesterday for trend comparison
    const catches = await prisma.catch.findMany({
      where: {
        date: {
          gte: yesterday
        }
      },
      include: {
        details: true
      }
    });

    // Basic intelligence calculation
    const totalToday = catches
      .filter(c => c.date.toDateString() === today.toDateString())
      .reduce((acc, c) => acc + c.details.reduce((sum, d) => sum + d.weight, 0), 0);

    const totalYesterday = catches
      .filter(c => c.date.toDateString() === yesterday.toDateString())
      .reduce((acc, c) => acc + c.details.reduce((sum, d) => sum + d.weight, 0), 0);

    const trend = totalYesterday === 0 ? 100 : ((totalToday - totalYesterday) / totalYesterday) * 100;

    return {
      todayWeight: totalToday,
      yesterdayWeight: totalYesterday,
      trendPercentage: trend.toFixed(1),
      // Mock weather based on latest catch or external API
      currentWeather: catches[0]?.weatherCondition || "Sunny",
      recommendation: trend > 0 ? "Production is increasing. Ensure cold storage readiness." : "Slight decline detected. Check weather impact."
    };
  } catch (error) {
    console.error("Failed to fetch intelligence:", error);
    return null;
  }
}
