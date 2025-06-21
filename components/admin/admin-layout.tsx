"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  User,
  Target,
  Wrench,
  Award,
  Package,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Settings,
  Mail,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
}

const sections = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Target },
  { id: "technologies", label: "Technologies", icon: Wrench },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "products", label: "Products", icon: Package },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "contact", label: "Contact Forms", icon: Mail },
  { id: "settings", label: "Site Settings", icon: Settings },
]

export function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Admin</h1>
            <p className="text-gray-600">Manage your portfolio content</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                View Portfolio
              </a>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onSectionChange(section.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">
                {sections.find((s) => s.id === activeSection)?.label || "Dashboard"}
              </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
