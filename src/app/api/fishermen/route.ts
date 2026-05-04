import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
  const skip = (page - 1) * pageSize;

  const [fishermen, total] = await Promise.all([
    prisma.fisherman.findMany({
      skip,
      take: pageSize,
      include: {
        user: true,
        catches: { include: { details: true } },
      },
      orderBy: { id: "desc" },
    }),
    prisma.fisherman.count(),
  ]);

  const data = fishermen.map((f) => ({
    id: f.id,
    name: `${f.user.firstName} ${f.user.lastName}`,
    email: f.user.email,
    barangay: f.barangay,
    contactNumber: f.contactNumber,
    totalWeight: f.catches.reduce(
      (acc, c) => acc + c.details.reduce((sum, d) => sum + d.weight, 0),
      0
    ),
  }));

  return NextResponse.json({ data, total, page, pageSize });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, barangay, contactNumber, password } = body;

    const staffRole = await prisma.role.findUnique({ where: { name: "staff" } });
    if (!staffRole) {
      return NextResponse.json({ error: "Staff role not found" }, { status: 500 });
    }

    const defaultPassword = password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          roleId: staffRole.id,
        },
      });

      const fisherman = await tx.fisherman.create({
        data: {
          id: user.id,
          barangay,
          contactNumber,
        },
      });

      return fisherman;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating fisherman:", error);
    const message = error instanceof Error ? error.message : "Failed to create fisherman";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
