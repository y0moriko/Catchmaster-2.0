"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Fish, Download, Filter, Calendar, FileText, PieChart } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function DemoReports() {
  const { showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState("Monthly Production");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast(`Report "${reportType}" has been generated and is ready for download!`, "success");
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 mt-2">Generate comprehensive data exports for municipal planning.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isGenerating ? "Generating..." : "Export Report"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Report Builder
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option>Monthly Production</option>
                  <option>Species Distribution</option>
                  <option>Fisherman Performance</option>
                  <option>Economic Impact Study</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value="Jan 2026" readOnly className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value="May 2026" readOnly className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500" />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 italic">
                  * Reports are generated in PDF and CSV formats compatible with national government requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl">
            <PieChart className="w-10 h-10 text-blue-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Insights Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Our system automatically flags inconsistencies and highlights production peaks to help officials prepare for seasonal changes.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase">Top Insight</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm font-medium">Production is up 12% compared to last quarter.</p>
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Species Distribution</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-slate-500">Pelagic</span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 ml-2" />
                <span className="text-xs font-bold text-slate-500">Demersal</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { name: "Roundscad", value: 85, color: "bg-blue-500" },
                { name: "Tuna", value: 65, color: "bg-blue-400" },
                { name: "Tilapia", value: 45, color: "bg-emerald-500" },
                { name: "Milkfish", value: 30, color: "bg-emerald-400" },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Data Preview</h3>
            <div className="h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">Raw data preview table</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
