"use client";

import { useState } from "react";
import { Search, MoreVertical, Fish, User, Trash2, Pencil, Scale, MapPin } from "lucide-react";
import { deleteCatch } from "@/lib/actions/catch";
import EditCatchModal from "./EditCatchModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

interface CatchDetails {
  id: string;
  fishId: string;
  quantity: number;
  weight: number;
  fish: {
    id: string;
    name: string;
    localName: string;
  };
}

interface CatchRecord {
  id: string;
  date: Date;
  location: string | null;
  fishermanId: string;
  fisherman: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  weatherCondition: string | null;
  temperature: number | null;
  windSpeed: number | null;
  tideLevel: string | null;
  details: CatchDetails[];
}

export default function CatchesList({ initialData, fishermen, species }: {
  initialData: CatchRecord[];
  fishermen: { id: string; name: string }[];
  species: { id: string; name: string; localName: string }[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCatch, setEditingCatch] = useState<CatchRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const filteredCatches = initialData.filter((c) => {
    const fishermanName = `${c.fisherman.user.firstName} ${c.fisherman.user.lastName}`.toLowerCase();
    const matchesSearch =
      fishermanName.includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({ message: "Are you sure you want to delete this catch record?", variant: "danger" });
    if (!confirmed) return;

    setDeletingId(id);
    const result = await deleteCatch(id);

    if (result.success) {
      showToast("Catch record deleted successfully", "success");
      router.refresh();
    } else {
      showToast(result.error || "Failed to delete catch record", "error");
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
    if (selectedIds.size === filteredCatches.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCatches.map((c) => c.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = await confirm({
      message: `Are you sure you want to delete ${selectedIds.size} catch records?`,
      variant: "danger",
      confirmLabel: `Delete ${selectedIds.size}`,
    });
    if (!confirmed) return;

    setIsBatchDeleting(true);
    let success = 0;
    let failed = 0;
    for (const id of selectedIds) {
      const result = await deleteCatch(id);
      if (result.success) success++; else failed++;
    }
    setSelectedIds(new Set());
    setIsBatchDeleting(false);
    if (failed === 0) {
      showToast(`${success} catch records deleted successfully`, "success");
    } else {
      showToast(`${success} deleted, ${failed} failed`, "error");
    }
    router.refresh();
  };

  const getTotalWeight = (details: CatchDetails[]) => {
    return details.reduce((sum, d) => sum + d.weight, 0);
  };

  const getTotalQuantity = (details: CatchDetails[]) => {
    return details.reduce((sum, d) => sum + d.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search by fisherman or location..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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

      <div className="space-y-4">
        {filteredCatches.map((catchRecord) => (
          <div key={catchRecord.id} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="absolute top-4 left-4 z-10">
              <input
                type="checkbox"
                checked={selectedIds.has(catchRecord.id)}
                onChange={() => toggleSelect(catchRecord.id)}
                className="rounded border-border accent-primary cursor-pointer"
              />
            </div>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingCatch(catchRecord)}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(catchRecord.id)}
                disabled={deletingId === catchRecord.id}
                className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Fish className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">
                    {catchRecord.fisherman.user.firstName} {catchRecord.fisherman.user.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(catchRecord.date).toLocaleDateString()} at {new Date(catchRecord.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Scale className="w-4 h-4" />
                  <span>{getTotalWeight(catchRecord.details).toFixed(2)} kg</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {getTotalQuantity(catchRecord.details)} fish(es)
                </div>
              </div>
            </div>

            {catchRecord.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="w-4 h-4" />
                <span>{catchRecord.location}</span>
              </div>
            )}

            <div className="space-y-2">
              {catchRecord.details.map((detail) => (
                <div key={detail.id} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg">
                  <span className="font-medium">{detail.fish.localName || detail.fish.name}</span>
                  <div className="flex gap-4 text-muted-foreground">
                    <span>{detail.quantity} pcs</span>
                    <span>{detail.weight} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredCatches.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl border border-dashed border-border text-muted-foreground">
            No catch records found.
          </div>
        )}
      </div>

      {editingCatch && (
        <EditCatchModal
          catchRecord={editingCatch}
          fishermen={fishermen}
          species={species}
          onClose={() => setEditingCatch(null)}
        />
      )}

      {confirmDialog}
    </div>
  );
}
