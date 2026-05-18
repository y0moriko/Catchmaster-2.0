"use client";

import React, { useState } from "react";
import { Users, UserPlus, Search, MoreVertical, ShieldCheck, MapPin, Phone, Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function DemoFishermen() {
  const { showToast } = useToast();
  const [fishermen, setFishermen] = useState([
    { id: "1", name: "Juan Dela Cruz", barangay: "Poblacion", contact: "0912-345-6789", totalWeight: 245.5, status: "Active" },
    { id: "2", name: "Pedro Santos", barangay: "Ilayang Polo", contact: "0923-456-7890", totalWeight: 189.0, status: "Active" },
    { id: "3", name: "Maria Reyes", barangay: "Poblacion", contact: "0934-567-8901", totalWeight: 312.5, status: "Active" },
    { id: "4", name: "Roberto Gomez", barangay: "Salvacion", contact: "0945-678-9012", totalWeight: 156.2, status: "Active" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBarangay, setNewBarangay] = useState("Poblacion");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newFisherman = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      barangay: newBarangay,
      contact: "09XX-XXX-XXXX",
      totalWeight: 0,
      status: "Active"
    };

    setFishermen([newFisherman, ...fishermen]);
    setNewName("");
    setIsAdding(false);
    
    showToast(`Success: ${newName} has been added to the registry!`, "success");
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fisherman Registry</h1>
          <p className="text-slate-500 mt-2">Manage and track registered local fishermen of Agdangan.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
        >
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Register New Fisherman
        </button>
      </div>

      {/* Add Form Modal (Demo) */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Register Fisherman</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="e.g. Cardo Dalisay"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Barangay</label>
                  <select 
                    value={newBarangay}
                    onChange={(e) => setNewBarangay(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                  >
                    <option>Poblacion</option>
                    <option>Ilayang Polo</option>
                    <option>Salvacion</option>
                    <option>Sapa</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Search by name, barangay, or ID..."
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm font-medium outline-none">
            <option>All Barangays</option>
            <option>Poblacion</option>
            <option>Ilayang Polo</option>
          </select>
          <button className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 hover:text-primary transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Fishermen List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="fishermen-list">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Fisherman</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total Catch</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {fishermen.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all font-bold text-slate-400">
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{f.name}</p>
                        <p className="text-xs text-slate-400">ID: CMS-{f.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium">{f.barangay}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium">{f.contact}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="font-bold text-slate-900">{f.totalWeight.toLocaleString()} kg</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                      <ShieldCheck className="w-3 h-3" />
                      {f.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
