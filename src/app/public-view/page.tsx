"use client";

import { useState, useEffect } from "react";
import { Fish, Users, BarChart3 } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default function PublicViewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching public stats:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading public dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">CatchMaster Public Dashboard</h1>
          <p className="text-muted-foreground">Agdangan Municipal Fish Catch Summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Fish className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Catch</span>
            </div>
            <p className="text-2xl font-bold text-primary">{stats?.totalWeight?.toLocaleString() || 0} kg</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Active Fishermen</span>
            </div>
            <p className="text-2xl font-bold text-primary">{stats?.activeFishermen || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-muted-foreground">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-primary">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          This is a read-only public view. Data is updated periodically.
        </div>
      </div>
    </div>
  );
}
