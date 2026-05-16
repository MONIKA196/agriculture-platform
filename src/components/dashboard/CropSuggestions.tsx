import { motion } from "framer-motion";
import { Wheat, TrendingUp, Calendar, Droplets } from "lucide-react";

const CropSuggestions = () => {
  const crops = [
    {
      name: "Rice (Paddy)",
      suitability: 95,
      season: "Kharif",
      waterNeeded: "High",
      icon: "🌾",
    },
    {
      name: "Sugarcane",
      suitability: 88,
      season: "Annual",
      waterNeeded: "High",
      icon: "🌿",
    },
    {
      name: "Maize",
      suitability: 82,
      season: "Kharif/Rabi",
      waterNeeded: "Medium",
      icon: "🌽",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
          <Wheat className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Recommended Crops</h3>
          <p className="text-sm text-muted-foreground">Based on weather & soil conditions</p>
        </div>
      </div>

      <div className="space-y-4">
        {crops.map((crop, index) => (
          <motion.div
            key={crop.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-muted/50 rounded-xl"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{crop.icon}</span>
                <div>
                  <p className="font-semibold">{crop.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>{crop.suitability}% suitable</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{crop.season}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Droplets className="w-4 h-4" />
                <span>{crop.waterNeeded} water</span>
              </div>
            </div>
            
            {/* Suitability bar */}
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${crop.suitability}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="h-full bg-gradient-hero rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CropSuggestions;
