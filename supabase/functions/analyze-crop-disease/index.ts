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
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const AI_API_KEY = Deno.env.get("AI_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural plant pathologist AI. Analyze the provided crop/plant image and identify any diseases present.

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this exact structure:
{
  "disease": "Name of the disease or 'Healthy - No Disease Detected' if plant is healthy",
  "confidence": number between 0-100 representing your confidence percentage,
  "cause": "Brief explanation of what causes this disease (pathogens, environmental factors, etc.)",
  "prevention": ["Array of 4-6 actionable prevention and treatment recommendations"],
  "severity": "low" | "medium" | "high" | "none",
  "additionalInfo": "Any additional helpful information for the farmer"
}

If the image is not of a plant or crop, respond with:
{
  "disease": "Not a Plant Image",
  "confidence": 0,
  "cause": "The uploaded image does not appear to be a plant or crop image.",
  "prevention": ["Please upload a clear image of a plant leaf or crop for disease analysis"],
  "severity": "none",
  "additionalInfo": "For best results, upload a clear, well-lit photo of the affected plant part."
}

Be specific about the disease name, provide accurate scientific information, and give practical advice suitable for farmers.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this crop/plant image for any diseases and provide a detailed diagnosis with treatment recommendations."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI model");
    }

    // Parse the JSON response from the AI
    let analysisResult;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();
      
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback response if parsing fails
      analysisResult = {
        disease: "Analysis Complete",
        confidence: 75,
        cause: content.substring(0, 200),
        prevention: ["Please consult a local agricultural expert for detailed advice"],
        severity: "medium",
        additionalInfo: "AI response could not be fully parsed. Raw analysis provided."
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-crop-disease:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
