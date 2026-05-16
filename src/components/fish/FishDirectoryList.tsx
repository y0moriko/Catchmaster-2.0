"use client";

import { useState } from "react";
import { Search, MoreVertical, Fish, MapPin, Ruler, Activity, Pencil, Trash2, LayoutGrid, Table as TableIcon } from "lucide-react";
import { deleteFishSpecies } from "@/lib/actions/fishSpecies";
import EditFishSpeciesModal from "./EditFishSpeciesModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

interface FishSpecies {
  id: string;
  name: string;
  localName: string;
  scientificName: string | null;
  category: string | null;
  family: string | null;
  habitat: string | null;
  length: number | null;
  trophicLevel: number | null;
  status: string | null;
  imageUrl?: string | null;
}

export default function FishDirectoryList({ initialData }: { initialData: FishSpecies[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("All Families");
  const [habitatFilter, setHabitatFilter] = useState("All Habitats");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [editingFish, setEditingFish] = useState<FishSpecies | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const families = ["All Families", ...Array.from(new Set(initialData.map(f => f.family).filter((v): v is string => v !== null)))];
  const habitats = ["All Habitats", ...Array.from(new Set(initialData.map(f => f.habitat).filter((v): v is string => v !== null)))];
  const statuses = ["All Status", ...Array.from(new Set(initialData.map(f => f.status).filter((v): v is string => v !== null)))];

  const filteredFish = initialData.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.scientificName && f.scientificName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFamily = familyFilter === "All Families" || f.family === familyFilter;
    const matchesHabitat = habitatFilter === "All Habitats" || f.habitat === habitatFilter;
    const matchesStatus = statusFilter === "All Status" || f.status === statusFilter;

    return matchesSearch && matchesFamily && matchesHabitat && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700";
    if (status.toLowerCase().includes("native")) return "bg-green-100 text-green-700";
    if (status.toLowerCase().includes("endangered")) return "bg-red-100 text-red-700";
    if (status.toLowerCase().includes("threatened")) return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({ message: "Are you sure you want to delete this fish species?", variant: "danger" });
    if (!confirmed) return;

    setDeletingId(id);
    const result = await deleteFishSpecies(id);

    if (result.success) {
      showToast("Fish species deleted successfully", "success");
      router.refresh();
    } else {
      showToast(result.error || "Failed to delete fish species", "error");
    }
    setDeletingId(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredFish.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFish.map((f) => f.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = await confirm({
      message: `Are you sure you want to delete ${selectedIds.size} fish species?`,
      variant: "danger",
      confirmLabel: `Delete ${selectedIds.size}`,
    });
    if (!confirmed) return;

    setIsBatchDeleting(true);
    let success = 0;
    let failed = 0;
    for (const id of selectedIds) {
      const result = await deleteFishSpecies(id);
      if (result.success) success++; else failed++;
    }
    setSelectedIds(new Set());
    setIsBatchDeleting(false);
    if (failed === 0) {
      showToast(`${success} fish species deleted successfully`, "success");
    } else {
      showToast(`${success} deleted, ${failed} failed`, "error");
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, local name, or scientific name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={familyFilter}
          onChange={(e) => setFamilyFilter(e.target.value)}
        >
          {families.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={habitatFilter}
          onChange={(e) => setHabitatFilter(e.target.value)}
        >
          {habitats.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-slate-50"}`}
            title="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 transition-colors ${viewMode === "table" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-slate-50"}`}
            title="Table view"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">
          <span className="text-sm font-medium text-red-700">{selectedIds.size} selected</span>
          <button
            onClick={handleBatchDelete}
            disabled={isBatchDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isBatchDeleting ? "Deleting..." : `Delete Selected`}
          </button>
        </div>
      )}

      {viewMode === "table" ? (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredFish.length && filteredFish.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border accent-primary"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Local Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Scientific Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Family</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Habitat</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Length (cm)</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Trophic Level</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFish.map((fish) => (
                <tr key={fish.id} className="border-b border-border hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(fish.id)}
                      onChange={() => toggleSelect(fish.id)}
                      className="rounded border-border accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">{fish.localName}</td>
                  <td className="px-4 py-3 text-muted-foreground italic">{fish.scientificName || "—"}</td>
                  <td className="px-4 py-3">{fish.family || "—"}</td>
                  <td className="px-4 py-3">{fish.habitat || "—"}</td>
                  <td className="px-4 py-3 text-right">{fish.length ? `${fish.length} cm` : "—"}</td>
                  <td className="px-4 py-3 text-right">{fish.trophicLevel ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    {fish.status && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(fish.status)}`}>
                        {fish.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingFish(fish)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fish.id)}
                        disabled={deletingId === fish.id}
                        className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFish.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No fish species found matching your criteria.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFish.map((fish) => (
            <div key={fish.id} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.has(fish.id)}
                  onChange={() => toggleSelect(fish.id)}
                  className="rounded border-border accent-primary cursor-pointer"
                />
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingFish(fish)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(fish.id)}
                  disabled={deletingId === fish.id}
                  className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                {fish.imageUrl ? (
                  <img src={fish.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Fish className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-primary">{fish.localName}</h3>
                  <p className="text-xs text-muted-foreground italic">{fish.scientificName || fish.name}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {fish.family && (
                  <div className="flex items-center gap-2">
                    <Fish className="w-4 h-4" />
                    <span>Family: {fish.family}</span>
                  </div>
                )}
                {fish.habitat && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{fish.habitat}</span>
                  </div>
                )}
                {fish.length && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    <span>{fish.length} cm TL</span>
                  </div>
                )}
                {fish.trophicLevel && (
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Trophic Level: {fish.trophicLevel}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                {fish.status && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(fish.status)}`}>
                    {fish.status}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">Tayabas Bay</span>
              </div>
            </div>
          ))}

          {filteredFish.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-border text-muted-foreground">
              No fish species found matching your criteria.
            </div>
          )}
        </div>
      )}

      {editingFish && (
        <EditFishSpeciesModal
          fish={editingFish}
          onClose={() => setEditingFish(null)}
        />
      )}

      {confirmDialog}
    </div>
  );
}
