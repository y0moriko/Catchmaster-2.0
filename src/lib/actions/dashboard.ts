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
        take: 1,
      }),
      prisma.user.count(),
    ]);

    let topSpeciesName = "None";
    if (topSpeciesResult.length > 0) {
      const species = await prisma.fishSpecies.findUnique({
        where: { id: topSpeciesResult[0].fishId },
      });
      topSpeciesName = species?.name || "Unknown";
    }

    return {
      totalWeight: totalWeightResult._sum.weight || 0,
      activeFishermen: activeFishermenCount,
      topSpecies: topSpeciesName,
      totalUsers: totalUsersCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalWeight: 0,
      activeFishermen: 0,
      topSpecies: "None",
      totalUsers: 0,
    };
  }
}
