"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  LayoutDashboard, 
  Users, 
  Fish, 
  BarChart3, 
  X, 
  Info,
  HelpCircle,
  Award,
  Waves,
  ChevronRight,
  Eye,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Scene {
  id: string;
  title: string;
  narrative: string;
  actionLabel: string;
  matchPath: string;
  path: string;
  tip: string;
}

const exhibitionScenes: Scene[] = [
  {
    id: "welcome",
    title: "Agdangan Digital Transformation",
    narrative: "Welcome to CatchMaster! This walkthrough shows our 'Port to Plate' tracking system for Agdangan's coastal economy.",
    actionLabel: "Begin Journey",
    matchPath: "/demo",
    path: "/demo/dashboard",
    tip: "You can freely explore any section using the sidebar. The guide below follows your progress."
  },
  {
    id: "dashboard",
    title: "Step 1: Intelligence Dashboard",
    narrative: "You are viewing the Executive Overview. Officials monitor municipal production and economic growth in real-time here.",
    actionLabel: "Go to Registry",
    matchPath: "/demo/dashboard",
    path: "/demo/fishermen",
    tip: "Stats are aggregated automatically from port entries. Try hovering over cards for details."
  },
  {
    id: "fishermen",
    title: "Step 2: Community Registry",
    narrative: "You are viewing the Fisherman Registry. This is where we manage subsidies and fishing rights effectively.",
    actionLabel: "Log a Catch",
    matchPath: "/demo/fishermen",
    path: "/demo/catches",
    tip: "Click 'Register New Fisherman' to see the onboarding workflow in action."
  },
  {
    id: "catches",
    title: "Step 3: Precision Logging",
    narrative: "You are on the Catch Logging page. Staff log landings instantly here, eliminating paper trails.",
    actionLabel: "View Analytics",
    matchPath: "/demo/catches",
    path: "/demo/reports",
    tip: "Fill out the form and click 'Finalize & Record Catch' to see data synchronization."
  },
  {
    id: "reports",
    title: "Step 4: Governance Reports",
    narrative: "You are viewing Analytics & Reports. Automated reports help secure funding and protect marine sanctuaries.",
    actionLabel: "Restart Tour",
    matchPath: "/demo/reports",
    path: "/demo",
    tip: "Click 'Export Report' to generate a sample report for LGU officials."
  }
];

const workflowCards = [
  {
    id: "fishermen",
    title: "Add Fisherman",
    description: "Register a new fisherman with personal details and barangay assignment.",
    icon: Users,
    path: "/demo/fishermen",
    color: "from-green-500 to-emerald-600",
    steps: ["Click 'Register New Fisherman'", "Fill in name & barangay", "Submit to add to registry"]
  },
  {
    id: "fish-directory",
    title: "Browse Fish Directory",
    description: "Explore fish species from Tayabas Bay with detailed information and filters.",
    icon: Fish,
    path: "/demo/fish-directory",
    color: "from-teal-500 to-cyan-600",
    steps: ["View fish species cards", "Use filters by family/habitat", "Search by name or scientific name"]
  },
  {
    id: "catch",
    title: "Log Catch",
    description: "Record daily fish landings with species, weight, and location data.",
    icon: Fish,
    path: "/demo/catches",
    color: "from-blue-500 to-cyan-600",
    steps: ["Select fisherman", "Choose fish species", "Enter weight & finalize"]
  },
  {
    id: "dashboard",
    title: "View Dashboard",
    description: "Monitor real-time statistics and catch trends across the municipality.",
    icon: LayoutDashboard,
    path: "/demo/dashboard",
    color: "from-purple-500 to-indigo-600",
    steps: ["Check total catch stats", "View recent activity", "Analyze top performers"]
  },
  {
    id: "reports",
    title: "Generate Reports",
    description: "Create comprehensive data exports for municipal planning and compliance.",
    icon: BarChart3,
    path: "/demo/reports",
    color: "from-amber-500 to-orange-600",
    steps: ["Select report type", "Set date range", "Export as PDF/CSV"]
  }
];

