import { motion } from "framer-motion";
import { Sprout, Droplets, Leaf, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

const FertilizerCard = () => {
  const recommendations = [
    {
      name: "NPK 14-14-14",
      type: "Balanced",
      quantity: "25 kg/acre",
      icon: FlaskConical,
      color: "bg-forest/10 text-forest",
    },
    {
      name: "Urea",
      type: "Nitrogen-rich",
      quantity: "15 kg/acre",
      icon: Droplets,
      color: "bg-sky/10 text-sky",
    },
    {
      name: "Vermicompost",
      type: "Organic",
      quantity: "200 kg/acre",
      icon: Leaf,
      color: "bg-sage/10 text-sage",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
          <Sprout className="w-5 h-5 text-forest" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Fertilizer Recommendations</h3>
          <p className="text-sm text-muted-foreground">Based on your soil and crop</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {recommendations.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.type}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-primary">{item.quantity}</span>
          </motion.div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        View All Recommendations
      </Button>
    </motion.div>
  );
};

export default FertilizerCard;
