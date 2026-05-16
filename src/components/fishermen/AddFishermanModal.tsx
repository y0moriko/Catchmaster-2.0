"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { createFisherman } from "@/lib/actions/fisherman";
import ImageUpload from "@/components/ImageUpload";

export default function AddFishermanModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      barangay: formData.get("barangay") as string,
      contactNumber: formData.get("contactNumber") as string,
      imageUrl: imageUrl || undefined,
    };

    const result = await createFisherman(data);

    if (result.success) {
      setIsOpen(false);
      // Success handling (maybe a toast)
    } else {
      setError(result.error || "Failed to create fisherman");
    }
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Add Fisherman
      </button>

      {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden mx-0 sm:mx-auto">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-primary">Add New Fisherman</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input 
                    name="firstName" 
                    required 
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input 
                    name="lastName" 
                    required 
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Dela Cruz"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="juan@example.com (optional)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Barangay</label>
                <select 
                  name="barangay" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                >
                  <option value="">Select Barangay</option>
                  <option value="Poblacion">Poblacion</option>
                  <option value="Ilayang Polo">Ilayang Polo</option>
                  <option value="Kanlurang Calutan">Kanlurang Calutan</option>
                  <option value="Silangang Calutan">Silangang Calutan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Contact Number</label>
                <input 
                  name="contactNumber" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="0912 345 6789"
                />
              </div>

              <ImageUpload value={imageUrl} onChange={setImageUrl} label="Profile Picture" />

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg font-medium disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Fisherman"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
