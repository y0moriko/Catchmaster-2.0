"use client";

import { useState } from "react";
import { Fish, TrendingUp, BarChart3, Eye, Copy, Check } from "lucide-react";

export default function PublicDashboardPage() {
  const [copied, setCopied] = useState(false);
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/public-view` : "";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = publicUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockSummary = {
    totalCatch: "12,450",
    activeFishermen: "156",
    topSpecies: "Tuna",
    monthlyGrowth: "+8.3%"
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Public Dashboard</h1>
        <p className="text-muted-foreground">Share read-only summary links with Mayor's office and other departments.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-primary">Shareable Link</h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">Give this link to the Mayor's office or Planning Department for read-only access to summaries.</p>
        <div className="flex gap-2">
          <input
            value={publicUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono bg-slate-50"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-slate-700 text-sm flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4"><Fish className="w-4 h-4 text-blue-600" /><span className="text-sm text-muted-foreground">Total Catch</span></div>
          <p className="text-2xl font-bold text-primary">{mockSummary.totalCatch} kg</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-sm text-muted-foreground">Active Fishermen</span></div>
          <p className="text-2xl font-bold text-primary">{mockSummary.activeFishermen}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4"><Fish className="w-4 h-4 text-amber-600" /><span className="text-sm text-muted-foreground">Top Species</span></div>
          <p className="text-2xl font-bold text-primary">{mockSummary.topSpecies}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-emerald-600" /><span className="text-sm text-muted-foreground">Monthly Growth</span></div>
          <p className="text-2xl font-bold text-emerald-600">{mockSummary.monthlyGrowth}</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-primary mb-4">Top 5 Species (Read-Only View)</h3>
        <div className="space-y-3">
          {["Tuna", "Galunggong", "Tilapia", "Milkfish", "Crab"].map((s, i) => (
            <div key={s} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="font-bold text-sm text-primary">{s}</span>
              </div>
              <span className="font-bold text-sm text-primary">{[4500, 3200, 2100, 1800, 850][i]} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
