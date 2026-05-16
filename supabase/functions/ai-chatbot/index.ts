import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_API_KEY = Deno.env.get("AI_API_KEY") || Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const systemPrompt = `You are AgroSmart AI, an expert agricultural assistant designed to help farmers with their queries. You have extensive knowledge about:

1. **Crop Diseases**: Identification, causes, symptoms, and treatment methods for various plant diseases
2. **Fertilizers**: NPK recommendations, organic alternatives, application timing and methods
3. **Weather Impact**: How weather affects crops, irrigation advice, seasonal planting guides
4. **Soil Management**: Soil types, nutrient requirements, pH management, composting
5. **Pest Control**: Identification and eco-friendly pest management strategies
6. **Crop Selection**: Best crops for different regions, seasons, and soil types
7. **Organic Farming**: Natural fertilizers, companion planting, sustainable practices
8. **Irrigation**: Water management, drip irrigation, rainwater harvesting

Always provide:
- Clear, actionable advice
- Scientific explanations in simple terms
- Both chemical and organic options when applicable
- Safety precautions when recommending treatments
- Region-appropriate suggestions when possible

Be friendly, supportive, and encouraging to farmers. If you're unsure about something, recommend consulting with local agricultural experts.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Chatbot error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
