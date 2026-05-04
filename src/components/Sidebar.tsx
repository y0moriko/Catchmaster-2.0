"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Fish,
  BarChart3,
  Anchor,
  LogOut,
  Menu,
  X,
  FileText,
  Zap,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || "staff";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Fishermen", href: "/fishermen" },
    { icon: Fish, label: "Fish Directory", href: "/fish-directory" },
    { icon: Fish, label: "Catch Logging", href: "/catches" },
    { icon: BarChart3, label: "Reports", href: "/reports" },
    { icon: FileText, label: "Import Data", href: "/import" },
    { icon: Zap, label: "Speed-Log", href: "/speedlog" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Eye, label: "Public Dashboard", href: "/public" },
  ].filter(item => !(item as { adminOnly?: boolean }).adminOnly || userRole === "admin");

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <Anchor className="text-primary w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">CatchMaster</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "w-64 bg-primary text-white flex flex-col h-screen fixed lg:relative z-40 transition-transform duration-300",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <Anchor className="text-primary w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">CatchMaster</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
}
