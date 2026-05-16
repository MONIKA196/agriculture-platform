import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WeatherCard from "@/components/dashboard/WeatherCard";
import DiseaseUpload from "@/components/dashboard/DiseaseUpload";
import FertilizerCard from "@/components/dashboard/FertilizerCard";
import CropSuggestions from "@/components/dashboard/CropSuggestions";
import { 
  Leaf, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2 
} from "lucide-react";

const statsCards = [
  {
    label: "Crops Monitored",
    value: "12",
    change: "+2 this month",
    icon: Leaf,
    color: "bg-forest/10 text-forest",
  },
  {
    label: "Health Score",
    value: "87%",
    change: "+5% from last week",
    icon: TrendingUp,
    color: "bg-sage/10 text-sage",
  },
  {
    label: "Active Alerts",
    value: "3",
    change: "2 high priority",
    icon: AlertTriangle,
    color: "bg-terracotta/10 text-terracotta",
  },
  {
    label: "Tasks Completed",
    value: "24",
    change: "8 remaining",
    icon: CheckCircle2,
    color: "bg-sky/10 text-sky",
  },
];

const Dashboard = () => {
  const { profile } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = profile?.full_name?.split(" ")[0] || "Farmer";

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="lg:ml-64">
        <DashboardHeader />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold mb-2">
              {getGreeting()}, {userName}! 🌱
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your farm today.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-5 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-primary mt-1">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weather Card */}
              <WeatherCard />
              
              {/* Disease Detection */}
              <DiseaseUpload />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Crop Suggestions */}
              <CropSuggestions />
              
              {/* Fertilizer Recommendations */}
              <FertilizerCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
