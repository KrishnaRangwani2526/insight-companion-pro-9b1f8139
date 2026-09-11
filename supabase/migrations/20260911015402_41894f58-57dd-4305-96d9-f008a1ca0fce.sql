DROP POLICY IF EXISTS "Users can manage their own app snapshot" ON public.app_snapshots;
CREATE POLICY "Signed-in users can manage their own app snapshot"
  ON public.app_snapshots
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);