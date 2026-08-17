CREATE TABLE public.resume_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  target_role TEXT NOT NULL,
  job_description TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_analyses TO authenticated;
GRANT ALL ON public.resume_analyses TO service_role;

ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume analyses"
  ON public.resume_analyses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resume analyses"
  ON public.resume_analyses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume analyses"
  ON public.resume_analyses FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX resume_analyses_user_created_idx ON public.resume_analyses (user_id, created_at DESC);