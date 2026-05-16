"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { createFishSpecies } from "@/lib/actions/fishSpecies";
import ImageUpload from "@/components/ImageUpload";

export default function AddFishSpeciesModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      localName: formData.get("localName") as string,
      scientificName: formData.get("scientificName") as string || undefined,
      family: formData.get("family") as string || undefined,
      habitat: formData.get("habitat") as string || undefined,
      length: formData.get("length") ? parseFloat(formData.get("length") as string) : undefined,
      trophicLevel: formData.get("trophicLevel") ? parseFloat(formData.get("trophicLevel") as string) : undefined,
      status: formData.get("status") as string || "native",
      imageUrl: imageUrl || undefined,
    };

    const result = await createFishSpecies(data);

    if (result.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError(result.error || "Failed to create fish species");
    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Add Fish Species
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
          <div className="flex items-center justify-center min-h-screen p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-0 sm:mx-auto">
            <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-primary">Add New Fish Species</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">
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
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Elongate surgeonfish"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Local Name *</label>
                  <input
                    name="localName"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Talisayon"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Scientific Name</label>
                <input
                  name="scientificName"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Acanthurus mata"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Family</label>
                  <input
                    name="family"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Acanthuridae"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Habitat</label>
                  <input
                    name="habitat"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="reef-associated"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Length (cm)</label>
                  <input
                    name="length"
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="50.0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Trophic Level</label>
                  <input
                    name="trophicLevel"
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="2.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    name="status"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
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
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg font-medium disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Fish Species"}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
