"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { SiteSetting } from "@/lib/types"
import { Save, Settings, Globe, Mail, Download, Palette } from "lucide-react"

interface SettingGroup {
  title: string
  icon: React.ComponentType<{ className?: string }>
  settings: SiteSetting[]
}

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/site-settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((setting) => (setting.key === key ? { ...setting, value } : setting)))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = settings.map((setting) =>
        fetch("/api/admin/site-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(setting),
        }),
      )

      await Promise.all(promises)

      toast({
        title: "Success",
        description: "All settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const groupedSettings: SettingGroup[] = [
    {
      title: "General Settings",
      icon: Globe,
      settings: settings.filter(
        (s) => s.key.includes("hero") || s.key.includes("site_title") || s.key.includes("site_description"),
      ),
    },
    {
      title: "Contact Settings",
      icon: Mail,
      settings: settings.filter((s) => s.key.includes("contact")),
    },
    {
      title: "Download Settings",
      icon: Download,
      settings: settings.filter((s) => s.key.includes("resume") || s.key.includes("download")),
    },
    {
      title: "Theme Settings",
      icon: Palette,
      settings: settings.filter((s) => s.key.includes("theme") || s.key.includes("color")),
    },
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Site Settings Management
        </h3>
        <Button onClick={handleSaveAll} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groupedSettings.map((group) => {
          const Icon = group.icon
          return (
            <div key={group.title} className="border rounded-lg p-6 bg-white">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Icon className="w-5 h-5 mr-2 text-blue-600" />
                {group.title}
              </h4>

              <div className="space-y-4">
                {group.settings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key} className="text-sm font-medium">
                      {setting.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                    <p className="text-xs text-gray-500">{setting.description}</p>

                    {setting.key.includes("enabled") ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={setting.key}
                          checked={setting.value === "true"}
                          onCheckedChange={(checked) => handleSettingChange(setting.key, checked ? "true" : "false")}
                        />
                        <Label htmlFor={setting.key} className="text-sm">
                          {setting.value === "true" ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    ) : setting.key.includes("text") || setting.key.includes("bio") ? (
                      <Textarea
                        id={setting.key}
                        value={setting.value || ""}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    ) : (
                      <Input
                        id={setting.key}
                        value={setting.value || ""}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="text-sm"
                      />
                    )}
                  </div>
                ))}

                {group.settings.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No settings available in this category</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Settings Form */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="text-lg font-semibold mb-4">Add New Setting</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="new-key">Setting Key</Label>
            <Input id="new-key" placeholder="e.g., theme_primary_color" />
          </div>
          <div>
            <Label htmlFor="new-value">Value</Label>
            <Input id="new-value" placeholder="Setting value" />
          </div>
          <div>
            <Label htmlFor="new-description">Description</Label>
            <Input id="new-description" placeholder="Brief description" />
          </div>
        </div>
        <Button className="mt-4" variant="outline">
          Add Setting
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Changes are saved to database and will reflect on your live site</li>
          <li>• Use the toggle switches for boolean settings (enabled/disabled)</li>
          <li>• Text areas are for longer content like descriptions</li>
          <li>• Always save changes before navigating away</li>
        </ul>
      </div>
    </div>
  )
}
