
CREATE POLICY "Public read hackspirit bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'hackspirit');
CREATE POLICY "Public upload hackspirit bucket" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'hackspirit');
CREATE POLICY "Public update hackspirit bucket" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'hackspirit') WITH CHECK (bucket_id = 'hackspirit');
CREATE POLICY "Public delete hackspirit bucket" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'hackspirit');
