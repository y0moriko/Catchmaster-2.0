"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Fish,
  AlertTriangle,
  Info,
} from "lucide-react";
import { getCatchForecast, ForecastResult } from "@/lib/actions/forecast";
import { ForecastChart } from "@/components/forecast/ForecastChart";

interface ChartPoint {
  month: string;
  actual: number | null;
  forecast: number | null;
  lowerBound: number | null;
  upperBound: number | null;
}

export default function ForecastPage() {
  const [data, setData] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const result = await getCatchForecast();
      setData(result);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching forecast:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Calculating forecast...
      </div>
    );
  }

  if (!data || data.historical.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Catch Forecasting</h1>
          <p className="text-muted-foreground">Predictive analysis for future catch volumes.</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-12 shadow-sm text-center">
          <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Insufficient Data</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            At least 3 months of catch data are needed to generate a forecast.
            Start logging catches to enable predictions.
          </p>
        </div>
      </div>
    );
  }

  const chartData: ChartPoint[] = [
    ...data.historical.slice(-12).map((h) => ({
      month: h.month,
      actual: h.actual,
      forecast: null,
      lowerBound: null,
      upperBound: null,
    })),
    ...data.projected.map((p) => ({
      month: p.month,
      actual: null,
      forecast: p.forecast,
      lowerBound: p.lowerBound,
      upperBound: p.upperBound,
    })),
  ];

  const { summary } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Catch Forecasting</h1>
        <p className="text-muted-foreground">
          Predictive analysis based on historical catch data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Next Month
          </p>
          <p className="text-2xl font-bold text-primary">
            {summary.nextMonthPrediction.toFixed(0)} kg
          </p>
          <div className="flex items-center gap-1 mt-1">
            {summary.trend === "increasing" ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : summary.trend === "decreasing" ? (
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span
              className={`text-xs font-bold ${
                summary.trend === "increasing"
                  ? "text-emerald-600"
                  : summary.trend === "decreasing"
                    ? "text-red-600"
                    : "text-slate-500"
              }`}
            >
              {summary.percentageChange > 0 ? "+" : ""}
              {summary.percentageChange}%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Next Quarter
          </p>
          <p className="text-2xl font-bold text-primary">
            {summary.nextQuarterPrediction.toFixed(0)} kg
          </p>
          <p className="text-xs text-slate-400 mt-1">Predicted total (3 months)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Confidence
          </p>
          <p className="text-2xl font-bold text-primary capitalize">{summary.confidence}</p>
          <p className="text-xs text-slate-400 mt-1">
            {summary.confidence === "high"
              ? "Based on 12+ months of data"
              : summary.confidence === "medium"
                ? "Based on 6+ months of data"
                : "Limited historical data"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Overall Trend
          </p>
          <p className="text-2xl font-bold text-primary capitalize">{summary.trend}</p>
          <p className="text-xs text-slate-400 mt-1">
            {summary.trend === "increasing"
              ? "Catch volumes expected to rise"
              : summary.trend === "decreasing"
                ? "Catch volumes expected to decline"
                : "Stable catch volumes expected"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-primary">Historical & Forecast Trend</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#1e293b] inline-block" />
              <span className="text-slate-500">Actual</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 border-dashed inline-block" />
              <span className="text-slate-500">Forecast</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-500/10 border border-blue-500/30 rounded inline-block" />
              <span className="text-slate-500">Confidence Interval</span>
            </span>
          </div>
        </div>
        <ForecastChart data={chartData} />
      </div>

      {data.speciesForecasts.length > 0 && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-primary mb-4">Species-Level Forecast</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
                    Species
                  </th>
                  <th className="text-right py-3 px-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
                    Current Avg (kg/mo)
                  </th>
                  <th className="text-right py-3 px-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
                    Predicted Next (kg)
                  </th>
                  <th className="text-right py-3 px-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.speciesForecasts.map((s, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 px-2">
                      <span className="font-medium text-primary">{s.name}</span>
                      {s.localName !== s.name && (
                        <span className="text-xs text-slate-400 ml-1">({s.localName})</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-primary">
                      {s.currentMonthlyAvg.toFixed(1)}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-primary">
                      {s.predictedNextMonth.toFixed(1)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {s.trend === "up" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <TrendingUp className="w-3.5 h-3.5" /> Up
                        </span>
                      ) : s.trend === "down" ? (
                        <span className="inline-flex items-center gap-1 text-red-600 font-bold text-xs">
                          <TrendingDown className="w-3.5 h-3.5" /> Down
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-xs">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-bold mb-1">About this forecast</p>
          <p>
            Predictions are generated using a blend of moving averages, linear regression,
            and seasonal adjustment based on historical catch data. Confidence intervals
            widen for longer projections. This is a statistical estimate and should not
            replace local knowledge and expert judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
