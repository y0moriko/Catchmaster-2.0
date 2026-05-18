"use client";

import React, { useState } from "react";
import { Fish, Plus, MapPin, Scale, Calendar, CheckCircle2, ChevronRight, Info, Users } from "lucide-react";

export default function DemoCatches() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Catch Logging</h1>
        <p className="text-slate-500 mt-2">Daily record management for fish landings at the municipal port.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Help Context */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
              <Info className="w-5 h-5" />
              Tutorial Tip
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              In the real system, this form captures data directly from the landing site. 
              The location and date are auto-filled based on the staff's GPS and system time.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Common Species</h3>
            <div className="space-y-3">
              {['Roundscad', 'Tuna', 'Tilapia', 'Milkfish'].map(fish => (
                <div key={fish} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-600">
                  {fish}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            {success ? (
              <div className="p-12 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Catch Recorded!</h2>
                <p className="text-slate-500 mb-8">The data has been synchronized with the municipality dashboard.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                  Log Another Catch
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      Fisherman
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white font-medium">
                      <option>Juan Dela Cruz</option>
                      <option>Pedro Santos</option>
                      <option>Maria Reyes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Date of Catch
                    </label>
                    <input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    Landing Location
                  </label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white font-medium" 
                    defaultValue="Agdangan Municipal Port - Sector A"
                  />
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Fish className="w-5 h-5 text-blue-500" />
                    Species & Measurements
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fish Species</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium outline-none">
                        <option>Roundscad (Galunggong)</option>
                        <option>Tuna (Tambakol)</option>
                        <option>Tilapia</option>
                        <option>Milkfish (Bangus)</option>
                      </select>
                    </div>
                    <div className="w-full md:w-48 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Scale className="w-3 h-3" />
                        Weight (kg)
                      </label>
                      <input 
                        type="number" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <button type="button" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                    <Plus className="w-4 h-4" />
                    Add another species to this trip
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Synchronizing Data...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Finalize & Record Catch
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
