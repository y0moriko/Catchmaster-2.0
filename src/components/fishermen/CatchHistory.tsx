"use client";

import { useState } from "react";
import { Search, BarChart3 } from "lucide-react";

interface CatchDetail {
  id: string;
  weight: number;
  quantity: number;
  fish: { name: string };
}

interface Catch {
  id: string;
  date: string | Date;
  location: string | null;
  weatherCondition: string | null;
  details: CatchDetail[];
}

export default function CatchHistory({ catches }: { catches: Catch[] }) {
  const [search, setSearch] = useState("");

  const filtered = catches.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const detailMatch = c.details.some((d) => d.fish.name.toLowerCase().includes(q));
    const dateMatch = new Date(c.date).toLocaleDateString().toLowerCase().includes(q);
    const locationMatch = c.location?.toLowerCase().includes(q);
    return detailMatch || dateMatch || locationMatch;
  });

  const totalWeight = filtered.reduce(
    (acc, c) => acc + c.details.reduce((sum, d) => sum + d.weight, 0),
    0
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Catch History
          <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search by species, date, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-muted-foreground">
          {search ? `${filtered.length} of ${catches.length} trips` : `${catches.length} trips`}
        </p>
        <p className="text-sm font-bold text-primary">{totalWeight.toFixed(1)} kg total</p>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <div key={c.id} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <p className="font-medium text-primary">
                    {new Date(c.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{c.location || "—"}</p>
                  {c.weatherCondition && (
                    <p className="text-xs text-muted-foreground mt-0.5">Weather: {c.weatherCondition}</p>
                  )}
                </div>
                <p className="font-bold text-primary">
                  {c.details.reduce((sum, d) => sum + d.weight, 0).toFixed(1)} kg
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {c.details.map((d) => (
                  <span key={d.id} className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
                    {d.fish.name} &times;{d.quantity} ({d.weight}kg)
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {search ? `No trips match "${search}".` : "No catches recorded yet."}
          </div>
        )}
      </div>
    </div>
  );
}
