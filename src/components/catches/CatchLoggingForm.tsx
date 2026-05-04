"use client";

import { useState } from "react";
import { Plus, Trash2, Check, User, MapPin, Scale, Layers } from "lucide-react";
import { createCatch } from "@/lib/actions/catch";
import { useToast } from "@/components/Toast";

interface Fisherman {
  id: string;
  name: string;
}

interface FishSpecies {
  id: string;
  name: string;
  localName: string;
}

export default function CatchLoggingForm({
  fishermen,
  species,
  userId
}: {
  fishermen: Fisherman[],
  species: FishSpecies[],
  userId: string
}) {
  const [fishermanId, setFishermanId] = useState("");
  const [location, setLocation] = useState("");
  const [entries, setEntries] = useState([{ fishId: "", quantity: 1, weight: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const addEntry = () => setEntries([...entries, { fishId: "", quantity: 1, weight: 0 }]);
  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };
  
  const updateEntry = (index: number, field: string, value: string | number) => {
    const newEntries = [...entries];
    (newEntries[index] as any)[field] = value;
    setEntries(newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fishermanId) return showToast("Please select a fisherman", "error");

    setIsLoading(true);

    const validEntries = entries.filter(e => e.fishId && e.weight > 0);
    if (validEntries.length === 0) {
      setIsLoading(false);
      return showToast("Please add at least one fish entry with weight", "error");
    }

    const result = await createCatch({
      fishermanId,
      recordedBy: userId,
      location,
      details: validEntries
    });

    if (result.success) {
      setSuccess(true);
    } else {
      showToast(result.error || "Failed to record catch", "error");
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-border shadow-sm text-center space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Catch Recorded!</h2>
        <p className="text-muted-foreground">The fishing catch has been successfully logged into the system.</p>
        <button 
          onClick={() => { 
            setSuccess(false); 
            setEntries([{ fishId: "", quantity: 1, weight: 0 }]); 
            setFishermanId(""); 
            setLocation("");
          }}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          Log Another Catch
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      {/* Fisherman Selection */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <User className="w-5 h-5" />
          <h2 className="font-bold">1. Select Fisherman</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Fisherman Name</label>
            <select 
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
              value={fishermanId}
              onChange={(e) => setFishermanId(e.target.value)}
            >
              <option value="">Select a fisherman...</option>
              {fishermen.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Landing Location (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Brgy. Poblacion Pier"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fish Entries */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex justify-between items-center text-primary">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            <h2 className="font-bold">2. Add Fish Entries</h2>
          </div>
          <button 
            type="button" 
            onClick={addEntry}
            className="text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>

        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex-[2] space-y-2">
                {index === 0 && <label className="text-sm font-medium text-slate-700">Fish Species</label>}
                <select 
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                  value={entry.fishId}
                  onChange={(e) => updateEntry(index, "fishId", e.target.value)}
                >
                  <option value="">Select fish...</option>
                  {species.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.localName})</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 space-y-2">
                {index === 0 && <label className="text-sm font-medium text-slate-700">Quantity</label>}
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input 
                    type="number" 
                    min="1"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={entry.quantity}
                    onChange={(e) => updateEntry(index, "quantity", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {index === 0 && <label className="text-sm font-medium text-slate-700">Weight (kg)</label>}
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={entry.weight}
                    onChange={(e) => updateEntry(index, "weight", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => removeEntry(index)}
                disabled={entries.length === 1}
                className="p-3 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Total Weight: <span className="font-bold text-primary">{entries.reduce((acc, e) => acc + (e.weight || 0), 0).toFixed(1)} kg</span>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-xl disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0"
          >
            {isLoading ? "Recording..." : "Save Catch Record"}
          </button>
        </div>
      </div>
    </form>
  );
}
