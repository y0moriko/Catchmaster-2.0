import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const fisherman = await prisma.fisherman.findUnique({
    where: { id },
    include: {
      user: true,
      catches: {
        include: { details: { include: { fish: true } } },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!fisherman) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(fisherman);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.$transaction(async (tx) => {
    await tx.fisherman.delete({ where: { id } });
    await tx.user.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}
