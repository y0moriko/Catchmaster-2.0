"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Fish, Calendar, BarChart3, AlertTriangle, Info } from "lucide-react";
import { getCatchIntelligence } from "@/lib/actions/intelligence";

interface AnalyticsData {
  yoy: { month: string; thisYear: number; lastYear: number; change: number }[];
  seasonality: { species: string; peakMonths: string[]; trend: "up" | "down" | "stable" }[];
  outliers: { id: string; fisherman: string; weight: number; expected: number; date: string }[];
  missingDays: { date: string; barangay: string }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalytics();
  }, [year]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?year=${year}`);
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;

  const mockYoY = [
    { month: "Jan", thisYear: 1200, lastYear: 980, change: 22.4 },
    { month: "Feb", thisYear: 1350, lastYear: 1100, change: 22.7 },
    { month: "Mar", thisYear: 980, lastYear: 1200, change: -18.3 },
    { month: "Apr", thisYear: 1500, lastYear: 1300, change: 15.4 },
    { month: "May", thisYear: 1600, lastYear: 1400, change: 14.3 },
    { month: "Jun", thisYear: 1100, lastYear: 1050, change: 4.8 },
  ];

  const mockSeasonality = [
    { species: "Tuna", peakMonths: ["Apr", "May", "Jun"], trend: "up" as const },
    { species: "Galunggong", peakMonths: ["Jul", "Aug", "Sep"], trend: "stable" as const },
    { species: "Tilapia", peakMonths: ["Jan", "Feb", "Mar"], trend: "up" as const },
    { species: "Milkfish", peakMonths: ["Nov", "Dec", "Jan"], trend: "down" as const },
  ];

  const mockOutliers = [
    { id: "1", fisherman: "Juan Dela Cruz", weight: 5000, expected: 50, date: "2026-05-03" },
    { id: "2", fisherman: "Maria Santos", weight: 0.5, expected: 30, date: "2026-05-02" },
  ];

  const mockMissing = [
    { date: "2026-05-01", barangay: "Lalawigan" },
    { date: "2026-05-02", barangay: "Binagbagan" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Advanced Analytics</h1>
          <p className="text-muted-foreground">Year-on-year comparison, seasonality tracking, and data quality alerts.</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-primary outline-none"
        >
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Year-on-Year Comparison ({year})
          </h3>
          <div className="space-y-3">
            {mockYoY.map(m => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-10">{m.month}</span>
                <div className="flex-1 h-6 bg-slate-50 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-200 h-full transition-all"
                    style={{ width: `${(m.lastYear / 2000) * 100}%` }}
                  />
                  <div
                    className="bg-primary h-full transition-all -ml-0.5"
                    style={{ width: `${(m.thisYear / 2000) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-16 text-right ${m.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {m.change >= 0 ? "+" : ""}{m.change}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-200 rounded" /> {year - 1}</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded" /> {year}</span>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
            <Fish className="w-5 h-5" /> Species Seasonality Tracker
          </h3>
          <div className="space-y-3">
            {mockSeasonality.map(s => (
              <div key={s.species} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-primary">{s.species}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.trend === "up" ? "bg-emerald-50 text-emerald-600" :
                    s.trend === "down" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
                  }`}>
                    {s.trend === "up" ? <TrendingUp className="w-3 h-3 inline" /> : s.trend === "down" ? <TrendingDown className="w-3 h-3 inline" /> : null} {s.trend}
                  </span>
                </div>
                <div className="flex gap-1">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(month => (
                    <div
                      key={month}
                      className={`flex-1 text-[8px] text-center py-1 rounded font-bold ${
                        s.peakMonths.includes(month) ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-300"
                      }`}
                    >
                      {month.slice(0, 3)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Outlier Detection
          </h3>
          {mockOutliers.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No outliers detected ✓</p>
          ) : (
            <div className="space-y-2">
              {mockOutliers.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div>
                    <p className="font-bold text-sm text-red-700">{o.fisherman}</p>
                    <p className="text-[10px] text-red-400">{o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-red-700">{o.weight}kg</p>
                    <p className="text-[10px] text-red-400">Expected: ~{o.expected}kg</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-amber-600 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" /> Missing Data Alerts
          </h3>
          {mockMissing.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">All barangays up to date ✓</p>
          ) : (
            <div className="space-y-2">
              {mockMissing.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <div>
                    <p className="font-bold text-sm text-amber-700">{m.barangay}</p>
                    <p className="text-[10px] text-amber-400">No data submitted</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                    {m.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
