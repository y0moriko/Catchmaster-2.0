"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">An error occurred</h2>
        <p className="text-muted-foreground mb-6">Failed to load this page.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Retry
          </button>
          <Link
            href="/dashboard"
            className="border border-primary text-primary px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
