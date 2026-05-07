import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFishermen } from "@/lib/actions/fisherman";
import { getFishSpecies, getCatches } from "@/lib/actions/catch";
import CatchLoggingForm from "@/components/catches/CatchLoggingForm";
import CatchesList from "@/components/catches/CatchesList";
import { redirect } from "next/navigation";

export default async function CatchesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [fishermenResult, species, catchesResult] = await Promise.all([
    getFishermen(),
    getFishSpecies(),
    getCatches(),
  ]);

  const fishermen = Array.isArray(fishermenResult) ? fishermenResult : fishermenResult.data;
  const catches = catchesResult.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Catches Management</h1>
        <p className="text-muted-foreground">Log and manage fishing catches for the Agdangan municipality records.</p>
      </div>

      <CatchLoggingForm
        fishermen={fishermen}
        species={species}
        userId={(session.user as { id?: string })?.id || ""}
      />

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-primary mb-6">Recent Catches</h2>
        <CatchesList
          initialData={catches}
          fishermen={fishermen}
          species={species}
        />
      </div>
    </div>
  );
}
