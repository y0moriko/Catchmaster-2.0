import { 
  Fish, 
  Users, 
  BarChart3 
} from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { getRecentCatches } from "@/lib/actions/catch";
import { getWeeklyCatchData, getSpeciesDistribution } from "@/lib/actions/dashboard";
import Link from "next/link";

interface WeeklyData {
  date: string;
  month?: string;
  weight: number;
  count: number;
}

interface SpeciesData {
  name: string;
  weight: number;
}

interface CatchDetail {
  weight: number;
  fish: {
    name: string;
  };
}

export default async function DashboardPage() {
  const [stats, recentCatches, weeklyData, speciesData] = await Promise.all([
    getDashboardStats(),
    getRecentCatches(5),
    getWeeklyCatchData(),
    getSpeciesDistribution(),
  ]);

  const safeStats = stats || {
    totalWeight: 0,
    activeFishermen: 0,
    topSpecies: [],
    totalUsers: 0,
  };

  const typedWeeklyData = weeklyData as WeeklyData[];
  const typedSpeciesData = speciesData as SpeciesData[];
  const maxWeeklyWeight = Math.max(...typedWeeklyData.map((d) => d.weight), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Fish className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-slate-100 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Total Catch (kg)</h3>
          <p className="text-2xl font-bold text-primary mt-1">{safeStats.totalWeight.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-slate-100 rounded-full">
              Registered
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Active Fishermen</h3>
          <p className="text-2xl font-bold text-primary mt-1">{safeStats.activeFishermen}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-slate-100 rounded-full">
              Top Species
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Top Catch Species</h3>
          <div className="mt-1">
            {safeStats.topSpecies.length > 0 ? (
              typedSpeciesData.slice(0, 3).map((s: SpeciesData, i: number) => (
                <p key={i} className="text-sm font-bold text-primary">{s.name} ({s.weight.toFixed(0)} kg)</p>
              ))
            ) : (
              <p className="text-2xl font-bold text-primary mt-1">N/A</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-slate-50 text-primary">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-slate-100 rounded-full">
              Users
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">System Users</h3>
          <p className="text-2xl font-bold text-primary mt-1">{safeStats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-primary mb-6">Weekly Catch Trends</h3>
          {typedWeeklyData.length > 0 ? (
            <div className="space-y-4">
              {typedWeeklyData.map((day: WeeklyData, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{day.date}</span>
                    <span className="text-slate-500">{day.weight.toFixed(0)} kg ({day.count} catches)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${(day.weight / maxWeeklyWeight) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No data for the last 7 days
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-primary mb-6">Top Species Distribution</h3>
          {typedSpeciesData.length > 0 ? (
            <div className="space-y-4">
              {typedSpeciesData.map((s: SpeciesData, i: number) => {
                const maxWeight = Math.max(...typedSpeciesData.map((d: SpeciesData) => d.weight), 1);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{s.name}</span>
                      <span className="text-slate-500">{(s.weight / 1000).toFixed(1)} kg</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${(s.weight / maxWeight) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No species data available
            </div>
          )}
        </div>
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
                      {c.details.reduce((sum: number, d: CatchDetail) => sum + d.weight, 0).toFixed(1)} kg
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {c.details.map((d: CatchDetail) => d.fish.name).join(", ")}
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
      </div>
    </div>
  );
}
