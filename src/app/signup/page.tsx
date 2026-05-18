"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Anchor } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Clear hardcoded invite code from client - server will validate
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic client-side check - server validates properly
    if (!formData.inviteCode) {
      const errorMsg = "Administrative invite code is required";
      setError(errorMsg);
      showToast(errorMsg, "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast("Registration successful! You can now sign in.", "success");
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        const errorMsg = data.message || "Registration failed";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch {
      const errorMsg = "An unexpected error occurred";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/background.png" 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 w-full max-lg p-8 bg-white rounded-2xl shadow-2xl mx-4 my-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 shadow-inner">
            <Anchor className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Admin Registration</h1>
          <p className="text-muted-foreground text-sm mt-1">Join the CatchMaster Management Team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="admin@agdangan.gov"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1 text-primary font-bold">Administrative Invite Code</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border-2 border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-primary/5"
              placeholder="Contact super admin for code"
              value={formData.inviteCode}
              onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 mt-4"
          >
            {loading ? "Registering..." : "Complete Registration"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
