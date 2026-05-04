"use client";

import { useState } from "react";
import { Upload, X, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { createManyFishSpecies } from "@/lib/actions/fishSpecies";

interface FishPreview {
  name: string;
  localName: string;
  scientificName?: string;
  family?: string;
  habitat?: string;
  length?: number;
  trophicLevel?: number;
  status?: string;
}

export default function ImportPDFFishModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<FishPreview[]>([]);

  const parseTextContent = (text: string): FishPreview[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const fish: FishPreview[] = [];

    for (const line of lines) {
      const parts = line.split(/\t| {2,}/);
      if (parts.length >= 2) {
        const [scientificName, localName, family, habitat, lengthStr, trophicStr, status] = parts.map(p => p.trim());

        if (scientificName && localName) {
          fish.push({
            name: localName,
            localName: localName,
            scientificName: scientificName,
            family: family || undefined,
            habitat: habitat || undefined,
            length: lengthStr ? parseFloat(lengthStr) : undefined,
            trophicLevel: trophicStr ? parseFloat(trophicStr) : undefined,
            status: status || "native",
          });
        }
      }
    }

    return fish;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsLoading(true);

    try {
      if (file.type === "application/pdf") {
        // Use API route to parse PDF server-side
        const formData = new FormData();
        formData.append("pdfFile", file);

        const response = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success && result.data) {
          setPreview(result.data as FishPreview[]);
        } else {
          setError(result.error || "Failed to parse PDF");
        }
      } else {
        // Text file - parse client-side
        const text = await file.text();
        const parsed = parseTextContent(text);
        setPreview(parsed);
      }
    } catch (err) {
      setError("Failed to read file: " + (err instanceof Error ? err.message : String(err)));
    }
    setIsLoading(false);
  };

  const handlePasteData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text.trim()) {
      setPreview([]);
      return;
    }
    const parsed = parseTextContent(text);
    setPreview(parsed);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setIsLoading(true);
    setError("");

    const result = await createManyFishSpecies(preview);

    if (result.success) {
      setIsOpen(false);
      setPreview([]);
      window.location.reload();
    } else {
      setError(result.error || "Failed to import fish species");
    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
      >
        <Upload className="w-5 h-5" />
        Import from PDF/Text
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-primary">Import Fish Species</h2>
              <button onClick={() => { setIsOpen(false); setPreview([]); setError(""); }} className="text-muted-foreground hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <strong>AI-Powered PDF Import:</strong> Upload a PDF with fish species table, and AI will automatically extract and parse the data for you.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Columns: Scientific Name, Local Name, Family, Habitat, Length(cm), Trophic Level, Status
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Paste Table Data</label>
                <textarea
                  rows={8}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
                  placeholder="Paste your table data here, one row per line...&#10;Format: Scientific Name, Local Name, Family, Habitat, Length(cm), Trophic Level, Status"
                  onChange={handlePasteData}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Or Upload File (PDF/TXT/CSV)</label>
                <input
                  type="file"
                  accept=".pdf,.txt,.csv,.tsv"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 rounded-lg border border-border"
                />
              </div>

              {preview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Preview: {preview.length} fish species found</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                    {preview.slice(0, 10).map((fish, i) => (
                      <div key={i} className="px-4 py-2 border-b border-border text-sm flex justify-between">
                        <span className="font-medium">{fish.localName}</span>
                        <span className="text-muted-foreground text-xs">{fish.scientificName}</span>
                      </div>
                    ))}
                    {preview.length > 10 && (
                      <div className="px-4 py-2 text-xs text-muted-foreground text-center">
                        ...and {preview.length - 10} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); setPreview([]); setError(""); }}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={isLoading || preview.length === 0}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Importing..." : `Import ${preview.length} Species`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
