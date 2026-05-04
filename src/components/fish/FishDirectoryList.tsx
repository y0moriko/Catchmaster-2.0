"use client";

import { useState } from "react";
import { Search, MoreVertical, Fish, MapPin, Ruler, Activity, AlertCircle } from "lucide-react";

interface FishSpecies {
  id: string;
  name: string;
  localName: string;
  scientificName: string | null;
  category: string | null;
  family: string | null;
  habitat: string | null;
  length: number | null;
  trophicLevel: number | null;
  status: string | null;
}

export default function FishDirectoryList({ initialData }: { initialData: FishSpecies[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("All Families");
  const [habitatFilter, setHabitatFilter] = useState("All Habitats");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const families = ["All Families", ...Array.from(new Set(initialData.map(f => f.family).filter((v): v is string => v !== null)))];
  const habitats = ["All Habitats", ...Array.from(new Set(initialData.map(f => f.habitat).filter((v): v is string => v !== null)))];
  const statuses = ["All Status", ...Array.from(new Set(initialData.map(f => f.status).filter((v): v is string => v !== null)))];

  const filteredFish = initialData.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.scientificName && f.scientificName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFamily = familyFilter === "All Families" || f.family === familyFilter;
    const matchesHabitat = habitatFilter === "All Habitats" || f.habitat === habitatFilter;
    const matchesStatus = statusFilter === "All Status" || f.status === statusFilter;

    return matchesSearch && matchesFamily && matchesHabitat && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700";
    if (status.toLowerCase().includes("native")) return "bg-green-100 text-green-700";
    if (status.toLowerCase().includes("endangered")) return "bg-red-100 text-red-700";
    if (status.toLowerCase().includes("threatened")) return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, local name, or scientific name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={familyFilter}
          onChange={(e) => setFamilyFilter(e.target.value)}
        >
          {families.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={habitatFilter}
          onChange={(e) => setHabitatFilter(e.target.value)}
        >
          {habitats.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFish.map((fish) => (
          <div key={fish.id} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative group">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Fish className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">{fish.localName}</h3>
                <p className="text-xs text-muted-foreground italic">{fish.scientificName || fish.name}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              {fish.family && (
                <div className="flex items-center gap-2">
                  <Fish className="w-4 h-4" />
                  <span>Family: {fish.family}</span>
                </div>
              )}
              {fish.habitat && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{fish.habitat}</span>
                </div>
              )}
              {fish.length && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  <span>{fish.length} cm TL</span>
                </div>
              )}
              {fish.trophicLevel && (
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Trophic Level: {fish.trophicLevel}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              {fish.status && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(fish.status)}`}>
                  {fish.status}
                </span>
              )}
              <span className="text-xs text-muted-foreground">Tayabas Bay</span>
            </div>
          </div>
        ))}

        {filteredFish.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-border text-muted-foreground">
            No fish species found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
