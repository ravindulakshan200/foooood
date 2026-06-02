-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Order fulfillment tracking (separate from payment_status)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending';

-- Mark contact messages as read
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Public menu image storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (authenticated admin uploads, public reads)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read menu images'
  ) THEN
    CREATE POLICY "Public read menu images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'menu-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated upload menu images'
  ) THEN
    CREATE POLICY "Authenticated upload menu images"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated delete menu images'
  ) THEN
    CREATE POLICY "Authenticated delete menu images"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
  END IF;
END $$;
