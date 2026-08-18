CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_role TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 5,
  overall_score INTEGER NOT NULL DEFAULT 0,
  communication_score INTEGER NOT NULL DEFAULT 0,
  technical_score INTEGER NOT NULL DEFAULT 0,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_sessions TO authenticated;
GRANT ALL ON public.interview_sessions TO service_role;

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interview sessions"
  ON public.interview_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview sessions"
  ON public.interview_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview sessions"
  ON public.interview_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX interview_sessions_user_created_idx
  ON public.interview_sessions (user_id, created_at DESC);