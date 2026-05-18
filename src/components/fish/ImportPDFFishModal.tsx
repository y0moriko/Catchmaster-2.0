"use client";

import { useState } from "react";
import { X, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { createManyFishSpecies } from "@/lib/actions/fishSpecies";
import { parseFishDataWithAI } from "@/lib/actions/fishSpecies";
import { useToast } from "@/components/Toast";

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
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<FishPreview[]>([]);
  const [aiProcessing, setAiProcessing] = useState(false);

  const handlePasteData = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text.trim()) {
      setPreview([]);
      return;
    }

    setAiProcessing(true);
    setError("");

    try {
      const result = await parseFishDataWithAI(text);
      if (result.success && result.data) {
        setPreview(result.data as FishPreview[]);
      } else {
        const errorMessage = result.error || "Failed to parse data with AI";
        setError(errorMessage);
        showToast(errorMessage, "error");
        setPreview([]);
      }
    } catch (err) {
      const errorMessage = "Failed to parse: " + (err instanceof Error ? err.message : String(err));
      setError(errorMessage);
      showToast(errorMessage, "error");
      setPreview([]);
    }
    setAiProcessing(false);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setIsLoading(true);
    setError("");

    const result = await createManyFishSpecies(preview);

    if (result.success) {
      showToast("Species imported successfully!", "success");
      setIsOpen(false);
      setPreview([]);
      window.location.reload();
    } else {
      const errorMessage = result.error || "Failed to import fish species";
      setError(errorMessage);
      showToast(errorMessage, "error");
    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
      >
        <Sparkles className="w-5 h-5" />
        Import with AI
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-primary">Import Fish Species with AI</h2>
              <button onClick={() => { setIsOpen(false); setPreview([]); setError(""); }} className="text-muted-foreground hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <strong>AI-Powered Import:</strong> Paste your fish species table data below. 
                  AI will automatically extract and parse all fish species information.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Supports any format - tables, lists, CSV, TSV. AI will figure out the structure.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Paste Fish Species Data</label>
                <textarea
                  rows={10}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
                  placeholder="Paste your fish species data here...&#10;&#10;Example formats:&#10;1. Table: Species Name | Family | Habitat | Length | Trophic Level | Status&#10;2. CSV: Acanthurus mata, Elongate surgeonfish, Acanthuridae, reef-associated, 50.0, 2.5, native&#10;3. Or just paste the raw text from your PDF!"
                  onChange={handlePasteData}
                />
                {aiProcessing && (
                  <div className="text-xs text-blue-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    AI is analyzing your data...
                  </div>
                )}
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
            </div>

            <div className="flex gap-3 p-6 border-t border-border bg-white rounded-b-2xl">
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
      )}
    </>
  );
}
