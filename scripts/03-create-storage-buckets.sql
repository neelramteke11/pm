-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-images', 'profile-images', true),
  ('product-images', 'product-images', true),
  ('project-images', 'project-images', true),
  ('general-assets', 'general-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Allow public read access on profile-images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Allow authenticated upload on profile-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images');
CREATE POLICY "Allow authenticated update on profile-images" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-images');
CREATE POLICY "Allow authenticated delete on profile-images" ON storage.objects FOR DELETE USING (bucket_id = 'profile-images');

CREATE POLICY "Allow public read access on product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow authenticated upload on product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Allow authenticated update on product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Allow authenticated delete on product-images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

CREATE POLICY "Allow public read access on project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Allow authenticated upload on project-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Allow authenticated update on project-images" ON storage.objects FOR UPDATE USING (bucket_id = 'project-images');
CREATE POLICY "Allow authenticated delete on project-images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images');

CREATE POLICY "Allow public read access on general-assets" ON storage.objects FOR SELECT USING (bucket_id = 'general-assets');
CREATE POLICY "Allow authenticated upload on general-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'general-assets');
CREATE POLICY "Allow authenticated update on general-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'general-assets');
CREATE POLICY "Allow authenticated delete on general-assets" ON storage.objects FOR DELETE USING (bucket_id = 'general-assets');
