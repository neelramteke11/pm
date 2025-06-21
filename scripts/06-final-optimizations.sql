-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_updated_at ON profile(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_level ON skills(level DESC);
CREATE INDEX IF NOT EXISTS idx_technologies_sort_order ON technologies(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(year DESC);
CREATE INDEX IF NOT EXISTS idx_experience_sort_order ON experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_education_sort_order ON education(sort_order);
CREATE INDEX IF NOT EXISTS idx_certifications_year ON certifications(year DESC);

-- Add full-text search capabilities
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_experience_search ON experience USING gin(to_tsvector('english', title || ' ' || company || ' ' || description));

-- Update functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_profile_updated_at ON profile;
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_technologies_updated_at ON technologies;
CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON technologies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_experience_updated_at ON experience;
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_updated_at ON education;
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certifications_updated_at ON certifications;
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add some sample contact submissions for testing
INSERT INTO contact_submissions (name, email, subject, message, status) VALUES
  ('John Doe', 'john@example.com', 'Collaboration Opportunity', 'Hi Neel, I would like to discuss a potential collaboration on an AI project.', 'new'),
  ('Sarah Smith', 'sarah@company.com', 'Job Opportunity', 'We have an exciting Product Manager position that might interest you.', 'read'),
  ('Mike Johnson', 'mike@startup.com', 'Consulting Request', 'Would you be available for a data analytics consulting project?', 'replied')
ON CONFLICT DO NOTHING;

-- Optimize table statistics
ANALYZE profile;
ANALYZE skills;
ANALYZE technologies;
ANALYZE certifications;
ANALYZE products;
ANALYZE projects;
ANALYZE experience;
ANALYZE education;
ANALYZE contact_submissions;
ANALYZE site_settings;
