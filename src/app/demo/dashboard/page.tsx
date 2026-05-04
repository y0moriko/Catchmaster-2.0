"use client";

import { Fish, Users, TrendingUp, Info } from "lucide-react";

export default function DemoDashboard() {
  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
        <p className="text-slate-500 mt-2">Real-time municipality fishing statistics and data insights.</p>
      </div>

      {/* Presentation Banner */}
      <div className="bg-blue-600 rounded-2xl p-8 mb-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Info className="w-6 h-6" />
            Presentation Focus
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Agdangan's fishing industry produces over <span className="text-white font-bold underline underline-offset-4 decoration-amber-400">12,000kg</span> of catch monthly. 
            This dashboard helps LGU officials track sustainable fishing practices and economic impact.
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Catch (kg)", value: "12,472", icon: Fish, color: "bg-blue-500", trend: "+12%" },
          { label: "Registered Fishermen", value: "142", icon: Users, color: "bg-emerald-500", trend: "+5" },
          { label: "Most Profitable Species", value: "Roundscad", icon: Fish, color: "bg-amber-500", trend: "High Demand" },
          { label: "Monthly Growth", value: "18.5%", icon: TrendingUp, color: "bg-indigo-500", trend: "Consistent" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.color + " p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform"}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-wider">{stat.trend}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-500">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Production Trends
          </h3>
          <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center group hover:bg-slate-100 transition-colors cursor-help">
            <div className="text-center p-6">
              <div className="flex items-end gap-2 h-32 mb-6">
                {[40, 70, 45, 90, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg relative group/bar">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-1000 group-hover/bar:bg-blue-600" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <p className="text-slate-500 font-medium">Interactive visualization would go here</p>
              <p className="text-xs text-slate-400 mt-1">Showing 6-month historical data</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { user: "Juan D.", action: "Logged 45kg Roundscad", time: "2 mins ago" },
              { user: "Pedro S.", action: "Registered New Fisherman", time: "1 hour ago" },
              { user: "System", action: "Generated Monthly Report", time: "3 hours ago" },
              { user: "Maria R.", action: "Logged 12kg Tilapia", time: "Yesterday" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                    <p className="text-xs text-slate-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
