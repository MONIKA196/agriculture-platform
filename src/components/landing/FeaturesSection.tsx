import { motion } from "framer-motion";
import { 
  Camera, 
  CloudSun, 
  Sprout, 
  Microscope, 
  BarChart3,
  MessageCircle
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Disease Detection",
    description: "Upload crop images and get instant AI-powered disease diagnosis with treatment recommendations.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Sprout,
    title: "Fertilizer Advisor",
    description: "Get personalized fertilizer recommendations based on soil type, crop, and weather conditions.",
    color: "bg-forest/10 text-forest",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    description: "Real-time weather data with smart alerts for frost, rain, and ideal planting conditions.",
    color: "bg-sky/10 text-sky",
  },
  {
    icon: Microscope,
    title: "Soil Analysis",
    description: "Comprehensive soil-based crop recommendations for maximum yield and sustainability.",
    color: "bg-earth/10 text-earth",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Chat with our intelligent AI assistant for instant farming advice and recommendations.",
    color: "bg-terracotta/10 text-terracotta",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Track crop health trends, predict yields, and optimize your farming operations.",
    color: "bg-gold/10 text-gold",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Farm Smarter</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our comprehensive suite of AI-powered tools helps you make data-driven
            decisions for healthier crops and better yields.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
