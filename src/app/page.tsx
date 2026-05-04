"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Anchor,
  Fish,
  BarChart3,
  Users,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Play,
  Eye
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in-up animation-delay-100">
            <div className="bg-primary p-2 rounded-lg">
              <Anchor className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-primary">CatchMaster</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 animate-fade-in-up animation-delay-200">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pb-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium animate-fade-in-up animation-delay-100">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                Municipality of Agdangan, Quezon
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight animate-fade-in-up animation-delay-200">
                Modern Fish Catch
                <br />
                <span className="text-blue-600">Management System</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg animate-fade-in-up animation-delay-300">
                Streamline fishing operations, track catches in real-time, and empower local
                fishermen with data-driven insights for Agdangan&apos;s coastal community.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animation-delay-400">
                <Link
                  href="/signup"
                  className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group text-sm sm:text-base hover:-translate-y-0.5"
                >
                  Start Managing Catches
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/demo"
                  className="border-2 border-primary text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:-translate-y-0.5"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  View Demo
                </Link>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 pt-4 animate-fade-in-up animation-delay-400">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center hover:scale-110 transition-transform">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-primary">Trusted by Local Government</p>
                  <p className="text-xs text-muted-foreground">Municipal administrators & staff</p>
                </div>
              </div>
            </div>

            <div className="relative order-first lg:order-last animate-fade-in-up animation-delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary rounded-2xl sm:rounded-3xl blur-3xl opacity-20 -z-10 animate-pulse-glow" />
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-border p-6 sm:p-8 relative hover:shadow-3xl transition-shadow">
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  LIVE DATA
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h3 className="font-bold text-primary text-sm sm:text-base">Today&apos;s Catch Summary</h3>
                    <Fish className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-float" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl hover:bg-slate-100 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1">Total Weight</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">1,247 kg</p>
                    </div>
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl hover:bg-slate-100 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1">Active Fishermen</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">84</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { species: "Roundscad", weight: "420 kg", bar: "w-3/4" },
                      { species: "Tilapia", weight: "350 kg", bar: "w-3/5" },
                      { species: "Milkfish", weight: "280 kg", bar: "w-1/2" },
                    ].map((item, i) => (
                      <div key={item.species} className="animate-fade-in-up" style={{ animationDelay: `${0.5 + i * 0.1}s`, opacity: 0 }}>
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="font-medium text-primary">{item.species}</span>
                          <span className="text-muted-foreground">{item.weight}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full bg-blue-600 rounded-full ${item.bar} transition-all duration-1000 ease-out`} style={{ animationDelay: `${0.8 + i * 0.2}s` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Everything You Need to Manage Fisheries
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for Agdangan&apos;s fishing industry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Fish,
                title: "Catch Logging",
                description: "Record fish catches with species, weight, and location data in seconds. Mobile-friendly interface for field use.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: Users,
                title: "Fishermen Registry",
                description: "Maintain comprehensive records of all registered fishermen, their contact details, and barangay assignments.",
                color: "bg-green-50 text-green-600"
              },
              {
                icon: BarChart3,
                title: "Analytics & Reports",
                description: "Generate detailed reports on catch trends, species distribution, and fisherman performance over time.",
                color: "bg-amber-50 text-amber-600"
              },
              {
                icon: TrendingUp,
                title: "Data Insights",
                description: "Track seasonal patterns, identify top-performing fishermen, and make data-driven policy decisions.",
                color: "bg-purple-50 text-purple-600"
              },
              {
                icon: Shield,
                title: "Secure & Role-Based",
                description: "Role-based access control ensures data security. Admin and staff roles with appropriate permissions.",
                color: "bg-red-50 text-red-600"
              },
              {
                icon: MapPin,
                title: "Local Focus",
                description: "Built specifically for Agdangan, Quezon. Supports local fish species and barangay-level tracking.",
                color: "bg-teal-50 text-teal-600"
              }
            ].map((feature, i) => (
              <div key={feature.title} className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all group hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "500+", label: "Registered Fishermen" },
              { value: "50k+", label: "Kg Tracked Monthly" },
              { value: "15+", label: "Fish Species" },
              { value: "99.9%", label: "System Uptime" },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white/70 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Register Fishermen",
                description: "Add fishermen to the system with their personal details, barangay, and contact information."
              },
              {
                step: "02",
                title: "Log Daily Catches",
                description: "Record each catch with species, weight, quantity, and location. Multiple species per trip supported."
              },
              {
                step: "03",
                title: "Analyze & Report",
                description: "View dashboard analytics, generate reports, and track fishing trends across the municipality."
              }
            ].map((item, i) => (
              <div key={item.step} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s`, opacity: 0 }}>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border relative z-10 hover:shadow-lg transition-shadow">
                  <div className="text-4xl sm:text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{item.description}</p>
                </div>
                {item.step !== "03" && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-primary/30 z-20 animate-float" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-primary to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Transform Agdangan&apos;s Fisheries Management?
          </h2>
          <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            Join the digital revolution in fish catch monitoring. Start tracking, analyzing,
            and improving fishing operations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
            <Link
              href="/signup"
              className="bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2 group text-sm sm:text-base hover:-translate-y-0.5"
            >
              Request Admin Access
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Try Demo
            </Link>
          </div>
          <p className="text-white/60 text-xs sm:text-sm mt-6 animate-fade-in-up animation-delay-300">
            Administrative approval required for new accounts
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Anchor className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">CatchMaster</p>
                <p className="text-sm text-white/60">Agdangan Fish Catch Management</p>
              </div>
            </div>

            <div className="flex gap-6">
              <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="text-white/60 hover:text-white text-sm transition-colors">
                Register
              </Link>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/40">
              &copy; 2026 CatchMaster. Municipality of Agdangan, Quezon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
