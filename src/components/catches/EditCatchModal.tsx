"use client";

import { useState } from "react";
import { X, Pencil } from "lucide-react";
import { updateCatch } from "@/lib/actions/catch";
import { useRouter } from "next/navigation";

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
  fishermanId: string;
  location: string | null;
  weatherCondition: string | null;
  temperature: number | null;
  windSpeed: number | null;
  tideLevel: string | null;
  details: CatchDetails[];
}

interface Fisherman {
  id: string;
  name: string;
}

interface FishSpecies {
  id: string;
  name: string;
  localName: string;
}

export default function EditCatchModal({ catchRecord, fishermen, species, onClose }: {
  catchRecord: CatchRecord;
  fishermen: Fisherman[];
  species: FishSpecies[];
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fishermanId: catchRecord.fishermanId,
    location: catchRecord.location || "",
    weatherCondition: catchRecord.weatherCondition || "",
    temperature: catchRecord.temperature?.toString() || "",
    windSpeed: catchRecord.windSpeed?.toString() || "",
    tideLevel: catchRecord.tideLevel || "",
  });
  const [details, setDetails] = useState(
    catchRecord.details.map((d) => ({
      fishId: d.fishId,
      quantity: d.quantity,
      weight: d.weight,
    }))
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await updateCatch(catchRecord.id, {
      fishermanId: formData.fishermanId,
      location: formData.location || undefined,
      weatherCondition: formData.weatherCondition || undefined,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      windSpeed: formData.windSpeed ? parseFloat(formData.windSpeed) : undefined,
      tideLevel: formData.tideLevel || undefined,
      details,
    });

    if (result.success) {
      onClose();
      router.refresh();
    } else {
      setError(("error" in result && result.error) || "Failed to update catch record");
    }
    setIsLoading(false);
  };

  const addDetail = () => {
    setDetails([...details, { fishId: species[0]?.id || "", quantity: 1, weight: 0 }]);
  };

  const removeDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const updateDetail = (index: number, field: string, value: string | number) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDetails(newDetails);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-primary">Edit Catch Record</h2>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Fisherman</label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
              value={formData.fishermanId}
              onChange={(e) => setFormData({ ...formData, fishermanId: e.target.value })}
            >
              {fishermen.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Location</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Fishing location"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Weather Condition</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.weatherCondition}
                onChange={(e) => setFormData({ ...formData, weatherCondition: e.target.value })}
                placeholder="e.g., Sunny, Rainy"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Wind Speed (km/h)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.windSpeed}
                onChange={(e) => setFormData({ ...formData, windSpeed: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tide Level</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                value={formData.tideLevel}
                onChange={(e) => setFormData({ ...formData, tideLevel: e.target.value })}
              >
                <option value="">Select</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Catch Details</label>
              <button
                type="button"
                onClick={addDetail}
                className="text-sm text-primary hover:underline"
              >
                + Add Fish
              </button>
            </div>
            {details.map((detail, index) => (
              <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg">
                <select
                  required
                  className="flex-1 px-3 py-2 rounded border border-border bg-white text-sm"
                  value={detail.fishId}
                  onChange={(e) => updateDetail(index, "fishId", e.target.value)}
                >
                  {species.map((s) => (
                    <option key={s.id} value={s.id}>{s.localName || s.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Qty"
                  className="w-20 px-3 py-2 rounded border border-border text-sm"
                  value={detail.quantity}
                  onChange={(e) => updateDetail(index, "quantity", parseInt(e.target.value) || 0)}
                />
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  placeholder="Weight"
                  className="w-24 px-3 py-2 rounded border border-border text-sm"
                  value={detail.weight}
                  onChange={(e) => updateDetail(index, "weight", parseFloat(e.target.value) || 0)}
                />
                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

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
  );
}
