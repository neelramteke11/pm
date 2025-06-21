"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Profile } from "@/lib/types"
import { Upload, Save } from "lucide-react"

export function ProfileForm() {
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "avatar_url" | "resume_url") => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("bucket", field === "avatar_url" ? "profile-images" : "general-assets")

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setProfile((prev) => ({ ...prev, [field]: url }))
        toast({
          title: "Success",
          description: "File uploaded successfully",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={profile.name || ""}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={profile.title || ""}
            onChange={(e) => setProfile((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email || ""}
            onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={profile.phone || ""}
            onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profile.location || ""}
            onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            value={profile.linkedin_url || ""}
            onChange={(e) => setProfile((prev) => ({ ...prev, linkedin_url: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            value={profile.github_url || ""}
            onChange={(e) => setProfile((prev) => ({ ...prev, github_url: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={4}
          value={profile.bio || ""}
          onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar Image</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "avatar_url")}
              disabled={uploading}
            />
            <Button type="button" variant="outline" size="sm" disabled={uploading}>
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          {profile.avatar_url && (
            <img
              src={profile.avatar_url || "/placeholder.svg"}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">Resume File</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e, "resume_url")}
              disabled={uploading}
            />
            <Button type="button" variant="outline" size="sm" disabled={uploading}>
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading || uploading}>
        <Save className="w-4 h-4 mr-2" />
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}
