import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"

export async function GET() {
  const supabase = createServerComponentClient()

  try {
    // Get analytics data from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // In a real app, you'd track page views, form submissions, etc.
    // For now, we'll return mock analytics data
    const analyticsData = {
      pageViews: {
        total: 1250,
        thisMonth: 450,
        lastMonth: 380,
        growth: 18.4,
      },
      contactForms: {
        total: 23,
        thisMonth: 8,
        lastMonth: 6,
        growth: 33.3,
      },
      resumeDownloads: {
        total: 89,
        thisMonth: 32,
        lastMonth: 28,
        growth: 14.3,
      },
      topPages: [
        { page: "/", views: 680, percentage: 54.4 },
        { page: "/#about", views: 245, percentage: 19.6 },
        { page: "/#projects", views: 180, percentage: 14.4 },
        { page: "/#contact", views: 145, percentage: 11.6 },
      ],
      recentActivity: [
        { action: "Profile updated", timestamp: new Date().toISOString() },
        { action: "New skill added", timestamp: new Date(Date.now() - 3600000).toISOString() },
        { action: "Product image uploaded", timestamp: new Date(Date.now() - 7200000).toISOString() },
      ],
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
