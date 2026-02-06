import { supabase } from "@/integrations/supabase/client";

interface Step {
  title: string;
  content: string;
  formula?: string;
}

interface Solution {
  steps: Step[];
  finalAnswer: string;
}

export async function solveMathProblem(
  problem: string, 
  category: string, 
  image?: string
): Promise<Solution> {
  const { data, error } = await supabase.functions.invoke('solve-math', {
    body: { problem, category, image }
  });

  if (error) {
    console.error("Error calling solve-math function:", error);
    throw new Error(error.message || "Erreur lors de la résolution");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  // Validate the response structure
  if (!data.steps || !Array.isArray(data.steps) || !data.finalAnswer) {
    console.error("Invalid response structure:", data);
    throw new Error("Réponse invalide du solveur");
  }

  return {
    steps: data.steps,
    finalAnswer: data.finalAnswer,
  };
}
