"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { Plus, Edit, Trash2, Save, X, Upload, ExternalLink } from "lucide-react"

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!editingProduct?.title || !editingProduct?.description) return

    setLoading(true)
    try {
      const method = editingProduct.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      })

      if (response.ok) {
        await fetchProducts()
        setEditingProduct(null)
        setIsAdding(false)
        toast({
          title: "Success",
          description: `Product ${editingProduct.id ? "updated" : "created"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProducts()
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("bucket", "product-images")

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setEditingProduct((prev) => ({ ...prev, image_url: url }))
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFeaturesChange = (value: string) => {
    const features = value
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean)
    setEditingProduct((prev) => ({ ...prev, features }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Products Management</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {(isAdding || editingProduct) && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={editingProduct?.title || ""}
                onChange={(e) => setEditingProduct((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., DataInsight Pro"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editingProduct?.category || ""}
                onChange={(e) => setEditingProduct((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., SaaS Platform"
              />
            </div>

            <div>
              <Label htmlFor="users">Users</Label>
              <Input
                id="users"
                value={editingProduct?.users || ""}
                onChange={(e) => setEditingProduct((prev) => ({ ...prev, users: e.target.value }))}
                placeholder="e.g., 10K+ Users"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={editingProduct?.status || "Live"}
                onValueChange={(value) => setEditingProduct((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Beta">Beta</SelectItem>
                  <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={editingProduct?.description || ""}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea
              id="features"
              rows={2}
              value={editingProduct?.features?.join(", ") || ""}
              onChange={(e) => handleFeaturesChange(e.target.value)}
              placeholder="Real-time Analytics, AI Predictions, Custom Dashboards"
            />
          </div>

          <div>
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input
              id="demo_url"
              value={editingProduct?.demo_url || ""}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev, demo_url: e.target.value }))}
              placeholder="https://demo.example.com"
            />
          </div>

          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center space-x-2">
              <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              <Button type="button" variant="outline" size="sm" disabled={uploading}>
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            {editingProduct?.image_url && (
              <img
                src={editingProduct.image_url || "/placeholder.svg"}
                alt="Product"
                className="w-32 h-24 rounded object-cover mt-2"
              />
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingProduct(null)
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
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{product.title}</h4>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    product.status === "Live" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {product.image_url && (
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}

            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
            {product.users && <p className="text-sm text-gray-500 mb-2">Users: {product.users}</p>}

            {product.features && product.features.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{product.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {product.demo_url && (
              <a
                href={product.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Demo
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
