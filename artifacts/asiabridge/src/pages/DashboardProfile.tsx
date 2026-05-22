import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardProfile() {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: "", companyDescription: "", country: "", category: "", contactPhone: "", contactWebsite: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        country: user.country || "",
        category: user.category || "",
        contactPhone: user.contactPhone || "",
        contactWebsite: user.contactWebsite || ""
      });
    }
  }, [user]);

  const updateMutation = useUpdateUser({
    mutation: {
      onSuccess: () => {
        refetchUser();
        toast({ title: "Profile updated successfully" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: formData });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-sidebar mb-6">Company Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-border">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input value={formData.companyName} onChange={e => setFormData(p => ({...p, companyName: e.target.value}))} />
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              rows={4} 
              value={formData.companyDescription} 
              onChange={e => setFormData(p => ({...p, companyDescription: e.target.value}))} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={formData.country} onChange={e => setFormData(p => ({...p, country: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Industry / Category</Label>
              <Input value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.contactPhone} onChange={e => setFormData(p => ({...p, contactPhone: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={formData.contactWebsite} onChange={e => setFormData(p => ({...p, contactWebsite: e.target.value}))} />
            </div>
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
