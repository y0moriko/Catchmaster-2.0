"use client";

import { useState } from "react";
import { Search, MoreVertical, Phone, MapPin } from "lucide-react";

interface Fisherman {
  id: string;
  name: string;
  email: string;
  barangay: string;
  contactNumber: string;
  totalWeight: number;
  initials: string;
}

export default function FishermenList({ initialData }: { initialData: Fisherman[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("All Barangays");

  const filteredFishermen = initialData.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         f.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBarangay = barangayFilter === "All Barangays" || f.barangay === barangayFilter;
    
    return matchesSearch && matchesBarangay;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or barangay..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 rounded-lg border border-border bg-white text-sm"
          value={barangayFilter}
          onChange={(e) => setBarangayFilter(e.target.value)}
        >
          <option>All Barangays</option>
          <option>Poblacion</option>
          <option>Ilayang Polo</option>
          <option>Kanlurang Calutan</option>
          <option>Silangang Calutan</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFishermen.map((fisherman) => (
          <div key={fisherman.id} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative group">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                {fisherman.initials}
              </div>
              <div>
                <h3 className="font-semibold text-primary">{fisherman.name}</h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Active</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Brgy. {fisherman.barangay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{fisherman.contactNumber}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="text-xs">
                <p className="text-muted-foreground">Total Catch</p>
                <p className="font-bold text-primary">{fisherman.totalWeight.toLocaleString()} kg</p>
              </div>
              <button className="text-sm font-semibold text-primary hover:underline">
                View Profile
              </button>
            </div>
          </div>
        ))}

        {filteredFishermen.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-border text-muted-foreground">
            No fishermen found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
