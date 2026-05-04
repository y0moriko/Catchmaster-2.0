"use client";

import { useState, useRef, useEffect } from "react";
import { Fish, Ship, Scale, ThermometerSun, Save, ArrowRight } from "lucide-react";
import { createCatch } from "@/lib/actions/catch";

interface LogEntry {
  fisherman: string;
  species: string;
  quantity: string;
  weight: string;
  location: string;
}

const FISHERMAN_LIST = ["Juan Dela Cruz", "Maria Santos", "Pedro Reyes", "Ana Lim"];
const FISH_LIST = ["Tuna", "Tilapia", "Milkfish", "Galunggong", "Crab", "Shrimp"];
const LOCATIONS = ["Agdangan Landing", "Lalawigan", "Binagbagan", "Dayap"];

export default function SpeedLogPage() {
  const [entry, setEntry] = useState<LogEntry>({
    fisherman: "", species: "", quantity: "", weight: "", location: ""
  });
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      if (step < 4) setStep(step + 1);
      else handleSave();
    }
    if (e.key === "Escape") {
      setStep(0);
      setEntry({ fisherman: "", species: "", quantity: "", weight: "", location: "" });
    }
  };

  const handleSave = async () => {
    if (!entry.fisherman || !entry.species || !entry.weight) return;
    setSaving(true);
    try {
      await createCatch({
        fishermanId: "fisherman-001",
        recordedBy: "user-admin",
        location: entry.location || "Agdangan",
        weatherCondition: "Sunny",
        details: [{
          fishId: "fish-001",
          quantity: parseInt(entry.quantity) || 1,
          weight: parseFloat(entry.weight) || 0
        }]
      });
      setLogs([entry, ...logs]);
      setEntry({ fisherman: "", species: "", quantity: "", weight: "", location: "" });
      setStep(0);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const fields = [
    { key: "fisherman", label: "Fisherman", icon: Ship, placeholder: "Type name...", list: FISHERMAN_LIST },
    { key: "species", label: "Species", icon: Fish, placeholder: "Type species...", list: FISH_LIST },
    { key: "quantity", label: "Qty", icon: Scale, placeholder: "e.g. 10", list: null },
    { key: "weight", label: "Weight (kg)", icon: Scale, placeholder: "e.g. 45.5", list: null },
    { key: "location", label: "Location", icon: ThermometerSun, placeholder: "Landing site...", list: LOCATIONS },
  ];

  const progress = (step / fields.length) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Speed-Log</h1>
        <p className="text-muted-foreground">Keyboard-only rapid data entry. Press Tab/Enter to advance, Esc to reset.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-8 shadow-sm max-w-2xl">
        <div className="mb-6">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">
            Step {step + 1} of {fields.length}: {fields[step].label}
          </p>
        </div>

        <div className="space-y-4">
          {fields.map((field, i) => (
            <div key={field.key} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${i === step ? "bg-primary/5 border border-primary/20" : "bg-slate-50"}`}>
              <field.icon className={`w-5 h-5 ${i === step ? "text-primary" : "text-slate-300"}`} />
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{field.label}</p>
                {i === step ? (
                  <input
                    ref={inputRef}
                    type="text"
                    list={field.list ? `${field.key}-list` : undefined}
                    value={entry[field.key as keyof LogEntry]}
                    onChange={(e) => setEntry({ ...entry, [field.key]: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent text-lg font-bold text-primary outline-none"
                  />
                ) : (
                  <p className="text-lg font-bold text-primary">{entry[field.key as keyof LogEntry] || "—"}</p>
                )}
                {field.list && (
                  <datalist id={`${field.key}-list`}>
                    {field.list.map(v => <option key={v} value={v} />)}
                  </datalist>
                )}
              </div>
              {i === step && <ArrowRight className="w-4 h-4 text-primary animate-pulse" />}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || !entry.fisherman || !entry.species}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save [Enter]"}
          </button>
          <button
            onClick={() => { setStep(0); setEntry({ fisherman: "", species: "", quantity: "", weight: "", location: "" }); }}
            className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 text-sm"
          >
            Reset [Esc]
          </button>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-primary mb-4">Today's Quick Logs ({logs.length})</h3>
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Ship className="w-4 h-4 text-primary/40" />
                  <span className="font-bold text-sm text-primary">{log.fisherman}</span>
                  <span className="text-xs text-slate-500">{log.species}</span>
                </div>
                <span className="font-bold text-sm text-primary">{log.weight}kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
