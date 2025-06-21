"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Mail, Download, Activity } from "lucide-react"

interface AnalyticsData {
  pageViews: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  contactForms: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  resumeDownloads: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  topPages: Array<{
    page: string
    views: number
    percentage: number
  }>
  recentActivity: Array<{
    action: string
    timestamp: string
  }>
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  const metrics = [
    {
      title: "Page Views",
      value: analytics.pageViews.total,
      thisMonth: analytics.pageViews.thisMonth,
      growth: analytics.pageViews.growth,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Contact Forms",
      value: analytics.contactForms.total,
      thisMonth: analytics.contactForms.thisMonth,
      growth: analytics.contactForms.growth,
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Resume Downloads",
      value: analytics.resumeDownloads.total,
      thisMonth: analytics.resumeDownloads.thisMonth,
      growth: analytics.resumeDownloads.growth,
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const isPositiveGrowth = metric.growth > 0

          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <div className={`p-2 rounded-full ${metric.bgColor}`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center space-x-1">
                    {isPositiveGrowth ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${isPositiveGrowth ? "text-green-600" : "text-red-600"}`}>
                      {Math.abs(metric.growth)}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{metric.thisMonth} this month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Top Pages</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{page.page}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{page.views}</span>
                  <Badge variant="secondary" className="text-xs">
                    {page.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
