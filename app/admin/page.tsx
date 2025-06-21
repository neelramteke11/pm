import type { Metadata } from "next"
import AdminPageClient from "./page.client"

export const metadata: Metadata = {
  title: "Portfolio Admin Panel",
  description: "Manage your portfolio content",
}

export default function AdminPage() {
  return <AdminPageClient />
}
