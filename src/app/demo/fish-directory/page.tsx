"use client";

import { useState } from "react";
import { Search, Fish, MapPin, Ruler, Activity } from "lucide-react";

// Sample data for Tayabas Bay fish species
const sampleFish = [
  {
    id: "1",
    name: "Elongate surgeonfish",
    localName: "Talisayon",
    scientificName: "Acanthurus mata",
    family: "Acanthuridae",
    habitat: "reef-associated",
    length: 50.0,
    trophicLevel: 2.5,
    status: "native",
  },
  {
    id: "2",
    name: "Rabbitfish",
    localName: "Pampano",
    scientificName: "Siganus fuscescens",
    family: "Siganidae",
    habitat: "reef-associated",
    length: 30.0,
    trophicLevel: 2.0,
    status: "native",
  },
  {
    id: "3",
    name: "Milkfish",
    localName: "Bangus",
    scientificName: "Chanos chanos",
    family: "Chanidae",
    habitat: "pelagic",
    length: 180.0,
    trophicLevel: 2.0,
    status: "native",
  },
  {
    id: "4",
    name: "Roundscad",
    localName: "Galunggong",
    scientificName: "Decapterus macarellus",
    family: "Carangidae",
    habitat: "pelagic-neritic",
    length: 35.0,
    trophicLevel: 3.0,
    status: "native",
  },
  {
    id: "5",
    name: "Frigate tuna",
    localName: "Tulingan",
    scientificName: "Auxis thazard",
    family: "Scombridae",
    habitat: "pelagic",
    length: 65.0,
    trophicLevel: 4.0,
    status: "native",
  },
  {
    id: "6",
    name: "Indo-Pacific sergeant",
    localName: "Sergeant major",
    scientificName: "Abudefduf vaigiensis",
    family: "Pomacentridae",
    habitat: "reef-associated",
    length: 20.0,
    trophicLevel: 2.8,
    status: "native",
  },
];

export default function DemoFishDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("All Families");
  const [habitatFilter, setHabitatFilter] = useState("All Habitats");

  const families = ["All Families", ...Array.from(new Set(sampleFish.map(f => f.family)))];
  const habitats = ["All Habitats", ...Array.from(new Set(sampleFish.map(f => f.habitat)))];

  const filteredFish = sampleFish.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFamily = familyFilter === "All Families" || f.family === familyFilter;
    const matchesHabitat = habitatFilter === "All Habitats" || f.habitat === habitatFilter;

    return matchesSearch && matchesFamily && matchesHabitat;
  });

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("native")) return "bg-green-100 text-green-700";
    if (status.toLowerCase().includes("endangered")) return "bg-red-100 text-red-700";
    if (status.toLowerCase().includes("threatened")) return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Fish Directory</h1>
        <p className="text-slate-500">Browse fish species from Tayabas Bay, Agdangan coastline.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, local name, or scientific name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm"
          value={familyFilter}
          onChange={(e) => setFamilyFilter(e.target.value)}
        >
          {families.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm"
          value={habitatFilter}
          onChange={(e) => setHabitatFilter(e.target.value)}
        >
          {habitats.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFish.map((fish) => (
          <div key={fish.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Fish className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{fish.localName}</h3>
                <p className="text-xs text-slate-500 italic">{fish.scientificName}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Fish className="w-4 h-4" />
                <span>Family: {fish.family}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{fish.habitat}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span>{fish.length} cm TL</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Trophic Level: {fish.trophicLevel}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(fish.status)}`}>
                {fish.status}
              </span>
              <span className="text-xs text-slate-400">Tayabas Bay</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
