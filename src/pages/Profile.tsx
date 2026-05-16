import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Ruler, 
  Sprout,
  Save,
  Camera
} from "lucide-react";

const Profile = () => {
  const { profile, updateProfile, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    farm_location: "",
    farm_size: "",
    primary_crops: [] as string[],
  });
  const [cropsInput, setCropsInput] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        farm_location: profile.farm_location || "",
        farm_size: profile.farm_size || "",
        primary_crops: profile.primary_crops || [],
      });
      setCropsInput(profile.primary_crops?.join(", ") || "");
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const crops = cropsInput.split(",").map(c => c.trim()).filter(Boolean);

    const { error } = await updateProfile({
      full_name: formData.full_name,
      phone: formData.phone,
      farm_location: formData.farm_location,
      farm_size: formData.farm_size,
      primary_crops: crops,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="lg:ml-64">
        <DashboardHeader />
        
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="font-display text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground mb-8">
              Manage your account settings and farm details
            </p>

            {/* Avatar Section */}
            <div className="bg-card rounded-2xl p-6 shadow-md mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-hero flex items-center justify-center">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-md">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="font-semibold text-xl">{formData.full_name || "User"}</h2>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <p className="text-sm text-primary mt-1">
                    Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Today"}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-md space-y-6">
              <h3 className="font-semibold text-lg border-b border-border pb-3">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="pl-10"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farm_location">Farm Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="farm_location"
                      value={formData.farm_location}
                      onChange={(e) => setFormData({ ...formData, farm_location: e.target.value })}
                      className="pl-10"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-lg border-b border-border pb-3 pt-4">Farm Details</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="farm_size">Farm Size</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="farm_size"
                      value={formData.farm_size}
                      onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                      className="pl-10"
                      placeholder="e.g., 5 acres"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crops">Primary Crops (comma-separated)</Label>
                  <div className="relative">
                    <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="crops"
                      value={cropsInput}
                      onChange={(e) => setCropsInput(e.target.value)}
                      className="pl-10"
                      placeholder="Rice, Wheat, Cotton"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
