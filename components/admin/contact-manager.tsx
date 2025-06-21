"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Trash2, CheckCircle, User, Calendar } from "lucide-react"

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "read" | "replied"
  submitted_at: string
}

export function ContactManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/contact-submissions")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/contact-submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        await fetchSubmissions()
        toast({
          title: "Success",
          description: "Status updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return

    try {
      const response = await fetch(`/api/admin/contact-submissions?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchSubmissions()
        toast({
          title: "Success",
          description: "Submission deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Contact Submissions ({submissions.length})
        </h3>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {submissions.filter((s) => s.status === "new").length} New
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {submissions.filter((s) => s.status === "read").length} Read
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {submissions.filter((s) => s.status === "replied").length} Replied
          </Badge>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact submissions yet</h3>
            <p className="text-gray-500">When visitors submit the contact form, they'll appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className={submission.status === "new" ? "border-blue-200 bg-blue-50/30" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{submission.subject}</CardTitle>
                      <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {submission.name}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {submission.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {submission.status === "new" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(submission.id, "read")}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    {submission.status === "read" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(submission.id, "replied")}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Replied
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => deleteSubmission(submission.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" asChild>
                    <a href={`mailto:${submission.email}?subject=Re: ${submission.subject}`}>Reply via Email</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
