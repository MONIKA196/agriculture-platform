import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Leaf, 
  LayoutDashboard, 
  Camera, 
  CloudSun, 
  Sprout, 
  User,
  LogOut,
  MessageCircle
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Camera, label: "Disease Detection", href: "/dashboard/disease" },
  { icon: CloudSun, label: "Weather", href: "/dashboard/weather" },
  { icon: Sprout, label: "Fertilizers", href: "/dashboard/fertilizers" },
  { icon: MessageCircle, label: "AI Assistant", href: "/dashboard/assistant" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-4 hidden lg:flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 px-3 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
          <Leaf className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold">AgroSmart</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-primary-foreground rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border pt-4 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
