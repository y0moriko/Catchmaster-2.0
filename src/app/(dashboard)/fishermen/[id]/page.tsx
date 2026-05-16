import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Fish, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import CatchHistory from "@/components/fishermen/CatchHistory";

interface FishermanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FishermanDetailPage({ params }: FishermanDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const fisherman = await prisma.fisherman.findUnique({
    where: { id },
    include: {
      user: true,
      catches: {
        include: {
          details: {
            include: {
              fish: true,
            },
          },
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!fisherman) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Fisherman not found.</p>
        <Link href="/fishermen" className="text-primary hover:underline mt-4 inline-block">
          ← Back to Fishermen
        </Link>
      </div>
    );
  }

  const totalWeight = fisherman.catches.reduce(
    (acc, c) => acc + c.details.reduce((sum, d) => sum + d.weight, 0),
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/fishermen" className="text-primary hover:underline">
          ← Back
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {fisherman.imageUrl ? (
            <img src={fisherman.imageUrl} alt="" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
              {fisherman.user.firstName[0]}{fisherman.user.lastName[0]}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary">
              {fisherman.user.firstName} {fisherman.user.lastName}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {fisherman.barangay}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> {fisherman.contactNumber}
              </span>
              <span className="flex items-center gap-1">
                <Fish className="w-4 h-4" /> {fisherman.catches.length} trips
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Catch</p>
            <p className="text-3xl font-bold text-primary">{totalWeight.toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      <CatchHistory catches={fisherman.catches} />
    </div>
  );
}
