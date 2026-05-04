import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFishermen } from "@/lib/actions/fisherman";
import { getFishSpecies } from "@/lib/actions/catch";
import CatchLoggingForm from "@/components/catches/CatchLoggingForm";
import { redirect } from "next/navigation";

export default async function CatchesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [fishermenResult, species] = await Promise.all([
    getFishermen(),
    getFishSpecies(),
  ]);

  const fishermen = Array.isArray(fishermenResult) ? fishermenResult : fishermenResult.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Record New Catch</h1>
        <p className="text-muted-foreground">Log a new fishing catch for the Agdangan municipality records.</p>
      </div>

      <CatchLoggingForm
        fishermen={fishermen}
        species={species}
        userId={(session.user as { id?: string })?.id || ""}
      />
    </div>
  );
}
