-- Create table for storing math problem history
CREATE TABLE public.problem_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.problem_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own history" 
ON public.problem_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own history entries" 
ON public.problem_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history" 
ON public.problem_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_problem_history_user_id ON public.problem_history(user_id);
CREATE INDEX idx_problem_history_created_at ON public.problem_history(created_at DESC);