"use client";

import React, { useState } from "react";
import { Cloud, CloudRain, Sun, Thermometer, Wind, TrendingUp, TrendingDown, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntelligenceProps {
  data: {
    todayWeight: number;
    yesterdayWeight: number;
    trendPercentage: string;
    currentWeather: string;
    recommendation: string;
  } | null;
}

export function CatchIntelligence({ data }: IntelligenceProps) {
  if (!data) return null;

  const isUp = parseFloat(data.trendPercentage) >= 0;

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "rainy": return <CloudRain className="w-10 h-10 text-blue-400" />;
      case "cloudy": return <Cloud className="w-10 h-10 text-slate-400" />;
      default: return <Sun className="w-10 h-10 text-amber-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Weather Snapshot */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="p-3 bg-slate-50 rounded-2xl">
          {getWeatherIcon(data.currentWeather)}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Weather</p>
          <h3 className="text-xl font-black text-slate-900">{data.currentWeather}</h3>
          <div className="flex items-center gap-3 mt-1 text-slate-500">
            <span className="flex items-center gap-1 text-xs font-bold"><Thermometer className="w-3 h-3" /> 29°C</span>
            <span className="flex items-center gap-1 text-xs font-bold"><Wind className="w-3 h-3" /> 12km/h</span>
          </div>
        </div>
      </div>

      {/* Production Trend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Catch Trend</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{data.todayWeight.toLocaleString()}kg</h3>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg font-black text-xs",
            isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {data.trendPercentage}%
          </div>
        </div>
        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000", isUp ? "bg-emerald-500" : "bg-red-500")}
            style={{ width: `${Math.min(Math.abs(parseFloat(data.trendPercentage)), 100)}%` }} 
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Compared to yesterday ({data.yesterdayWeight}kg)</p>
      </div>

      {/* Smart Recommendation */}
      <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white flex items-start gap-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <Lightbulb className="w-5 h-5 text-amber-300 fill-amber-300" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Intelligence Recommendation</p>
          <p className="text-sm font-bold leading-relaxed mt-1">
            {data.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
