"use client";

import { useState } from "react";
import { Search, MoreVertical, Phone, MapPin, Pencil, Trash2, LayoutGrid, Table as TableIcon } from "lucide-react";
import { deleteFisherman } from "@/lib/actions/fisherman";
import EditFishermanModal from "./EditFishermanModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

interface Fisherman {
  id: string;
  name: string;
  email: string;
  barangay: string;
  contactNumber: string;
  totalWeight: number;
  initials: string;
}

export default function FishermenList({ initialData }: { initialData: Fisherman[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("All Barangays");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [editingFisherman, setEditingFisherman] = useState<Fisherman | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const filteredFishermen = initialData.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBarangay = barangayFilter === "All Barangays" || f.barangay === barangayFilter;

    return matchesSearch && matchesBarangay;
  });

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({ message: "Are you sure you want to delete this fisherman?", variant: "danger" });
    if (!confirmed) return;

    setDeletingId(id);
    const result = await deleteFisherman(id);

    if (result.success) {
      showToast("Fisherman deleted successfully", "success");
      router.refresh();
    } else {
      showToast(result.error || "Failed to delete fisherman", "error");
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
    if (selectedIds.size === filteredFishermen.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFishermen.map((f) => f.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = await confirm({
      message: `Are you sure you want to delete ${selectedIds.size} fishermen?`,
      variant: "danger",
      confirmLabel: `Delete ${selectedIds.size}`,
    });
    if (!confirmed) return;

    setIsBatchDeleting(true);
    let success = 0;
    let failed = 0;
    for (const id of selectedIds) {
      const result = await deleteFisherman(id);
      if (result.success) success++; else failed++;
    }
    setSelectedIds(new Set());
    setIsBatchDeleting(false);
    if (failed === 0) {
      showToast(`${success} fishermen deleted successfully`, "success");
    } else {
      showToast(`${success} deleted, ${failed} failed`, "error");
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or barangay..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={barangayFilter}
          onChange={(e) => setBarangayFilter(e.target.value)}
        >
          <option>All Barangays</option>
          <option>Poblacion</option>
          <option>Ilayang Polo</option>
          <option>Kanlurang Calutan</option>
          <option>Silangang Calutan</option>
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
                    checked={selectedIds.size === filteredFishermen.length && filteredFishermen.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border accent-primary"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Barangay</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total Catch</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFishermen.map((fisherman) => (
                <tr key={fisherman.id} className="border-b border-border hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(fisherman.id)}
                      onChange={() => toggleSelect(fisherman.id)}
                      className="rounded border-border accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                        {fisherman.initials}
                      </div>
                      <div>
                        <span className="font-medium text-primary">{fisherman.name}</span>
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Active</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{fisherman.barangay}</td>
                  <td className="px-4 py-3">{fisherman.contactNumber}</td>
                  <td className="px-4 py-3 text-right font-medium">{fisherman.totalWeight.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingFisherman(fisherman)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fisherman.id)}
                        disabled={deletingId === fisherman.id}
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
          {filteredFishermen.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No fishermen found matching your criteria.
            </div>
          )}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFishermen.map((fisherman) => (
          <div key={fisherman.id} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="absolute top-4 left-4 z-10">
              <input
                type="checkbox"
                checked={selectedIds.has(fisherman.id)}
                onChange={() => toggleSelect(fisherman.id)}
                className="rounded border-border accent-primary cursor-pointer"
              />
            </div>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingFisherman(fisherman)}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(fisherman.id)}
                disabled={deletingId === fisherman.id}
                className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                {fisherman.initials}
              </div>
              <div>
                <h3 className="font-semibold text-primary">{fisherman.name}</h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Active</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Brgy. {fisherman.barangay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{fisherman.contactNumber}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="text-xs">
                <p className="text-muted-foreground">Total Catch</p>
                <p className="font-bold text-primary">{fisherman.totalWeight.toLocaleString()} kg</p>
              </div>
              <button className="text-sm font-semibold text-primary hover:underline">
                View Profile
              </button>
            </div>
          </div>
        ))}

        {filteredFishermen.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-border text-muted-foreground">
            No fishermen found matching your criteria.
          </div>
        )}
        </div>
      )}

      {editingFisherman && (
        <EditFishermanModal
          fisherman={editingFisherman}
          onClose={() => setEditingFisherman(null)}
        />
      )}

      {confirmDialog}
    </div>
  );
}
