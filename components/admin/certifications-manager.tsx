"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Certification } from "@/lib/types"
import { Plus, Edit, Trash2, Save, X, Award } from "lucide-react"

const iconOptions = [
  "Award",
  "BarChart3",
  "Brain",
  "Database",
  "Code",
  "Users",
  "TrendingUp",
  "Zap",
  "Target",
  "Shield",
  "Globe",
  "Cpu",
]

export function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    try {
      const response = await fetch("/api/admin/certifications")
      if (response.ok) {
        const data = await response.json()
        setCertifications(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch certifications",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!editingCert?.name || !editingCert?.issuer) return

    setLoading(true)
    try {
      const method = editingCert.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/certifications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCert),
      })

      if (response.ok) {
        await fetchCertifications()
        setEditingCert(null)
        setIsAdding(false)
        toast({
          title: "Success",
          description: `Certification ${editingCert.id ? "updated" : "created"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save certification",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return

    try {
      const response = await fetch(`/api/admin/certifications?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCertifications()
        toast({
          title: "Success",
          description: "Certification deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Certifications Management</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {(isAdding || editingCert) && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Certification Name</Label>
              <Input
                id="name"
                value={editingCert?.name || ""}
                onChange={(e) => setEditingCert((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Google Analytics Certified"
              />
            </div>

            <div>
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                value={editingCert?.issuer || ""}
                onChange={(e) => setEditingCert((prev) => ({ ...prev, issuer: e.target.value }))}
                placeholder="e.g., Google"
              />
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={editingCert?.year || ""}
                onChange={(e) => setEditingCert((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="e.g., 2024"
              />
            </div>

            <div>
              <Label htmlFor="credential_id">Credential ID</Label>
              <Input
                id="credential_id"
                value={editingCert?.credential_id || ""}
                onChange={(e) => setEditingCert((prev) => ({ ...prev, credential_id: e.target.value }))}
                placeholder="e.g., GA-2024-001"
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={editingCert?.icon || ""}
                onValueChange={(value) => setEditingCert((prev) => ({ ...prev, icon: value }))}
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
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingCert(null)
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="border rounded-lg p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {cert.year}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => setEditingCert(cert)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(cert.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">{cert.name}</h4>
            <p className="text-gray-600 text-sm mb-3">{cert.issuer}</p>

            {cert.credential_id && <p className="text-gray-500 text-xs mb-3">ID: {cert.credential_id}</p>}

            <div className="text-xs text-gray-400">Icon: {cert.icon}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
