"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RoleGuard({ 
  children, 
  allowedRoles,
  fallbackPath = "/dashboard"
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes((session.user as { role?: string })?.role || "")) {
      router.push(fallbackPath);
    }
  }, [session, status, router, allowedRoles, fallbackPath]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session || !allowedRoles.includes((session.user as { role?: string })?.role || "")) {
    return null;
  }

  return <>{children}</>;
}
