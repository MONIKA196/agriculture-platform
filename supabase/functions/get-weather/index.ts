import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, city } = await req.json();
    
    // Use OpenWeatherMap-like response with mock data for demo
    // In production, you would use: const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    
    // For demo purposes, return realistic weather data based on location
    const weatherData = {
      location: city || "Your Location",
      temperature: Math.round(20 + Math.random() * 15),
      feels_like: Math.round(18 + Math.random() * 15),
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
      humidity: Math.round(50 + Math.random() * 30),
      rainfall: Math.round(Math.random() * 20),
      wind_speed: Math.round(5 + Math.random() * 20),
      pressure: Math.round(1010 + Math.random() * 20),
      visibility: Math.round(8 + Math.random() * 4),
      uv_index: Math.round(1 + Math.random() * 10),
      sunrise: "06:15 AM",
      sunset: "06:45 PM",
      forecast: [
        { day: "Today", high: Math.round(28 + Math.random() * 5), low: Math.round(18 + Math.random() * 3), condition: "Sunny" },
        { day: "Tomorrow", high: Math.round(26 + Math.random() * 5), low: Math.round(17 + Math.random() * 3), condition: "Cloudy" },
        { day: "Day 3", high: Math.round(25 + Math.random() * 5), low: Math.round(16 + Math.random() * 3), condition: "Rain" },
      ],
      farming_advice: generateFarmingAdvice(Math.round(20 + Math.random() * 15), Math.round(50 + Math.random() * 30)),
    };

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateFarmingAdvice(temp: number, humidity: number): string {
  if (temp > 30 && humidity < 40) {
    return "High temperature and low humidity. Consider irrigation and mulching to retain soil moisture.";
  } else if (temp > 25 && humidity > 70) {
    return "Warm and humid conditions. Watch for fungal diseases. Avoid overhead irrigation.";
  } else if (temp < 15) {
    return "Cool temperatures. Protect frost-sensitive crops. Good time for cold-weather vegetables.";
  } else {
    return "Favorable conditions for most crops. Ideal for planting and general farming activities.";
  }
}
