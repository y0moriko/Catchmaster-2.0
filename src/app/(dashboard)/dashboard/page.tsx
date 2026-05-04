import { 
  Fish, 
  Users, 
  TrendingUp, 
  Ship,
  BarChart3
} from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { getRecentCatches } from "@/lib/actions/catch";
import { getCatchIntelligence } from "@/lib/actions/intelligence";
import { CatchIntelligence } from "@/components/Intelligence";
import Link from "next/link";

export default async function DashboardPage() {
  const [stats, recentCatches, intelligence] = await Promise.all([
    getDashboardStats(),
    getRecentCatches(5),
    getCatchIntelligence(),
  ]);

  const safeStats = stats || {
    totalWeight: 0,
    activeFishermen: 0,
    topSpecies: "N/A",
    totalUsers: 0,
  };

  const statCards = [
    { label: "Total Catch (kg)", value: safeStats.totalWeight.toLocaleString(), icon: Fish, trend: "Overall", color: "text-blue-600" },
    { label: "Active Fishermen", value: safeStats.activeFishermen.toString(), icon: Users, trend: "Registered", color: "text-green-600" },
    { label: "Top Species", value: safeStats.topSpecies, icon: Ship, trend: "Most Weighted", color: "text-amber-600" },
    { label: "System Users", value: safeStats.totalUsers.toString(), icon: TrendingUp, trend: "Admin/Staff", color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor and manage local fishing activity in Agdangan.</p>
        </div>
        <Link 
          href="/catches" 
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition-all shadow-lg"
        >
          Record New Catch
        </Link>
      </div>

      <CatchIntelligence data={intelligence} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-slate-100 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary">Recent Catches</h3>
            <Link href="/reports" className="text-xs font-bold text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentCatches.length > 0 ? (
              recentCatches.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <Fish className="w-5 h-5 text-primary/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {c.fisherman.user.firstName} {c.fisherman.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.location || "Landing Site"} • {new Date(c.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      {c.details.reduce((sum, d) => sum + d.weight, 0).toFixed(1)} kg
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {c.details.map(d => d.fish.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground italic">
                No catches recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-sm font-medium text-primary">Weekly Trends Chart</h3>
            <p className="text-xs text-muted-foreground mt-1">Analytics will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
