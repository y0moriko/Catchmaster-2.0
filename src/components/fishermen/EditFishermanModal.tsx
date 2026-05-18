"use client";

import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import { updateFisherman, getFishermanById } from "@/lib/actions/fisherman";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/components/Toast";

interface Fisherman {
  id: string;
  name: string;
  email: string;
  barangay: string;
  contactNumber: string;
  imageUrl?: string | null;
  totalWeight: number;
  initials: string;
}

export default function EditFishermanModal({ fisherman, onClose }: { fisherman: Fisherman; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(fisherman.imageUrl || null);
  const [formData, setFormData] = useState({
    firstName: fisherman.name.split(" ")[0] || "",
    lastName: fisherman.name.split(" ").slice(1).join(" ") || "",
    email: fisherman.email,
    barangay: fisherman.barangay,
    contactNumber: fisherman.contactNumber,
  });
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await updateFisherman(fisherman.id, { ...formData, imageUrl: imageUrl || undefined });

    if (result.success) {
      showToast("Fisherman updated successfully!", "success");
      onClose();
      router.refresh();
    } else {
      const errorMsg = ("error" in result && result.error) || "Failed to update fisherman";
      setError(errorMsg);
      showToast(errorMsg, "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden mx-0 sm:mx-auto">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">Edit Fisherman</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
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
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <input
                name="lastName"
                required
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Dela Cruz"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="juan@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Barangay</label>
            <select
              name="barangay"
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
              value={formData.barangay}
              onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
            >
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
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>

              <ImageUpload value={imageUrl} onChange={setImageUrl} label="Profile Picture" />

              <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg font-medium disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
