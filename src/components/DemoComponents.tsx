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
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Scene {
  id: string;
  title: string;
  narrative: string;
  actionLabel: string;
  path: string;
  tip: string;
}

const exhibitionScenes: Scene[] = [
  {
    id: "welcome",
    title: "Agdangan Digital Transformation",
    narrative: "We are digitizing the coastal economy of Agdangan, Quezon. This walkthrough shows our 'Port to Plate' tracking.",
    actionLabel: "Begin Journey",
    path: "/demo/dashboard",
    tip: "The Guide at the bottom helps you navigate each module."
  },
  {
    id: "dashboard",
    title: "Step 1: Intelligence",
    narrative: "Officials monitor municipal production and economic growth in real-time.",
    actionLabel: "Registry",
    path: "/demo/fishermen",
    tip: "Stats are aggregated automatically from port entries."
  },
  {
    id: "fishermen",
    title: "Step 2: Community",
    narrative: "We maintain a digital registry to manage subsidies and fishing rights effectively.",
    actionLabel: "Log Catch",
    path: "/demo/catches",
    tip: "Register a new fisherman to see the onboarding speed."
  },
  {
    id: "catches",
    title: "Step 3: Precision",
    narrative: "Staff log landings instantly, eliminating paper trails and preventing data loss.",
    actionLabel: "Analytics",
    path: "/demo/reports",
    tip: "Try finalizing a catch to see the data sync."
  },
  {
    id: "reports",
    title: "Step 4: Governance",
    narrative: "Automated reports help secure funding and protect marine sanctuaries.",
    actionLabel: "Restart",
    path: "/demo",
    tip: "Manual tabulation used to take weeks—now it takes seconds."
  }
];

export function ExhibitionGuide({ currentPath }: { currentPath: string }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(-1);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const sceneIndex = exhibitionScenes.findIndex(s => s.path === currentPath);
    if (sceneIndex !== -1) {
      setActiveSceneIndex(sceneIndex);
      setMinimized(false);
    } else if (currentPath === "/demo") {
      setActiveSceneIndex(0);
    }
  }, [currentPath]);

  if (activeSceneIndex === -1) return null;

  const scene = exhibitionScenes[activeSceneIndex];

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg z-[200] transition-all duration-500 px-4",
      minimized ? "translate-y-24" : "translate-y-0"
    )}>
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span className="font-bold text-[10px] uppercase tracking-wider">Exhibition Guide</span>
          </div>
          <button 
            onClick={() => setMinimized(!minimized)}
            className="hover:bg-white/20 p-1 rounded-lg transition-colors"
          >
            {minimized ? <HelpCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
            <Waves className="w-6 h-6 text-blue-400" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
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
                href={exhibitionScenes[(activeSceneIndex + 1) % exhibitionScenes.length].path}
                className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-50 transition-all flex items-center gap-2 group whitespace-nowrap"
              >
                {scene.actionLabel}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Minimized Trigger */}
      {minimized && (
        <button 
          onClick={() => setMinimized(false)}
          className="absolute -top-10 right-8 bg-blue-600 text-white p-2 rounded-full shadow-2xl animate-bounce"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function DemoSidebar({ currentPath }: { currentPath: string }) {
  const items = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/demo/dashboard", id: "nav-dashboard" },
    { name: "Fishermen", icon: Users, path: "/demo/fishermen", id: "nav-fishermen" },
    { name: "Log Catch", icon: Fish, path: "/demo/catches", id: "nav-catches" },
    { name: "Reports", icon: BarChart3, path: "/demo/reports", id: "nav-reports" },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-white/5 h-screen sticky top-0 flex flex-col z-50">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Waves className="text-white w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg text-white tracking-tighter block leading-none">CATCHMASTER</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Municipal OS</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            id={item.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group",
              currentPath === item.path 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn("w-4 h-4 transition-transform", currentPath === item.path ? "scale-110" : "group-hover:scale-110")} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
          Exit Exhibition
        </Link>
      </div>
    </div>
  );
}
