"use client";

import { useState } from "react";
import { FileText, Download, FileSpreadsheet, Building2, Presentation, BarChart3, Calendar, TrendingUp, Fish } from "lucide-react";
import { generateReport } from "@/lib/actions/intelligence";
import { getRecentCatches } from "@/lib/actions/catch";
import { getFishSpecies } from "@/lib/actions/catch";

const TEMPLATES = [
  { id: "bfar-monthly", name: "BFAR Monthly Report", description: "Official BFAR format for monthly catch reporting to Provincial Government", icon: Building2, format: "PDF", color: "blue" },
  { id: "municipal-summary", name: "Municipal Council Summary", description: "Executive summary for Mayor and Council presentations", icon: Presentation, format: "PDF", color: "amber" },
  { id: "species-analytics", name: "Species Analytics Report", description: "Detailed breakdown by species with trends and charts", icon: BarChart3, format: "CSV", color: "emerald" },
  { id: "fisherman-performance", name: "Fisherman Performance", description: "Individual and group performance metrics", icon: FileSpreadsheet, format: "CSV", color: "purple" },
  { id: "weather-correlation", name: "Weather-Catch Correlation", description: "Analysis of weather patterns vs catch volume", icon: Calendar, format: "PDF", color: "cyan" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [activeTab, setActiveTab] = useState<"reports" | "analytics">("reports");

  const handleGenerate = async (templateId: string) => {
    setGenerating(templateId);
    try {
      const res = await generateReport(templateId, { month });
      if (res.success) window.open(res.downloadUrl, "_blank");
    } catch (e) { console.error(e); }
    setGenerating(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">One-click official reports and catch analytics</p>
      </div>

      <div className="flex gap-4 mb-8">
        {[
          { key: "reports", label: "One-Click Reports", icon: FileText },
          { key: "analytics", label: "Quick Analytics", icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === tab.key ? "bg-primary text-white" : "bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "reports" && (
        <>
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-primary" />
              <label className="text-sm font-bold text-slate-600">Report Period:</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map(t => (
              <div key={t.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${t.color}-50`}>
                    <t.icon className={`w-6 h-6 text-${t.color}-600`} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-${t.color}-50 text-${t.color}-600`}>
                    {t.format}
                  </span>
                </div>
                <h3 className="font-bold text-primary mb-1">{t.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{t.description}</p>
                <button
                  onClick={() => handleGenerate(t.id)}
                  disabled={generating === t.id}
                  className={`w-full bg-${t.color}-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-${t.color}-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm`}
                >
                  <Download className="w-4 h-4" />
                  {generating === t.id ? "Generating..." : "Generate Report"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><Fish className="w-4 h-4 text-blue-600" /><span className="text-sm text-muted-foreground">Total Catch</span></div>
            <p className="text-2xl font-bold text-primary">0 kg</p>
          </div>
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-sm text-muted-foreground">Total Trips</span></div>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><Fish className="w-4 h-4 text-amber-600" /><span className="text-sm text-muted-foreground">Species Tracked</span></div>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
        </div>
      )}
    </div>
  );
}
