"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Anchor, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // Demo mode removed - use proper credentials

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const errorMsg = "Invalid email or password";
        setError(errorMsg);
        showToast(errorMsg, "error");
        setLoading(false);
      } else {
        showToast("Login successful! Welcome back.", "success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      const errorMsg = "An unexpected error occurred";
      setError(errorMsg);
      showToast(errorMsg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="w-full h-full bg-[url('/background.png')] bg-cover bg-center" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Anchor className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">CatchMaster</h1>
          <p className="text-muted-foreground text-sm mt-1">Agdangan Fish Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

      {searchParams.get("registered") === "true" && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-100">
          Registration successful! Please sign in.
        </div>
      )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="admin@agdangan.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-slate-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}
