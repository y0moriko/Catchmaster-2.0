import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
  const fishermanId = searchParams.get("fishermanId");

  const catches = await prisma.catch.findMany({
    where: fishermanId ? { fishermanId } : undefined,
    take: limit,
    orderBy: { date: "desc" },
    include: {
      fisherman: { include: { user: true } },
      details: { include: { fish: true } },
    },
  });

  return NextResponse.json(catches);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fishermanId, location, details } = body;

    const result = await prisma.$transaction(async (tx) => {
      const newCatch = await tx.catch.create({
        data: {
          fishermanId,
          recordedBy: (session.user as { id?: string })?.id || "",
          location,
          details: { create: details },
        },
        include: { details: true },
      });
      return newCatch;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating catch:", error);
    return NextResponse.json({ error: "Failed to create catch" }, { status: 500 });
  }
}
