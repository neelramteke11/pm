"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Experience } from "@/lib/types"
import { Plus, Edit, Trash2, Save, X, Building, MapPin, Calendar } from "lucide-react"

export function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/admin/experience")
      if (response.ok) {
        const data = await response.json()
        setExperiences(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!editingExp?.title || !editingExp?.company) return

    setLoading(true)
    try {
      const method = editingExp.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/experience", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExp),
      })

      if (response.ok) {
        await fetchExperiences()
        setEditingExp(null)
        setIsAdding(false)
        toast({
          title: "Success",
          description: `Experience ${editingExp.id ? "updated" : "created"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    try {
      const response = await fetch(`/api/admin/experience?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchExperiences()
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      })
    }
  }

  const handleAchievementsChange = (value: string) => {
    const achievements = value.split("\n").filter(Boolean)
    setEditingExp((prev) => ({ ...prev, achievements }))
  }

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    setEditingExp((prev) => ({ ...prev, skills }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience Management</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {(isAdding || editingExp) && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={editingExp?.title || ""}
                onChange={(e) => setEditingExp((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Senior Product Manager"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={editingExp?.company || ""}
                onChange={(e) => setEditingExp((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., TechCorp Inc."
              />
            </div>

            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                value={editingExp?.period || ""}
                onChange={(e) => setEditingExp((prev) => ({ ...prev, period: e.target.value }))}
                placeholder="e.g., 2022 - Present"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editingExp?.location || ""}
                onChange={(e) => setEditingExp((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Mumbai, India"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={editingExp?.description || ""}
              onChange={(e) => setEditingExp((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your role and responsibilities..."
            />
          </div>

          <div>
            <Label htmlFor="achievements">Achievements (one per line)</Label>
            <Textarea
              id="achievements"
              rows={4}
              value={editingExp?.achievements?.join("\n") || ""}
              onChange={(e) => handleAchievementsChange(e.target.value)}
              placeholder="Launched 3 major AI features resulting in 40% increase in user engagement
Led product strategy that generated $2M+ ARR growth
Implemented data-driven decision framework reducing feature development time by 30%"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              rows={2}
              value={editingExp?.skills?.join(", ") || ""}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="Product Strategy, AI/ML, Team Leadership, Data Analysis"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingExp(null)
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
        {experiences.map((exp) => (
          <div key={exp.id} className="border rounded-lg p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{exp.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {exp.company}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {exp.period}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {exp.location}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => setEditingExp(exp)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(exp.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{exp.description}</p>

            {exp.achievements && exp.achievements.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">Key Achievements:</h5>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {exp.skills && exp.skills.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Skills:</h5>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
