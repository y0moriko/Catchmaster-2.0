"use client";

import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import { updateFishSpecies } from "@/lib/actions/fishSpecies";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

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

export default function EditFishSpeciesModal({ fish, onClose }: { fish: FishSpecies; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(fish.imageUrl || null);
  const [formData, setFormData] = useState({
    name: fish.name,
    localName: fish.localName,
    scientificName: fish.scientificName || "",
    family: fish.family || "",
    habitat: fish.habitat || "",
    length: fish.length?.toString() || "",
    trophicLevel: fish.trophicLevel?.toString() || "",
    status: fish.status || "native",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await updateFishSpecies(fish.id, {
      name: formData.name,
      localName: formData.localName,
      scientificName: formData.scientificName || undefined,
      family: formData.family || undefined,
      habitat: formData.habitat || undefined,
      length: formData.length ? parseFloat(formData.length) : undefined,
      trophicLevel: formData.trophicLevel ? parseFloat(formData.trophicLevel) : undefined,
      status: formData.status,
      imageUrl: imageUrl || undefined,
    });

    if (result.success) {
      onClose();
      router.refresh();
    } else {
      setError(("error" in result && result.error) || "Failed to update fish species");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
      <div className="flex items-center justify-center min-h-screen p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-0 sm:mx-auto">
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-primary">Edit Fish Species</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Species Name *</label>
              <input
                required
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Local Name *</label>
              <input
                required
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.localName}
                onChange={(e) => setFormData({ ...formData, localName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Scientific Name</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
              value={formData.scientificName}
              onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
              placeholder="e.g., Acanthurus mata"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Family</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.family}
                onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                placeholder="e.g., Acanthuridae"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Habitat</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.habitat}
                onChange={(e) => setFormData({ ...formData, habitat: e.target.value })}
                placeholder="e.g., reef-associated"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Length (cm)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                placeholder="50.0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trophic Level</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.trophicLevel}
                onChange={(e) => setFormData({ ...formData, trophicLevel: e.target.value })}
                placeholder="2.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="native">Native</option>
                <option value="endangered">Endangered</option>
                <option value="threatened">Threatened</option>
                <option value="introduced">Introduced</option>
                  </select>
                </div>
              </div>

              <ImageUpload value={imageUrl} onChange={setImageUrl} label="Fish Image" />

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg font-medium disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
        </form>
      </div>
      </div>
    </div>
  );
}
