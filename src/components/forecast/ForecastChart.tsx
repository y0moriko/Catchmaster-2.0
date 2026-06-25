"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";

interface ChartPoint {
  month: string;
  actual: number | null;
  forecast: number | null;
  lowerBound: number | null;
  upperBound: number | null;
}

export function ForecastChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        No forecast data available
      </div>
    );
  }

  const allValues = data
    .flatMap((d) => [d.actual, d.forecast, d.upperBound, d.lowerBound])
    .filter((v): v is number => v !== null);

  const yMin = Math.min(...allValues, 0);
  const yMax = Math.max(...allValues, 1);

  const splitIndex = data.findIndex((d) => d.actual === null);
  const actualData = splitIndex === -1 ? data : data.slice(0, splitIndex);
  const forecastData = splitIndex === -1 ? [] : data.slice(splitIndex - 1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-sm">
        <p className="font-bold text-primary mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toFixed(1)} kg
          </p>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[yMin * 0.9, yMax * 1.1]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Area
          type="monotone"
          dataKey="upperBound"
          stroke="none"
          fill="#3b82f6"
          fillOpacity={0.08}
          name="Confidence Interval"
        />
        <Area
          type="monotone"
          dataKey="lowerBound"
          stroke="none"
          fill="#3b82f6"
          fillOpacity={0.08}
          name=""
        />

        <Line
          type="monotone"
          dataKey="actual"
          stroke="#1e293b"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#1e293b" }}
          connectNulls={false}
          name="Actual Catch"
        />

        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#3b82f6"
          strokeWidth={2.5}
          strokeDasharray="6 3"
          dot={{ r: 4, fill: "#3b82f6" }}
          connectNulls={true}
          name="Forecast"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
