"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Skill } from "@/lib/types"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

const iconOptions = [
  "Target",
  "BarChart3",
  "Brain",
  "Database",
  "Code",
  "Users",
  "TrendingUp",
  "Zap",
  "Cpu",
  "Globe",
  "Smartphone",
  "Monitor",
  "Server",
  "Cloud",
  "Shield",
  "Lock",
]

const colorOptions = [
  { from: "blue-400", to: "blue-600", label: "Blue" },
  { from: "green-400", to: "green-600", label: "Green" },
  { from: "purple-400", to: "purple-600", label: "Purple" },
  { from: "yellow-400", to: "yellow-600", label: "Yellow" },
  { from: "red-400", to: "red-600", label: "Red" },
  { from: "pink-400", to: "pink-600", label: "Pink" },
  { from: "indigo-400", to: "indigo-600", label: "Indigo" },
  { from: "orange-400", to: "orange-600", label: "Orange" },
]

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/admin/skills")
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!editingSkill?.name || !editingSkill?.level) return

    setLoading(true)
    try {
      const method = editingSkill.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      })

      if (response.ok) {
        await fetchSkills()
        setEditingSkill(null)
        setIsAdding(false)
        toast({
          title: "Success",
          description: `Skill ${editingSkill.id ? "updated" : "created"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      const response = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchSkills()
        toast({
          title: "Success",
          description: "Skill deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills Management</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {(isAdding || editingSkill) && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={editingSkill?.name || ""}
                onChange={(e) => setEditingSkill((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., React, Python, etc."
              />
            </div>

            <div>
              <Label htmlFor="level">Level (0-100)</Label>
              <Input
                id="level"
                type="number"
                min="0"
                max="100"
                value={editingSkill?.level || ""}
                onChange={(e) => setEditingSkill((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={editingSkill?.icon || ""}
                onValueChange={(value) => setEditingSkill((prev) => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Select
                value={editingSkill?.color_from || ""}
                onValueChange={(value) => {
                  const color = colorOptions.find((c) => c.from === value)
                  if (color) {
                    setEditingSkill((prev) => ({
                      ...prev,
                      color_from: color.from,
                      color_to: color.to,
                    }))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.from} value={color.from}>
                      {color.label}
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
                setEditingSkill(null)
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">{skill.name}</h4>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => setEditingSkill(skill)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(skill.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Level: {skill.level}%</p>
            <p className="text-sm text-gray-600">Icon: {skill.icon}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`bg-gradient-to-r from-${skill.color_from} to-${skill.color_to} h-2 rounded-full`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
