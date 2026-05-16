"use client";

import { useState, useEffect } from "react";
import { FileText, Download, FileSpreadsheet, Building2, Presentation, BarChart3, Calendar, TrendingUp, Fish, Database } from "lucide-react";
import { generateReport } from "@/lib/actions/intelligence";
import { getDashboardStats } from "@/lib/actions/dashboard";

const colorClasses: Record<string, { bg: string; text: string; hover: string; btn: string; btnHover: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", hover: "hover:bg-blue-700", btn: "bg-blue-600", btnHover: "hover:bg-blue-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", hover: "hover:bg-amber-700", btn: "bg-amber-600", btnHover: "hover:bg-amber-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", hover: "hover:bg-emerald-700", btn: "bg-emerald-600", btnHover: "hover:bg-emerald-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", hover: "hover:bg-purple-700", btn: "bg-purple-600", btnHover: "hover:bg-purple-700" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", hover: "hover:bg-cyan-700", btn: "bg-cyan-600", btnHover: "hover:bg-cyan-700" },
};

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
  const [stats, setStats] = useState<{ totalWeight: number; activeFishermen: number; totalUsers: number } | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

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
                  <div className={`p-3 rounded-xl ${colorClasses[t.color]?.bg || "bg-slate-50"}`}>
                    <t.icon className={`w-6 h-6 ${colorClasses[t.color]?.text || "text-slate-600"}`} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${colorClasses[t.color]?.bg || "bg-slate-50"} ${colorClasses[t.color]?.text || "text-slate-600"}`}>
                    {t.format}
                  </span>
                </div>
                <h3 className="font-bold text-primary mb-1">{t.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{t.description}</p>
                <button
                  onClick={() => handleGenerate(t.id)}
                  disabled={generating === t.id}
                  className={`w-full ${colorClasses[t.color]?.btn || "bg-slate-600"} text-white px-4 py-2.5 rounded-lg font-bold ${colorClasses[t.color]?.btnHover || "hover:bg-slate-700"} disabled:opacity-50 flex items-center justify-center gap-2 text-sm`}
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
        <>
          {stats && stats.totalWeight === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-12 shadow-sm text-center">
              <Database className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">No Data Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start logging catches to see analytics here. Head to{" "}
                <a href="/catches" className="text-primary hover:underline font-medium">Catch Logging</a>{" "}
                or import records via{" "}
                <a href="/import" className="text-primary hover:underline font-medium">Import Data</a>.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/catches" className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition-colors">
                  Log Your First Catch
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><Fish className="w-4 h-4 text-blue-600" /><span className="text-sm text-muted-foreground">Total Catch</span></div>
                <p className="text-2xl font-bold text-primary">{stats?.totalWeight.toLocaleString() || "—"} kg</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-sm text-muted-foreground">Active Fishermen</span></div>
                <p className="text-2xl font-bold text-primary">{stats?.activeFishermen.toLocaleString() || "—"}</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><Fish className="w-4 h-4 text-amber-600" /><span className="text-sm text-muted-foreground">Registered Users</span></div>
                <p className="text-2xl font-bold text-primary">{stats?.totalUsers.toLocaleString() || "—"}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
