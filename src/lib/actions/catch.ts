"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFishSpecies() {
  try {
    return await prisma.fishSpecies.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching fish species:", error);
    return [];
  }
}

export async function createCatch(data: {
  fishermanId: string;
  recordedBy: string;
  location?: string;
  weatherCondition?: string;
  temperature?: number;
  windSpeed?: number;
  tideLevel?: string;
  details: {
    fishId: string;
    quantity: number;
    weight: number;
  }[];
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const newCatch = await tx.catch.create({
        data: {
          fishermanId: data.fishermanId,
          recordedBy: data.recordedBy,
          location: data.location,
          weatherCondition: data.weatherCondition,
          temperature: data.temperature,
          windSpeed: data.windSpeed,
          tideLevel: data.tideLevel,
          details: {
            create: data.details,
          },
        },
        include: {
          details: true,
        },
      });

      return newCatch;
    });

    revalidatePath("/dashboard");
    revalidatePath("/fishermen");
    revalidatePath(`/fishermen/${data.fishermanId}`);
    
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Error creating catch:", error);
    const message = error instanceof Error ? error.message : "Failed to record catch";
    return { success: false, error: message };
  }
}

export async function getRecentCatches(limit = 5) {
  try {
    return await prisma.catch.findMany({
      take: limit,
      orderBy: { date: "desc" },
      include: {
        fisherman: {
          include: {
            user: true,
          },
        },
        details: {
          include: {
            fish: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching recent catches:", error);
    return [];
  }
}
