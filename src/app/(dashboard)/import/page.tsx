"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from "lucide-react";
import { batchImportCatches } from "@/lib/actions/intelligence";

export default function ImportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ count: number } | null>(null);

  const fishermanMap: Record<string, string> = {
    "Juan Dela Cruz": "fisherman-001",
    "Maria Santos": "fisherman-002",
  };

  const fishMap: Record<string, string> = {
    "Tuna": "fish-001",
    "Tilapia": "fish-002",
    "Milkfish": "fish-003",
    "Galunggong": "fish-004",
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter(l => l.trim());
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    return lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
      const row: any = {};
      headers.forEach((h, i) => { row[h] = vals[i]; });
      return row;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const data = file.name.endsWith(".csv") ? parseCSV(text) : JSON.parse(text);
        if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid file format");
        setPreview(data.slice(0, 10));
        setStep("preview");
      } catch (err: any) {
        setError("Could not parse file. Please upload a valid CSV or Excel-exported JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setLoading(true);
    setError("");
    try {
      const mapped = preview.map(row => ({
        fishermanId: fishermanMap[row.Fisherman || row.fisherman || "Juan Dela Cruz"] || "fisherman-001",
        recordedBy: "user-admin",
        date: row.Date || row.date || new Date().toISOString(),
        location: row.Location || row.location || "Agdangan",
        weather: row.Weather || row.weather || "Sunny",
        details: [{
          fishId: fishMap[row.Species || row.species || "Tuna"] || "fish-001",
          quantity: parseInt(row.Quantity || row.quantity || "1"),
          weight: parseFloat(row.Weight || row.weight || "0")
        }]
      }));
      const res = await batchImportCatches(mapped);
      if (res.success) {
        setResult({ count: res.count || 0 });
        setStep("done");
      } else {
        setError(res.error || "Import failed");
      }
    } catch (err: any) {
      setError(err.message || "Import failed");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Batch Data Import</h1>
        <p className="text-muted-foreground">Upload Excel/CSV files to quickly import historical catch records.</p>
      </div>

      {step === "upload" && (
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer"
          >
            <CloudUpload className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="font-bold text-primary mb-1">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground">Supports .CSV, .XLSX (export as CSV), or JSON</p>
            <input ref={fileRef} type="file" accept=".csv,.json,.xlsx" onChange={handleFile} className="hidden" />
          </div>

          <div className="mt-6 bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Expected Columns</p>
            <p className="text-xs text-slate-600 font-mono">Fisherman, Date, Location, Species, Quantity, Weight, Weather</p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
      )}

      {step === "preview" && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary">Preview ({preview.length} records)</h3>
            <button onClick={() => setStep("upload")} className="text-xs text-muted-foreground hover:text-primary">Re-upload</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  {Object.keys(preview[0] || {}).map(k => (
                    <th key={k} className="text-left p-2 font-bold text-slate-500 uppercase">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Object.values(row).map((v: any, j) => (
                      <td key={j} className="p-2 text-slate-700">{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button
            onClick={handleImport}
            disabled={loading}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Importing..." : `Import ${preview.length} Records`}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-8 shadow-sm text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Import Complete!</h3>
          <p className="text-muted-foreground mb-4">{result?.count} records successfully imported.</p>
          <button
            onClick={() => { setStep("upload"); setPreview([]); setResult(null); }}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700"
          >
            Import More
          </button>
        </div>
      )}
    </div>
  );
}
