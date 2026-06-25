"use server";

import { prisma } from "@/lib/prisma";

interface MonthlyData {
  month: string;
  monthIndex: number;
  year: number;
  weight: number;
  count: number;
}

interface ForecastPoint {
  month: string;
  monthIndex: number;
  year: number;
  actual: number | null;
  forecast: number | null;
  lowerBound: number | null;
  upperBound: number | null;
}

interface SpeciesForecast {
  name: string;
  localName: string;
  currentMonthlyAvg: number;
  predictedNextMonth: number;
  trend: "up" | "down" | "stable";
}

export interface ForecastResult {
  historical: ForecastPoint[];
  projected: ForecastPoint[];
  speciesForecasts: SpeciesForecast[];
  summary: {
    nextMonthPrediction: number;
    nextQuarterPrediction: number;
    confidence: "high" | "medium" | "low";
    trend: "increasing" | "decreasing" | "stable";
    percentageChange: number;
  };
}

async function getMonthlyHistory(monthsBack = 24): Promise<MonthlyData[]> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);

  const catches = await prisma.catch.findMany({
    where: { date: { gte: startDate } },
    include: { details: true },
    orderBy: { date: "asc" },
  });

  const monthlyMap = new Map<string, MonthlyData>();

  for (const c of catches) {
    const d = new Date(c.date);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    const key = `${year}-${monthIndex}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    const existing = monthlyMap.get(key);
    const weight = c.details.reduce((sum, det) => sum + det.weight, 0);

    if (existing) {
      existing.weight += weight;
      existing.count += 1;
    } else {
      monthlyMap.set(key, {
        month: label,
        monthIndex,
        year,
        weight,
        count: 1,
      });
    }
  }

  const sorted = Array.from(monthlyMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.monthIndex - b.monthIndex;
  });

  return sorted;
}

function linearRegression(values: number[]) {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function seasonalFactors(data: MonthlyData[]): number[] {
  const byMonth: number[][] = Array.from({ length: 12 }, () => []);
  for (const d of data) {
    byMonth[d.monthIndex].push(d.weight);
  }

  const allWeights = data.map((d) => d.weight);
  const overallAvg = allWeights.reduce((a, b) => a + b, 0) / allWeights.length || 1;
  const factors: number[] = [];

  for (let m = 0; m < 12; m++) {
    const monthWeights = byMonth[m];
    if (monthWeights.length === 0) {
      factors.push(1);
    } else {
      const avg = monthWeights.reduce((a, b) => a + b, 0) / monthWeights.length;
      factors.push(avg / overallAvg);
    }
  }

  return factors;
}

function nextMonthLabel(currentYear: number, currentMonthIndex: number, monthsAhead: number): { month: string; monthIndex: number; year: number } {
  let totalMonths = currentYear * 12 + currentMonthIndex + monthsAhead;
  const year = Math.floor(totalMonths / 12);
  const monthIndex = totalMonths % 12;
  const date = new Date(year, monthIndex);
  const month = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return { month, monthIndex, year };
}

export async function getCatchForecast(): Promise<ForecastResult> {
  try {
    const history = await getMonthlyHistory(24);
    const weights = history.map((h) => h.weight);
    const n = weights.length;

    if (n < 3) {
      return {
        historical: history.map((h) => ({
          month: h.month,
          monthIndex: h.monthIndex,
          year: h.year,
          actual: h.weight,
          forecast: null,
          lowerBound: null,
          upperBound: null,
        })),
        projected: [],
        speciesForecasts: [],
        summary: {
          nextMonthPrediction: 0,
          nextQuarterPrediction: 0,
          confidence: "low",
          trend: "stable",
          percentageChange: 0,
        },
      };
    }

    const seasons = seasonalFactors(history);
    const { slope, intercept } = linearRegression(weights);

    const last3 = weights.slice(-3);
    const movingAvg3 = last3.reduce((a, b) => a + b, 0) / last3.length;

    const last6 = weights.slice(-6);
    const movingAvg6 = last6.length > 0 ? last6.reduce((a, b) => a + b, 0) / last6.length : movingAvg3;

    const last = history[n - 1];
    const lastYear = last.year;
    const lastMonthIndex = last.monthIndex;

    const forecastMonths = 6;
    const projected: ForecastPoint[] = [];

    const residuals = weights.map((w, i) => Math.abs(w - (intercept + slope * i)));
    const mae = residuals.reduce((a, b) => a + b, 0) / residuals.length;

    for (let i = 1; i <= forecastMonths; i++) {
      const { month, monthIndex, year } = nextMonthLabel(lastYear, lastMonthIndex, i);
      const x = n - 1 + i;

      const regressionValue = intercept + slope * x;
      const seasonFactor = seasons[monthIndex] || 1;
      const blendWeight = Math.min(1, i / 4);
      const smoothedAvg = movingAvg3 * (1 - blendWeight) + movingAvg6 * blendWeight;

      const forecast = (regressionValue * 0.4 + smoothedAvg * 0.6) * seasonFactor;
      const bounds = mae * (1 + i * 0.15) * 1.96;

      projected.push({
        month,
        monthIndex,
        year,
        actual: null,
        forecast: Math.max(0, forecast),
        lowerBound: Math.max(0, forecast - bounds),
        upperBound: forecast + bounds,
      });
    }

    const historical: ForecastPoint[] = history.map((h) => ({
      month: h.month,
      monthIndex: h.monthIndex,
      year: h.year,
      actual: h.weight,
      forecast: null,
      lowerBound: null,
      upperBound: null,
    }));

    const nextMonthVal = projected[0]?.forecast || 0;
    const nextQuarterVal = projected.slice(0, 3).reduce((a, b) => a + (b.forecast || 0), 0);
    const recentAvg = weights.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const pctChange = recentAvg === 0 ? 0 : ((nextMonthVal - recentAvg) / recentAvg) * 100;

    let confidence: "high" | "medium" | "low" = "low";
    if (n >= 12) confidence = "high";
    else if (n >= 6) confidence = "medium";

    let trend: "increasing" | "decreasing" | "stable";
    if (pctChange > 10) trend = "increasing";
    else if (pctChange < -10) trend = "decreasing";
    else trend = "stable";

    const speciesForecasts = await getSpeciesForecasts();

    return {
      historical,
      projected,
      speciesForecasts,
      summary: {
        nextMonthPrediction: Math.round(nextMonthVal * 100) / 100,
        nextQuarterPrediction: Math.round(nextQuarterVal * 100) / 100,
        confidence,
        trend,
        percentageChange: Math.round(pctChange * 10) / 10,
      },
    };
  } catch (error) {
    console.error("Forecast error:", error);
    return {
      historical: [],
      projected: [],
      speciesForecasts: [],
      summary: {
        nextMonthPrediction: 0,
        nextQuarterPrediction: 0,
        confidence: "low",
        trend: "stable",
        percentageChange: 0,
      },
    };
  }
}

async function getSpeciesForecasts(): Promise<SpeciesForecast[]> {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    const details = await prisma.catchDetail.findMany({
      where: { catch: { date: { gte: startDate } } },
      include: { fish: true, catch: true },
    });

    const bySpecies = new Map<string, { weights: number[]; months: number }>();
    const now = new Date();
    const currentMonth = now.getMonth();

    for (const d of details) {
      const catchDate = new Date(d.catch.date);
      const monthsAgo = (now.getFullYear() - catchDate.getFullYear()) * 12 + (currentMonth - catchDate.getMonth());

      if (!bySpecies.has(d.fishId)) {
        bySpecies.set(d.fishId, { weights: [], months: 0 });
      }
      const entry = bySpecies.get(d.fishId)!;
      entry.weights.push(d.weight);
      if (monthsAgo < 12) entry.months++;
    }

    const results: SpeciesForecast[] = [];
    const monthCount = Math.max(1, Math.min(...Array.from(bySpecies.values()).map((v) => v.months)));

    for (const [fishId, data] of bySpecies.entries()) {
      const totalWeight = data.weights.reduce((a, b) => a + b, 0);
      const avgMonthly = totalWeight / monthCount;

      const recentWeights = data.weights.slice(-3);
      const recentAvg = recentWeights.reduce((a, b) => a + b, 0) / recentWeights.length;

      const trendVal = avgMonthly === 0 ? 0 : ((recentAvg - avgMonthly) / avgMonthly) * 100;
      let trend: "up" | "down" | "stable";
      if (trendVal > 15) trend = "up";
      else if (trendVal < -15) trend = "down";
      else trend = "stable";

      const fish = details.find((d) => d.fishId === fishId)?.fish;
      results.push({
        name: fish?.name || "Unknown",
        localName: fish?.localName || fish?.name || "Unknown",
        currentMonthlyAvg: Math.round(avgMonthly * 100) / 100,
        predictedNextMonth: Math.round(recentAvg * (1 + trendVal / 100) * 100) / 100,
        trend,
      });
    }

    return results.sort((a, b) => b.predictedNextMonth - a.predictedNextMonth).slice(0, 10);
  } catch {
    return [];
  }
}
