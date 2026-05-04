"use client";

import Link from "next/link";
import { Fish, Users, BarChart3, ArrowLeft, Eye, Play } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnterDemo = () => {
    setIsLoading(true);
    // Directly navigate to demo dashboard without any auth call
    setTimeout(() => {
      router.push("/demo/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Fish className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-primary">CatchMaster Demo</span>
          </Link>
          <Link 
            href="/" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">CatchMaster Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the full workflow of the fish catch management system in this interactive demo environment.
          </p>
        </div>

        {/* Demo Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Users,
              title: "Register Fishermen",
              description: "See how to add and manage fisherman records with contact details and barangay assignments.",
            },
            {
              icon: Fish,
              title: "Log Catches",
              description: "Try the catch logging interface with species selection, weight tracking, and location data.",
            },
            {
              icon: BarChart3,
              title: "View Reports",
              description: "Explore interactive charts and analytics dashboards with real-time data visualization.",
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Access Button */}
        <div className="bg-white rounded-2xl border border-border shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Ready to Explore?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Click below to enter the demo environment. You'll have access to all features with sample data.
          </p>
          <button
            onClick={handleEnterDemo}
            disabled={isLoading}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entering Demo...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Enter Demo Environment
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            No account required • Sample data provided • Separate from production
          </p>
        </div>

        {/* Workflow Preview */}
        <div className="mt-12 bg-white rounded-2xl border border-border shadow-sm p-8">
          <h3 className="text-xl font-bold text-primary mb-6">Demo Workflow Preview</h3>
          <div className="space-y-6">
            {[
              { step: "1", title: "Access", desc: "Instantly enter the demo environment" },
              { step: "2", title: "Dashboard", desc: "View sample statistics and recent catches" },
              { step: "3", title: "Fishermen", desc: "Browse sample fisherman records" },
              { step: "4", title: "Log Catch", desc: "Try the catch logging interface" },
              { step: "5", title: "Reports", desc: "View interactive analytics and charts" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-primary">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
