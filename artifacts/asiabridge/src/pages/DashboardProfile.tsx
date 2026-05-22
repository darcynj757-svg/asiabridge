import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Building2 } from "lucide-react";

const COUNTRIES = [
  "Russia", "Kazakhstan", "Belarus", "Ukraine", "Uzbekistan",
  "Azerbaijan", "Armenia", "Georgia", "Thailand", "Vietnam",
  "Malaysia", "Indonesia", "Singapore", "China", "Other"
];

const CATEGORIES = [
  "Machinery & Equipment", "Food & Beverages", "Chemicals",
  "Metals & Materials", "Textiles & Apparel", "Agriculture",
  "Electronics", "Construction Materials", "Other",
];

export default function DashboardProfile() {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    category: "",
    logoUrl: "",
    contactPhone: "",
    contactWebsite: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName || "",
        country: user.country || "",
        category: user.category || "",
        logoUrl: user.logoUrl || "",
        contactPhone: user.contactPhone || "",
        contactWebsite: user.contactWebsite || "",
      });
    }
  }, [user]);

  const updateMutation = useUpdateUser({
    mutation: {
      onSuccess: () => {
        refetchUser();
        toast({ title: "Profile updated successfully" });
      },
      onError: () => {
        toast({ title: "Failed to update profile", variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: formData });
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#F7941D] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = (user.companyName || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account information</p>
      </div>

      <div className="max-w-xl space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0D1B2A] flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user.logoUrl ? (
              <img src={user.logoUrl} className="w-full h-full rounded-full object-cover" alt="" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="font-bold text-[#0D1B2A] text-lg">{user.companyName || user.email}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{user.role}</span>
              {user.country && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" /> {user.country}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Mail className="h-3 w-3" /> {user.email}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#0D1B2A] mb-5">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-600">
                <Building2 className="h-3.5 w-3.5" /> Company Name
              </Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                placeholder="Your company name"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-600">
                <MapPin className="h-3.5 w-3.5" /> Country
              </Label>
              <Select value={formData.country} onValueChange={(v) => setFormData((p) => ({ ...p, country: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-600">Business Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-600">Logo URL (optional)</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.logoUrl}
                onChange={(e) => setFormData((p) => ({ ...p, logoUrl: e.target.value }))}
              />
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-[#0D1B2A] hover:bg-[#1a2e47] text-white"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
