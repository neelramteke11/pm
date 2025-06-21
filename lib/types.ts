export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url?: string
  resume_url?: string
  email?: string
  phone?: string
  location?: string
  linkedin_url?: string
  github_url?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  level: number
  icon: string
  color_from: string
  color_to: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Technology {
  id: string
  name: string
  bg_color: string
  text_color: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  year: string
  credential_id?: string
  icon: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  category: string
  users?: string
  image_url?: string
  features: string[]
  status: string
  demo_url?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  category: string
  year: string
  metrics?: string
  project_url?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  location: string
  description: string
  achievements: string[]
  skills: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  degree: string
  field: string
  institution: string
  location: string
  period: string
  gpa?: string
  achievements: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value?: string
  description?: string
  created_at: string
  updated_at: string
}
