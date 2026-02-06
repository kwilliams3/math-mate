import { supabase } from "@/integrations/supabase/client";

export interface HistoryItem {
  id: string;
  problem: string;
  answer: string;
  category: string;
  created_at: string;
  user_id: string;
}

export async function saveToHistory(
  problem: string,
  answer: string,
  category: string
): Promise<HistoryItem | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("User not authenticated, history not saved");
    return null;
  }

  const { data, error } = await supabase
    .from("problem_history")
    .insert({
      user_id: user.id,
      problem,
      answer,
      category,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving to history:", error);
    throw error;
  }

  return data;
}

export async function getHistory(): Promise<HistoryItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("problem_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching history:", error);
    throw error;
  }

  return data || [];
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("problem_history")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting history item:", error);
    throw error;
  }
}
