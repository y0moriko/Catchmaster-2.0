import { getFishermen } from "@/lib/actions/fisherman";
import FishermenList from "@/components/fishermen/FishermenList";
import AddFishermanModal from "@/components/fishermen/AddFishermanModal";

export default async function FishermenPage() {
  const fishermenResult = await getFishermen();
  const fishermen = Array.isArray(fishermenResult) ? fishermenResult : fishermenResult.data;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Fishermen Management</h1>
          <p className="text-muted-foreground">Manage and track registered fishermen in Agdangan.</p>
        </div>
        <AddFishermanModal />
      </div>

      <FishermenList initialData={fishermen} />
    </div>
  );
}
