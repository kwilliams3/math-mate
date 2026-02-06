import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es un expert en mathématiques. Tu résous les problèmes mathématiques de manière claire et pédagogique.

Pour chaque problème, tu dois retourner une réponse JSON valide avec cette structure exacte:
{
  "steps": [
    {
      "title": "Titre de l'étape",
      "content": "Explication détaillée de cette étape",
      "formula": "Formule mathématique si applicable (optionnel)"
    }
  ],
  "finalAnswer": "La réponse finale"
}

Règles:
- Donne toujours entre 3 et 7 étapes claires
- Chaque étape doit avoir un titre court et un contenu explicatif
- Inclus les formules mathématiques dans le champ "formula" quand c'est pertinent
- La réponse finale doit être concise et claire
- Utilise des notations mathématiques standard (x², √, π, ∫, ∑, etc.)
- Adapte le niveau d'explication au type de problème
- Si une image est fournie, analyse-la attentivement pour extraire le problème mathématique
- Réponds UNIQUEMENT avec le JSON, sans texte avant ou après`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problem, category, image } = await req.json();

    if (!problem && !image) {
      return new Response(
        JSON.stringify({ error: "Le problème ou une image est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const categoryContext = category ? `\nCatégorie: ${category}` : "";
    
    // Build the user message content
    let userContent: any;
    
    if (image) {
      // Image provided - use multimodal input
      const textPart = problem 
        ? `Résous ce problème mathématique visible dans l'image:${categoryContext}\n\nContexte additionnel: ${problem}`
        : `Analyse cette image et résous le problème mathématique qu'elle contient:${categoryContext}`;
      
      userContent = [
        { type: "text", text: textPart },
        { 
          type: "image_url", 
          image_url: { url: image }
        }
      ];
    } else {
      // Text only
      userContent = `Résous ce problème mathématique:${categoryContext}\n\nProblème: ${problem}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants. Veuillez recharger votre compte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la résolution" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from the AI
    let solution;
    try {
      // Remove potential markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      solution = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback response
      solution = {
        steps: [
          {
            title: "Analyse du problème",
            content: content,
          }
        ],
        finalAnswer: "Voir l'analyse ci-dessus"
      };
    }

    return new Response(JSON.stringify(solution), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("solve-math error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
