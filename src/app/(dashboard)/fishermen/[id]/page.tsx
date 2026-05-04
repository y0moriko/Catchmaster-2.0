import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Fish, MapPin, Phone, BarChart3 } from "lucide-react";
import Link from "next/link";

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
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
            {fisherman.user.firstName[0]}{fisherman.user.lastName[0]}
          </div>
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

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Catch History
        </h2>
        <div className="space-y-4">
          {fisherman.catches.length > 0 ? (
            fisherman.catches.map((c) => (
              <div key={c.id} className="border-b border-slate-50 pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-primary">
                      {new Date(c.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{c.location || "Landing Site"}</p>
                  </div>
                  <p className="font-bold text-primary">
                    {c.details.reduce((sum, d) => sum + d.weight, 0).toFixed(1)} kg
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {c.details.map((d) => (
                    <span key={d.id} className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                      {d.fish.name} ({d.weight}kg)
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic text-center py-8">No catches recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
