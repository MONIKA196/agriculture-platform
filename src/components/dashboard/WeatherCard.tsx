import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  Cloud, 
  Sun, 
  Droplets, 
  Wind, 
  CloudRain,
  Loader2,
  MapPin
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  feels_like: number;
  condition: string;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  farming_advice: string;
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get user's location
      let lat = 19.076;
      let lon = 72.8777;
      let city = "Mumbai, India";

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          city = "Your Location";
        } catch (geoError) {
          console.log("Using default location");
        }
      }

      const { data, error } = await supabase.functions.invoke("get-weather", {
        body: { lat, lon, city },
      });

      if (error) throw error;
      setWeather(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition?.toLowerCase() || "";
    if (lower.includes("rain")) return <CloudRain className="w-12 h-12" />;
    if (lower.includes("cloud")) return <Cloud className="w-12 h-12" />;
    return <Sun className="w-12 h-12" />;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-sky rounded-2xl p-6 text-primary-foreground min-h-[200px] flex items-center justify-center"
      >
        <Loader2 className="w-8 h-8 animate-spin" />
      </motion.div>
    );
  }

  if (error || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-sky rounded-2xl p-6 text-primary-foreground"
      >
        <p className="text-center">Unable to load weather data</p>
        <button onClick={fetchWeather} className="mt-2 underline text-sm">
          Try again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-sky rounded-2xl p-6 text-primary-foreground overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-20">
        <Sun className="w-32 h-32 -mr-8 -mt-8" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">{weather.location}</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-start">
              <span className="text-6xl font-display font-bold">{weather.temperature}</span>
              <span className="text-2xl mt-2">°C</span>
            </div>
            <p className="text-lg opacity-90">{weather.condition}</p>
          </div>
          <div className="p-3 bg-primary-foreground/10 rounded-xl">
            {getWeatherIcon(weather.condition)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg p-3">
            <Droplets className="w-5 h-5" />
            <div>
              <p className="text-xs opacity-70">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg p-3">
            <CloudRain className="w-5 h-5" />
            <div>
              <p className="text-xs opacity-70">Rainfall</p>
              <p className="font-semibold">{weather.rainfall}mm</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg p-3">
            <Wind className="w-5 h-5" />
            <div>
              <p className="text-xs opacity-70">Wind</p>
              <p className="font-semibold">{weather.wind_speed}km/h</p>
            </div>
          </div>
        </div>

        {weather.farming_advice && (
          <div className="bg-primary-foreground/10 rounded-lg p-3">
            <p className="text-xs opacity-70 mb-1">🌾 Farming Advice</p>
            <p className="text-sm">{weather.farming_advice}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherCard;
