"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [
      totalWeightResult,
      activeFishermenCount,
      topSpeciesResult,
      totalUsersCount,
    ] = await Promise.all([
      prisma.catchDetail.aggregate({
        _sum: {
          weight: true,
        },
      }),
      prisma.fisherman.count(),
      prisma.catchDetail.groupBy({
        by: ["fishId"],
        _sum: {
          weight: true,
        },
        orderBy: {
          _sum: {
            weight: "desc",
          },
        },
        take: 3,
      }),
      prisma.user.count(),
    ]);

    const topSpecies = await Promise.all(
      topSpeciesResult.map(async (r) => {
        const species = await prisma.fishSpecies.findUnique({
          where: { id: r.fishId },
        });
        return {
          name: species?.name || "Unknown",
          weight: r._sum.weight || 0,
        };
      })
    );

    return {
      totalWeight: totalWeightResult._sum.weight || 0,
      activeFishermen: activeFishermenCount,
      topSpecies: topSpecies,
      totalUsers: totalUsersCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalWeight: 0,
      activeFishermen: 0,
      topSpecies: [],
      totalUsers: 0,
    };
  }
}

export async function getWeeklyCatchData() {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const catches = await prisma.catch.findMany({
      where: {
        date: {
          gte: last7Days,
        },
      },
      include: {
        details: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const dailyData: { [key: string]: { date: string; weight: number; count: number } } = {};

    for (const c of catches) {
      const dateStr = new Date(c.date).toLocaleDateString("en-US", { weekday: "short" });
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { date: dateStr, weight: 0, count: 0 };
      }
      dailyData[dateStr].weight += c.details.reduce((sum, d) => sum + d.weight, 0);
      dailyData[dateStr].count += 1;
    }

    return Object.values(dailyData);
  } catch (error) {
    console.error("Error fetching weekly catch data:", error);
    return [];
  }
}

export async function getSpeciesDistribution() {
  try {
    const speciesData = await prisma.catchDetail.groupBy({
      by: ["fishId"],
      _sum: {
        weight: true,
      },
      orderBy: {
        _sum: {
          weight: "desc",
        },
      },
      take: 5,
    });

    const result = await Promise.all(
      speciesData.map(async (item) => {
        const species = await prisma.fishSpecies.findUnique({
          where: { id: item.fishId },
        });
        return {
          name: species?.localName || species?.name || "Unknown",
          weight: item._sum.weight || 0,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching species distribution:", error);
    return [];
  }
}

export async function getMonthlyTrends() {
  try {
    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);

    const catches = await prisma.catch.findMany({
      where: {
        date: {
          gte: last6Months,
        },
      },
      include: {
        details: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const monthlyData: { [key: string]: { month: string; weight: number; count: number } } = {};

    for (const c of catches) {
      const monthStr = new Date(c.date).toLocaleDateString("en-US", { month: "short" });
      if (!monthlyData[monthStr]) {
        monthlyData[monthStr] = { month: monthStr, weight: 0, count: 0 };
      }
      monthlyData[monthStr].weight += c.details.reduce((sum, d) => sum + d.weight, 0);
      monthlyData[monthStr].count += 1;
    }

    return Object.values(monthlyData);
  } catch (error) {
    console.error("Error fetching monthly trends:", error);
    return [];
  }
}
