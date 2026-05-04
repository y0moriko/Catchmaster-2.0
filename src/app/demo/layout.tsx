"use client";

import { Providers } from "@/components/providers";
import { usePathname } from "next/navigation";
import { DemoSidebar, ExhibitionGuide } from "@/components/DemoComponents";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Only show the dashboard layout if we're not on the demo landing page
  const isLandingPage = pathname === "/demo";

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-white">
        <Providers>
          {children}
          <ExhibitionGuide currentPath={pathname} />
        </Providers>
      </div>
    );
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-slate-50">
        <DemoSidebar currentPath={pathname} />
        <main className="flex-1 overflow-y-auto relative">
          <div className="bg-blue-600 text-white text-center py-2 text-[10px] font-black uppercase tracking-[0.3em] sticky top-0 z-50 shadow-lg">
            Interactive Exhibition Mode • Agdangan Municipality
          </div>
          {children}
          <ExhibitionGuide currentPath={pathname} />
        </main>
      </div>
    </Providers>
  );
}
