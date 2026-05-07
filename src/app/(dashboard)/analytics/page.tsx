"use client";

import { useState, useEffect } from "react";
import { BarChart3, Calendar, Fish, TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react";
import { getMonthlyTrends } from "@/lib/actions/dashboard";

interface TrendData {
  month: string;
  weight: number;
  count: number;
}

export default function AnalyticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const trends = await getMonthlyTrends();
      setData(trends as TrendData[]);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching analytics:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [year]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Advanced Analytics</h1>
          <p className="text-muted-foreground">Monthly trends and catch analytics.</p>
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

      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-primary mb-4">Monthly Trends ({year})</h3>
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((d) => (
              <div key={d.month} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-10">{d.month}</span>
                <div className="flex-1 h-6 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${(d.weight / Math.max(...data.map(x => x.weight), 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold w-16 text-right text-slate-700">
                  {d.weight.toFixed(0)} kg
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No data available</p>
        )}
      </div>
    </div>
  );
}
