CREATE TABLE public.app_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  client_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT app_snapshots_user_id_key UNIQUE (user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_snapshots TO authenticated;
GRANT ALL ON public.app_snapshots TO service_role;
ALTER TABLE public.app_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own app snapshot"
  ON public.app_snapshots
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.update_app_snapshots_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER app_snapshots_updated_at
  BEFORE UPDATE ON public.app_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_app_snapshots_updated_at();