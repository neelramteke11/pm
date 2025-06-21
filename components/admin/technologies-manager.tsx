"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Technology } from "@/lib/types"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

const colorOptions = [
  { bg: "bg-yellow-500", text: "text-black", label: "Yellow/Black" },
  { bg: "bg-orange-500", text: "text-white", label: "Orange/White" },
  { bg: "bg-blue-600", text: "text-white", label: "Blue/White" },
  { bg: "bg-purple-500", text: "text-white", label: "Purple/White" },
  { bg: "bg-blue-700", text: "text-white", label: "Dark Blue/White" },
  { bg: "bg-green-600", text: "text-white", label: "Green/White" },
  { bg: "bg-gray-800", text: "text-white", label: "Gray/White" },
  { bg: "bg-red-500", text: "text-white", label: "Red/White" },
  { bg: "bg-pink-600", text: "text-white", label: "Pink/White" },
  { bg: "bg-indigo-600", text: "text-white", label: "Indigo/White" },
]

export function TechnologiesManager() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [editingTech, setEditingTech] = useState<Partial<Technology> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTechnologies()
  }, [])

  const fetchTechnologies = async () => {
    try {
      const response = await fetch("/api/admin/technologies")
      if (response.ok) {
        const data = await response.json()
        setTechnologies(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch technologies",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!editingTech?.name) return

    setLoading(true)
    try {
      const method = editingTech.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/technologies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTech),
      })

      if (response.ok) {
        await fetchTechnologies()
        setEditingTech(null)
        setIsAdding(false)
        toast({
          title: "Success",
          description: `Technology ${editingTech.id ? "updated" : "created"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save technology",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this technology?")) return

    try {
      const response = await fetch(`/api/admin/technologies?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTechnologies()
        toast({
          title: "Success",
          description: "Technology deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete technology",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Technologies Management</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Technology
        </Button>
      </div>

      {(isAdding || editingTech) && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Technology Name</Label>
              <Input
                id="name"
                value={editingTech?.name || ""}
                onChange={(e) => setEditingTech((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., React, Node.js, etc."
              />
            </div>

            <div>
              <Label htmlFor="color">Color Scheme</Label>
              <Select
                value={editingTech?.bg_color || ""}
                onValueChange={(value) => {
                  const color = colorOptions.find((c) => c.bg === value)
                  if (color) {
                    setEditingTech((prev) => ({
                      ...prev,
                      bg_color: color.bg,
                      text_color: color.text,
                    }))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color scheme" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.bg} value={color.bg}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${color.bg}`} />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditingTech(null)
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {technologies.map((tech) => (
          <div key={tech.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className={`px-3 py-1 rounded-full ${tech.bg_color} ${tech.text_color} text-sm font-semibold`}>
                {tech.name}
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => setEditingTech(tech)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(tech.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">Order: {tech.sort_order}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
