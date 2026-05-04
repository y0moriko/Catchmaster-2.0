import { getFishSpecies } from "@/lib/actions/fishSpecies";
import FishDirectoryList from "@/components/fish/FishDirectoryList";
import AddFishSpeciesModal from "@/components/fish/AddFishSpeciesModal";
import ImportPDFFishModal from "@/components/fish/ImportPDFFishModal";

export default async function FishDirectoryPage() {
  const result = await getFishSpecies(1, 500);
  const fish = result.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Fish Directory</h1>
          <p className="text-muted-foreground">Browse fish species from Tayabas Bay, Agdangan coastline.</p>
        </div>
        <div className="flex gap-3">
          <ImportPDFFishModal />
          <AddFishSpeciesModal />
        </div>
      </div>

      <FishDirectoryList initialData={fish} />
    </div>
  );
}
