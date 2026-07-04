
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  team_size INT NOT NULL,
  total_fee INT NOT NULL,
  members JSONB NOT NULL,
  payment_screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO anon, authenticated;
GRANT ALL ON public.registrations TO service_role;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert registrations" ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read registrations" ON public.registrations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update registrations" ON public.registrations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete registrations" ON public.registrations FOR DELETE TO anon, authenticated USING (true);

-- Single-row event settings (problem statement URL, gallery, etc.)
CREATE TABLE public.event_settings (
  id INT PRIMARY KEY DEFAULT 1,
  problem_statement_url TEXT,
  problem_statement_uploaded_at TIMESTAMPTZ,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  CONSTRAINT singleton CHECK (id = 1)
);
INSERT INTO public.event_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

GRANT SELECT, INSERT, UPDATE ON public.event_settings TO anon, authenticated;
GRANT ALL ON public.event_settings TO service_role;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read settings" ON public.event_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone update settings" ON public.event_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone insert settings" ON public.event_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
