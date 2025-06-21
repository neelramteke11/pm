"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProfileForm } from "@/components/admin/profile-form"
import { SkillsManager } from "@/components/admin/skills-manager"
import { TechnologiesManager } from "@/components/admin/technologies-manager"
import { ProductsManager } from "@/components/admin/products-manager"
import { ExperienceManager } from "@/components/admin/experience-manager"
import { ProjectsManager } from "@/components/admin/projects-manager"
import { CertificationsManager } from "@/components/admin/certifications-manager"
import { EducationManager } from "@/components/admin/education-manager"
import { SiteSettingsManager } from "@/components/admin/site-settings-manager"
import { ContactManager } from "@/components/admin/contact-manager"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import AdminDashboard from "./dashboard/page"
import { AuthGuard } from "@/components/admin/auth-guard"

export default function AdminPageClient() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <AdminDashboard />
            <AnalyticsDashboard />
          </div>
        )
      case "profile":
        return <ProfileForm />
      case "skills":
        return <SkillsManager />
      case "technologies":
        return <TechnologiesManager />
      case "certifications":
        return <CertificationsManager />
      case "products":
        return <ProductsManager />
      case "projects":
        return <ProjectsManager />
      case "experience":
        return <ExperienceManager />
      case "education":
        return <EducationManager />
      case "contact":
        return <ContactManager />
      case "settings":
        return <SiteSettingsManager />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <AuthGuard>
      <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderContent()}
      </AdminLayout>
    </AuthGuard>
  )
}
