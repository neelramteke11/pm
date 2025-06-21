-- Insert initial profile data
INSERT INTO profile (name, title, bio, email, phone, location, linkedin_url, github_url) VALUES (
  'Neel Ramteke',
  'Product Manager & Data Analyst',
  'Transforming complex data into strategic insights. Building AI-powered products that drive business growth and create exceptional user experiences.',
  'neel.ramteke@email.com',
  '+91 98765 43210',
  'Mumbai, India',
  'https://linkedin.com/in/neelramteke',
  'https://github.com/neelramteke'
) ON CONFLICT DO NOTHING;

-- Insert initial skills
INSERT INTO skills (name, level, icon, color_from, color_to, sort_order) VALUES
  ('Product Strategy', 95, 'Target', 'blue-400', 'blue-600', 1),
  ('Data Analysis', 90, 'BarChart3', 'green-400', 'green-600', 2),
  ('AI/ML', 85, 'Brain', 'purple-400', 'purple-600', 3),
  ('SQL', 88, 'Database', 'yellow-400', 'yellow-600', 4),
  ('Python', 80, 'Code', 'red-400', 'red-600', 5),
  ('User Research', 92, 'Users', 'pink-400', 'pink-600', 6),
  ('Market Analysis', 87, 'TrendingUp', 'indigo-400', 'indigo-600', 7),
  ('Agile/Scrum', 90, 'Zap', 'orange-400', 'orange-600', 8)
ON CONFLICT DO NOTHING;

-- Insert initial technologies
INSERT INTO technologies (name, bg_color, text_color, sort_order) VALUES
  ('Power BI', 'bg-yellow-500', 'text-black', 1),
  ('Google Analytics', 'bg-orange-500', 'text-white', 2),
  ('Tableau', 'bg-blue-600', 'text-white', 3),
  ('Figma', 'bg-purple-500', 'text-white', 4),
  ('Jira', 'bg-blue-700', 'text-white', 5),
  ('Python', 'bg-green-600', 'text-white', 6),
  ('SQL', 'bg-blue-800', 'text-white', 7),
  ('AWS', 'bg-orange-500', 'text-black', 8)
ON CONFLICT DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('hero_scramble_text', 'Neel Ramteke', 'Text that appears with scramble effect in hero section'),
  ('hero_subtitle', 'Product Manager & Data Analyst', 'Subtitle in hero section'),
  ('contact_form_enabled', 'true', 'Enable/disable contact form'),
  ('resume_download_enabled', 'true', 'Enable/disable resume download button')
ON CONFLICT (key) DO NOTHING;
