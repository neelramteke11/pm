-- Insert sample certifications
INSERT INTO certifications (name, issuer, year, credential_id, icon, sort_order) VALUES
  ('Google Analytics Certified', 'Google', '2024', 'GA-2024-001', 'BarChart3', 1),
  ('AWS Cloud Practitioner', 'Amazon Web Services', '2023', 'AWS-CP-2023', 'Database', 2),
  ('Certified Scrum Product Owner', 'Scrum Alliance', '2023', 'CSPO-2023-456', 'Target', 3),
  ('Data Science Professional', 'IBM', '2022', 'IBM-DS-2022', 'Brain', 4),
  ('Product Management Certificate', 'Stanford University', '2022', 'STAN-PM-2022', 'Users', 5),
  ('Advanced SQL Certification', 'Microsoft', '2021', 'MS-SQL-2021', 'Code', 6)
ON CONFLICT DO NOTHING;

-- Insert sample education
INSERT INTO education (degree, field, institution, location, period, gpa, achievements, sort_order) VALUES
  (
    'Master of Business Administration',
    'Product Management & Analytics',
    'Indian Institute of Management',
    'Ahmedabad, India',
    '2016 - 2018',
    '3.8/4.0',
    '["Specialized in Product Management and Data Analytics", "Led student consulting project for Fortune 500 company", "President of Analytics Club with 200+ members", "Published research on AI applications in business strategy"]',
    1
  ),
  (
    'Bachelor of Technology',
    'Computer Science Engineering',
    'National Institute of Technology',
    'Nagpur, India',
    '2012 - 2016',
    '3.7/4.0',
    '["Graduated Magna Cum Laude", "Captain of Programming Club", "Winner of National Level Hackathon 2015", "Internship at Google Summer of Code"]',
    2
  )
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, tech, category, year, metrics, project_url, sort_order) VALUES
  (
    'AI Analytics Platform',
    'Machine learning platform for predictive user behavior analysis with real-time insights',
    '["Python", "TensorFlow", "React", "PostgreSQL"]',
    'AI/ML',
    '2024',
    '40% increase in prediction accuracy',
    'https://github.com/example/ai-analytics',
    1
  ),
  (
    'Customer Intelligence Suite',
    'Advanced segmentation tool with automated insights and personalization engine',
    '["R", "Tableau", "AWS", "SQL"]',
    'Analytics',
    '2023',
    '35% improvement in targeting efficiency',
    'https://github.com/example/customer-intel',
    2
  ),
  (
    'Product Roadmap AI',
    'Intelligent feature prioritization using predictive analytics and market trends',
    '["Vue.js", "Node.js", "MongoDB", "D3.js"]',
    'Product',
    '2023',
    '50% faster roadmap planning',
    'https://github.com/example/roadmap-ai',
    3
  ),
  (
    'Market Insights Engine',
    'Real-time competitive analysis and market trend detection platform',
    '["Python", "Apache Kafka", "Redis", "Docker"]',
    'Analytics',
    '2024',
    'Real-time data processing at scale',
    'https://github.com/example/market-insights',
    4
  )
ON CONFLICT DO NOTHING;

-- Insert additional site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_title', 'Neel Ramteke - Product Manager & Data Analyst', 'Main site title for SEO'),
  ('site_description', 'Transforming complex data into strategic insights. Building AI-powered products that drive business growth.', 'Site description for SEO'),
  ('theme_primary_color', '#006239', 'Primary theme color'),
  ('theme_secondary_color', '#004d2d', 'Secondary theme color'),
  ('analytics_enabled', 'true', 'Enable Google Analytics tracking'),
  ('blog_enabled', 'false', 'Enable blog section'),
  ('testimonials_enabled', 'false', 'Enable testimonials section'),
  ('social_sharing_enabled', 'true', 'Enable social media sharing buttons')
ON CONFLICT (key) DO NOTHING;
