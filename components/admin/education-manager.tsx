"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Education } from "@/lib/types"
import { Plus, Edit, Trash2, Save, X, GraduationCap, MapPin, Calendar } from "lucide-react"

export function EducationManager() {
  const [education, setEducation] = useState<Education[]>([])
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/admin/education")
      if (response.ok) {
        const data = await response.json()
        setEducation(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch education",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!editingEdu?.degree || !editingEdu?.institution) return

    setLoading(true)
    try {
      const method = editingEdu.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/education", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEdu),
      })

      if (response.ok) {
        await fetchEducation()
        setEditingEdu(null)
        setIsAdding(false)
        toast({
          title: "Success",
          description: `Education ${editingEdu.id ? "updated" : "created"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save education",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return

    try {
      const response = await fetch(`/api/admin/education?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchEducation()
        toast({
          title: "Success",
          description: "Education deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete education",
        variant: "destructive",
      })
    }
  }

  const handleAchievementsChange = (value: string) => {
    const achievements = value.split("\n").filter(Boolean)
    setEditingEdu((prev) => ({ ...prev, achievements }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education Management</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {(isAdding || editingEdu) && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={editingEdu?.degree || ""}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev, degree: e.target.value }))}
                placeholder="e.g., Master of Business Administration"
              />
            </div>

            <div>
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                value={editingEdu?.field || ""}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev, field: e.target.value }))}
                placeholder="e.g., Product Management & Analytics"
              />
            </div>

            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={editingEdu?.institution || ""}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev, institution: e.target.value }))}
                placeholder="e.g., Indian Institute of Management"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editingEdu?.location || ""}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Ahmedabad, India"
              />
            </div>

            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                value={editingEdu?.period || ""}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev, period: e.target.value }))}
                placeholder="e.g., 2016 - 2018"
              />
            </div>

            <div>
              <Label htmlFor="gpa">GPA (optional)</Label>
              <Input
                id="gpa"
                value={editingEdu?.gpa || ""}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev, gpa: e.target.value }))}
                placeholder="e.g., 3.8/4.0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="achievements">Achievements & Activities (one per line)</Label>
            <Textarea
              id="achievements"
              rows={4}
              value={editingEdu?.achievements?.join("\n") || ""}
              onChange={(e) => handleAchievementsChange(e.target.value)}
              placeholder="Specialized in Product Management and Data Analytics
Led student consulting project for Fortune 500 company
President of Analytics Club with 200+ members"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingEdu(null)
                setIsAdding(false)
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="border rounded-lg p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-green-600 font-medium mb-2">{edu.field}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    {edu.institution}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {edu.period}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {edu.location}
                  </div>
                </div>
                {edu.gpa && <div className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</div>}
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => setEditingEdu(edu)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(edu.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {edu.achievements && edu.achievements.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Achievements & Activities:</h5>
                <ul className="space-y-1">
                  {edu.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-700 flex items-start text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
