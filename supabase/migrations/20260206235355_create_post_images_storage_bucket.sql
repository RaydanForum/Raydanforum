/*
  # Create post-images storage bucket

  1. Storage
    - Creates `post-images` public bucket for additional post images
    - Allows public read access
    - Allows authenticated admin uploads and deletes
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view post images storage' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Anyone can view post images storage"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'post-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can upload post images storage' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admins can upload post images storage"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'post-images'
        AND EXISTS (
          SELECT 1 FROM admins
          WHERE admins.id = auth.uid() AND admins.is_active = true
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete post images storage' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admins can delete post images storage"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'post-images'
        AND EXISTS (
          SELECT 1 FROM admins
          WHERE admins.id = auth.uid() AND admins.is_active = true
        )
      );
  END IF;
END $$;
