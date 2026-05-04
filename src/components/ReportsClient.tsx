"use client";

import { BarChart3, Download, Filter, TrendingUp, Fish, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ChartDataPoint = { month: string; weight: number };
type PieDataPoint = { name: string; value: number; };
type FishermanData = { name: string; totalWeight: number };

const COLORS = ["#1e293b", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function ReportsClient({
  chartData,
  pieData,
  topFishermen,
  totalWeight,
  catchDataLength,
  fishermanDataLength,
}: {
  chartData: ChartDataPoint[];
  pieData: PieDataPoint[];
  topFishermen: FishermanData[];
  totalWeight: number;
  catchDataLength: number;
  fishermanDataLength: number;
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Data Reports</h1>
          <p className="text-muted-foreground">Analyze fishing data for Agdangan.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-lg">
          <Download className="w-5 h-5" />
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Fish className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Total Catch</span>
          </div>
          <p className="text-2xl font-bold text-primary">{totalWeight.toFixed(1)} kg</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Total Trips</span>
          </div>
          <p className="text-2xl font-bold text-primary">{catchDataLength}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-muted-foreground">Active Fishermen</span>
          </div>
          <p className="text-2xl font-bold text-primary">{fishermanDataLength}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <select className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border bg-white text-sm">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
          <option>Year to Date</option>
        </select>
        <select className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border bg-white text-sm">
          <option>All Barangays</option>
          <option>Poblacion</option>
          <option>Ilayang Polo</option>
        </select>
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border flex items-center gap-2 hover:bg-slate-50 transition-colors sm:ml-auto">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Catch Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-bold text-primary mb-6">Monthly Catch Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weight" fill="#1e293b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Species Distribution */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h3 className="font-bold text-primary mb-6">Top Species</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {pieData.map((s, i) => (
                    <div key={s.name} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{s.name}</span>
                      </span>
                      <span className="font-bold text-primary">{s.value?.toFixed(1)} kg</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground italic text-center py-8">No data yet</p>
            )}
          </div>

          {/* Top Fishermen */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h3 className="font-bold text-primary mb-4">Top Fishermen</h3>
            <div className="space-y-3">
              {topFishermen.length > 0 ? (
                topFishermen.map((f, i) => (
                  <div key={f.name} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground truncate max-w-[120px]">{f.name}</span>
                    </span>
                    <span className="font-bold text-primary">{f.totalWeight.toFixed(1)} kg</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic text-center py-4">No data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
