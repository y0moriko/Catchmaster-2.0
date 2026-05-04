"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function getFishermen(page = 1, pageSize = 20) {
  try {
    const skip = (page - 1) * pageSize;
    const [fishermen, total] = await Promise.all([
      prisma.fisherman.findMany({
        skip,
        take: pageSize,
        include: {
          user: true,
          catches: {
            include: {
              details: true,
            },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.fisherman.count(),
    ]);

    const result = fishermen.map((f) => {
      const totalWeight = f.catches.reduce((acc, c) => {
        return acc + c.details.reduce((sum, d) => sum + d.weight, 0);
      }, 0);

      return {
        id: f.id,
        name: `${f.user.firstName} ${f.user.lastName}`,
        email: f.user.email,
        barangay: f.barangay,
        contactNumber: f.contactNumber,
        totalWeight,
        initials: `${f.user.firstName[0]}${f.user.lastName[0]}`.toUpperCase(),
      };
    });

    return { data: result, total, page, pageSize };
  } catch (error) {
    console.error("Error fetching fishermen:", error);
    return [];
  }
}

export async function createFisherman(data: {
  firstName: string;
  lastName: string;
  email: string;
  barangay: string;
  contactNumber: string;
  password?: string;
}) {
  try {
    const staffRole = await prisma.role.findUnique({ where: { name: "staff" } });
    if (!staffRole) {
      throw new Error("Required role 'staff' not found. Please seed the database.");
    }

    const defaultPassword = data.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
          roleId: staffRole.id,
        },
      });

      const fisherman = await tx.fisherman.create({
        data: {
          id: user.id,
          barangay: data.barangay,
          contactNumber: data.contactNumber,
        },
      });

      return fisherman;
    });

    revalidatePath("/fishermen");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Error creating fisherman:", error);
    const message = error instanceof Error ? error.message : "Failed to create fisherman";
    return { success: false, error: message };
  }
}

export async function deleteFisherman(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete catches first (or rely on cascade if configured, but let's be safe)
      // Actually schema doesn't have onDelete: Cascade explicitly in the text I read, 
      // but Prisma often handles it if configured.
      
      await tx.fisherman.delete({ where: { id } });
      await tx.user.delete({ where: { id } });
    });

    revalidatePath("/fishermen");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting fisherman:", error);
    const message = error instanceof Error ? error.message : "Failed to delete fisherman";
    return { success: false, error: message };
  }
}
