"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@/lib/supabase"
import { Target, Package, Briefcase, TrendingUp, Database, Activity, Calendar } from "lucide-react"

interface DashboardStats {
  skills: number
  technologies: number
  products: number
  experiences: number
  lastUpdated: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    skills: 0,
    technologies: 0,
    products: 0,
    experiences: 0,
    lastUpdated: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [skillsRes, techRes, productsRes, experienceRes] = await Promise.all([
        supabase.from("skills").select("id", { count: "exact" }),
        supabase.from("technologies").select("id", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("experience").select("id", { count: "exact" }),
      ])

      setStats({
        skills: skillsRes.count || 0,
        technologies: techRes.count || 0,
        products: productsRes.count || 0,
        experiences: experienceRes.count || 0,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Skills",
      value: stats.skills,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Technologies",
      value: stats.technologies,
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Experience",
      value: stats.experiences,
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your portfolio content</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">Total {stat.title.toLowerCase()} in portfolio</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Add New Skill</span>
              <Badge variant="secondary">Skills</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Upload Product Image</span>
              <Badge variant="secondary">Products</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Update Profile</span>
              <Badge variant="secondary">Profile</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Portfolio Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profile Completion</span>
              <Badge className="bg-green-100 text-green-800">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Content Status</span>
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <Badge variant="outline">Today</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