export function ExhibitionGuide({ currentPath }: { currentPath: string }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(-1);
  const [minimized, setMinimized] = useState(false);
  const [showWorkflows, setShowWorkflows] = useState(false);

  useEffect(() => {
    const sceneIndex = exhibitionScenes.findIndex(s => s.matchPath === currentPath);
    if (sceneIndex !== -1) {
      setActiveSceneIndex(sceneIndex);
      setMinimized(false);
    }
  }, [currentPath]);

  if (activeSceneIndex === -1) return null;

  const scene = exhibitionScenes[activeSceneIndex];

  return (
    <>
      {/* Workflow Quick Access Panel */}
      {showWorkflows && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[200] w-80 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-xs uppercase tracking-wider">Workflows</span>
              </div>
              <button 
                onClick={() => setShowWorkflows(false)}
                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {workflowCards.map((workflow) => (
                <Link
                  key={workflow.id}
                  href={workflow.path}
                  className="block p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${workflow.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <workflow.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{workflow.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{workflow.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {workflow.steps.map((step, i) => (
                          <span key={i} className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                            {i + 1}. {step}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Guide - Shows when not minimized */}
      {!minimized && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[200] px-4 animate-fade-in-up">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="font-bold text-[10px] uppercase tracking-wider">Exhibition Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowWorkflows(!showWorkflows)}
                  className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                  title="Show workflows"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setMinimized(true)}
                  className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                <Waves className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Step {activeSceneIndex + 1}/{exhibitionScenes.length}</span>
                    {activeSceneIndex < exhibitionScenes.length - 1 && (
                      <span className="text-[10px] text-slate-400">Next: {exhibitionScenes[activeSceneIndex + 1].title}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">{scene.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-1">
                    {scene.narrative}
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-[11px] text-slate-400 italic">
                    <span className="text-amber-400 font-bold not-italic mr-1">TIP:</span>
                    {scene.tip}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-1">
                    {exhibitionScenes.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1 rounded-full transition-all duration-500",
                          i === activeSceneIndex ? "w-4 bg-blue-500" : "w-1 bg-white/20"
                        )}
                      />
                    ))}
                  </div>
                  <Link 
                    href={scene.path}
                    className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-50 transition-all flex items-center gap-2 group whitespace-nowrap"
                  >
                    {scene.actionLabel}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Trigger - Always visible when minimized */}
      {minimized && (
        <button 
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-[201] bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all animate-bounce"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

export function DemoSidebar({ currentPath }: { currentPath: string }) {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/demo/dashboard", id: "nav-dashboard", description: "View stats & trends" },
    { name: "Fishermen", icon: Users, path: "/demo/fishermen", id: "nav-fishermen", description: "Manage registry" },
    { name: "Fish Directory", icon: Fish, path: "/demo/fish-directory", id: "nav-fish-directory", description: "Browse species" },
    { name: "Log Catch", icon: Fish, path: "/demo/catches", id: "nav-catches", description: "Record landings" },
    { name: "Reports", icon: BarChart3, path: "/demo/reports", id: "nav-reports", description: "Analytics & export" },
  ];

  return (
    <div className={`${collapsed ? "w-20" : "w-64"} bg-slate-900 border-r border-white/5 h-screen sticky top-0 flex flex-col z-50 transition-all duration-300`}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
          <div className="bg-blue-600 p-2 rounded-xl">
            <Waves className="text-white w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-black text-lg text-white tracking-tighter block leading-none">CATCHMASTER</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Municipal OS</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            id={item.id}
            title={collapsed ? item.name : item.description}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group relative",
              currentPath === item.path 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn("w-4 h-4 transition-transform flex-shrink-0", currentPath === item.path ? "scale-110" : "group-hover:scale-110")} />
            {!collapsed && (
              <span className="truncate">{item.name}</span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.name}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link 
          href="/demo"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {!collapsed && "Back to Demo Info"}
        </Link>
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
          {!collapsed && "Exit Exhibition"}
        </Link>
      </div>
    </div>
  );
}
