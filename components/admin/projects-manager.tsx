"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/types"
import { Plus, Edit, Trash2, Save, X, ExternalLink, Calendar, Tag } from "lucide-react"

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!editingProject?.title || !editingProject?.description) return

    setLoading(true)
    try {
      const method = editingProject.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      })

      if (response.ok) {
        await fetchProjects()
        setEditingProject(null)
        setIsAdding(false)
        toast({
          title: "Success",
          description: `Project ${editingProject.id ? "updated" : "created"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProjects()
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const handleTechChange = (value: string) => {
    const tech = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    setEditingProject((prev) => ({ ...prev, tech }))
  }

  const categories = ["AI/ML", "Analytics", "Product", "Web Development", "Mobile", "Data Science", "DevOps"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects Management</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {(isAdding || editingProject) && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={editingProject?.title || ""}
                onChange={(e) => setEditingProject((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., AI Analytics Platform"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={editingProject?.category || ""}
                onValueChange={(value) => setEditingProject((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={editingProject?.year || ""}
                onChange={(e) => setEditingProject((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="e.g., 2024"
              />
            </div>

            <div>
              <Label htmlFor="metrics">Key Metrics</Label>
              <Input
                id="metrics"
                value={editingProject?.metrics || ""}
                onChange={(e) => setEditingProject((prev) => ({ ...prev, metrics: e.target.value }))}
                placeholder="e.g., 40% increase in accuracy"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={editingProject?.description || ""}
              onChange={(e) => setEditingProject((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project in detail..."
            />
          </div>

          <div>
            <Label htmlFor="tech">Technologies (comma-separated)</Label>
            <Textarea
              id="tech"
              rows={2}
              value={editingProject?.tech?.join(", ") || ""}
              onChange={(e) => handleTechChange(e.target.value)}
              placeholder="Python, TensorFlow, React, PostgreSQL"
            />
          </div>

          <div>
            <Label htmlFor="project_url">Project URL</Label>
            <Input
              id="project_url"
              value={editingProject?.project_url || ""}
              onChange={(e) => setEditingProject((prev) => ({ ...prev, project_url: e.target.value }))}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingProject(null)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    {project.category}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {project.year}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => setEditingProject(project)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{project.description}</p>

            {project.metrics && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {project.metrics}
                </span>
              </div>
            )}

            {project.tech && project.tech.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">Technologies:</h5>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Project
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
