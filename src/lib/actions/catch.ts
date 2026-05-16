"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createCatchSchema = z.object({
  fishermanId: z.string().min(1, "Fisherman is required"),
  recordedBy: z.string().min(1, "Recorder ID is required"),
  location: z.string().optional(),
  weatherCondition: z.string().optional(),
  temperature: z.number().positive().optional(),
  windSpeed: z.number().positive().optional(),
  tideLevel: z.string().optional(),
  details: z.array(z.object({
    fishId: z.string().min(1, "Fish species is required"),
    quantity: z.number().int().positive("Quantity must be positive"),
    weight: z.number().positive("Weight must be positive"),
  })).min(1, "At least one fish detail is required"),
});

export async function getAllFishSpecies() {
  try {
    return await prisma.fishSpecies.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching fish species:", error);
    }
    return [];
  }
}

export async function getCatches(page = 1, pageSize = 20) {
  try {
    const skip = (page -1) * pageSize;
    const [catches, total] = await Promise.all([
      prisma.catch.findMany({
        skip,
        take: pageSize,
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
      }),
      prisma.catch.count(),
    ]);

    return { data: catches, total, page, pageSize };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching catches:", error);
    }
    return { data: [], total: 0, page, pageSize };
  }
}

export async function getCatchById(id: string) {
  try {
    const catchRecord = await prisma.catch.findUnique({
      where: { id },
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

    if (!catchRecord) {
      return { success: false, error: "Catch record not found" };
    }

    return { success: true, data: catchRecord };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching catch:", error);
    }
    const message = error instanceof Error ? error.message : "Failed to fetch catch";
    return { success: false, error: message };
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
    const validated = createCatchSchema.parse(data);

    const result = await prisma.$transaction(async (tx) => {
      const newCatch = await tx.catch.create({
        data: {
          fishermanId: validated.fishermanId,
          recordedBy: validated.recordedBy,
          location: validated.location,
          weatherCondition: validated.weatherCondition,
          temperature: validated.temperature,
          windSpeed: validated.windSpeed,
          tideLevel: validated.tideLevel,
          details: {
            create: validated.details,
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
    revalidatePath("/catches");

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Error creating catch:", error);
    const message = error instanceof Error ? error.message : "Failed to record catch";
    return { success: false, error: message };
  }
}

export async function updateCatch(id: string, data: {
  fishermanId?: string;
  location?: string;
  weatherCondition?: string;
  temperature?: number;
  windSpeed?: number;
  tideLevel?: string;
  details?: {
    fishId: string;
    quantity: number;
    weight: number;
  }[];
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      if (data.details) {
        await tx.catchDetail.deleteMany({
          where: { catchId: id },
        });
      }

      const updatedCatch = await tx.catch.update({
        where: { id },
        data: {
          ...(data.fishermanId && { fishermanId: data.fishermanId }),
          ...(data.location !== undefined && { location: data.location }),
          ...(data.weatherCondition !== undefined && { weatherCondition: data.weatherCondition }),
          ...(data.temperature !== undefined && { temperature: data.temperature }),
          ...(data.windSpeed !== undefined && { windSpeed: data.windSpeed }),
          ...(data.tideLevel !== undefined && { tideLevel: data.tideLevel }),
          ...(data.details && {
            details: {
              create: data.details,
            },
          }),
        },
        include: {
          details: true,
        },
      });

      return updatedCatch;
    });

    revalidatePath("/dashboard");
    revalidatePath("/fishermen");
    revalidatePath(`/fishermen/${data.fishermanId}`);
    revalidatePath("/catches");

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Error updating catch:", error);
    const message = error instanceof Error ? error.message : "Failed to update catch";
    return { success: false, error: message };
  }
}

export async function deleteCatch(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.catchDetail.deleteMany({
        where: { catchId: id },
      });

      await tx.catch.delete({
        where: { id },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/fishermen");
    revalidatePath("/catches");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting catch:", error);
    const message = error instanceof Error ? error.message : "Failed to delete catch";
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
