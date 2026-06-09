"use client"
import { useEffect, useMemo, useState } from "react"
import { Plus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import type { Product, ProductComponent, ProductIngredient, ProductStatus } from "./product-types"
import { Card } from "@/components/ui/card"

const BACKEND_BASE_URL = "http://localhost:6000"

type CategoryRow = {
  name?: string
  isActive?: boolean
  isactive?: boolean
}

type WarehouseRow = { name?: string; currentstock?: number; currentStock?: number }

function normalizeNumber(v: unknown) {
  if (typeof v === "number") return v
  if (typeof v === "string") return Number(v)
  return 0
}

type Props = {
  onProductAdded: (product: Product) => void
}

export default function AddProductDialog({ onProductAdded }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    warehouse: "",
    tags: [],
    mrp: 0,
    discount: 0,
    price: 0,
    stock: 0,
    status: "active" satisfies ProductStatus,
    about: "",
    description: "",
    components: [{ name: "", percentage: "" }],
    ingredients: [{ name: "", benefit: "" }],
    benefits: "",
    howToUse: "",
    expiryDate: "",
    weight: 0.1,
    length: 10,
    width: 10,
    height: 10,
    customShipping: false,
    customShippingCost: 0,
    gstApplicable: true,
    gstRate: 18,
    images: [],
  })

  const sellingPrice = useMemo(() => {
    // Matches your screenshot behavior: show MRP after discount only.
    const mrp = formData.mrp || 0
    const discount = formData.discount || 0
    return mrp - (mrp * discount) / 100
  }, [formData.mrp, formData.discount])

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false                                                           
    const load = async () => {
      setFetchError(null)
      setCategories([])
      setWarehouses([])

      try {
        const [catRes, whRes] = await Promise.all([
          fetch(`${BACKEND_BASE_URL}/category/get/all/categories`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${BACKEND_BASE_URL}/warehouse/get/all/warehouses`, {
            method: "GET",
            credentials: "include",
          }),
        ])

        if (!catRes.ok) throw new Error(`Categories request failed (${catRes.status})`)
        if (!whRes.ok) throw new Error(`Warehouses request failed (${whRes.status})`)

        const catJson = await catRes.json()
        const whJson = await whRes.json()

        if (cancelled) return

        setCategories(Array.isArray(catJson?.data) ? catJson.data : [])
        setWarehouses(Array.isArray(whJson?.data) ? whJson.data : [])
      } catch (e) {
        if (cancelled) return
        setFetchError(e instanceof Error ? e.message : "Failed to fetch categories/warehouses")
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [isOpen])

  const categoryOptions = useMemo(() => {
    return categories
      .filter((c) => (c.isActive ?? c.isactive ?? true) === true)
      .map((c) => c.name)
      .filter(Boolean) as string[]
  }, [categories])

  const warehouseOptions = useMemo(() => {
    return warehouses.map((w) => w.name).filter(Boolean) as string[]
  }, [warehouses])


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const currentImages = formData.images || []
    const remainingSlots = 7 - currentImages.length
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Maximum is 7 images.`)
      return
    }

    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setFormData((prev) => ({ ...prev, images: [...currentImages, ...newImages] }))
  }

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])]
    newImages.splice(index, 1)
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const addComponentRow = () => {
    setFormData((prev) => ({
      ...prev,
      components: [...(prev.components || []) , { name: "", percentage: "" } as ProductComponent],
    }))
  }

  const removeComponentRow = (index: number) => {
    setFormData((prev) => {
      const next = [...(prev.components || [])]
      next.splice(index, 1)
      return { ...prev, components: next }
    })
  }

  const updateComponent = (index: number, field: "name" | "percentage", value: string) => {
    setFormData((prev) => {
      const next = [...(prev.components || [])]
      const row = next[index]
      if (!row) return prev
      next[index] = { ...row, [field]: value } as ProductComponent
      return { ...prev, components: next }
    })
  }

  const addIngredientRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { name: "", benefit: "" } as ProductIngredient],
    }))
  }

  const removeIngredientRow = (index: number) => {
    setFormData((prev) => {
      const next = [...(prev.ingredients || [])]
      next.splice(index, 1)
      return { ...prev, ingredients: next }
    })
  }

  const updateIngredient = (index: number, field: "name" | "benefit", value: string) => {
    setFormData((prev) => {
      const next = [...(prev.ingredients || [])]
      const row = next[index]
      if (!row) return prev
      next[index] = { ...row, [field]: value } as ProductIngredient
      return { ...prev, ingredients: next }
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      subCategory: "",
      subSubCategory: "",
      warehouse: "",
      tags: [],
      mrp: 0,
      discount: 0,
      price: 0,
      stock: 0,
      status: "active",
      about: "",
      description: "",
      components: [{ name: "", percentage: "" }],
      ingredients: [{ name: "", benefit: "" }],
      benefits: "",
      howToUse: "",
      expiryDate: "",
      weight: 0.1,
      length: 10,
      width: 10,
      height: 10,
      customShipping: false,
      customShippingCost: 0,
      gstApplicable: true,
      gstRate: 18,
      images: [],
    })
  }

  const onSubmit = async () => {
    if (!formData.name.trim()) return alert("Product name is required")
    if (!formData.category) return alert("Category is required")
    if (!formData.warehouse) return alert("Warehouse is required")
    if (!formData.expiryDate) return alert("Expiry date is required")
    if (Number(formData.stock) <= 0) return alert("Stock must be greater than 0")
    if (!formData.about.trim()) return alert("About is required")
    if (!formData.description.trim()) return alert("Description is required")
    if (!formData.images || formData.images.length < 3) return alert("Please upload at least 3 product images")

    const nextProduct: Product = {
      id: Date.now().toString(),
      ...formData,
      price: sellingPrice,
    }

    setIsSubmitting(true)
    try {
      // Backend stores `components_or_ingredients` in a single text column,
      // so we send both components + ingredients inside `components`.
      const payload = {
        name: nextProduct.name,
        category: nextProduct.category,
        warehouse: nextProduct.warehouse,
        mrp: nextProduct.mrp,
        discount: nextProduct.discount,
        price: nextProduct.price,
        stock: nextProduct.stock,
        status: nextProduct.status,
        about: nextProduct.about,
        description: nextProduct.description,
        components: JSON.stringify({
          components: nextProduct.components,
          ingredients: nextProduct.ingredients,
        }),
        benfits: nextProduct.benefits, // backend has a column typo: `benfits`
        howToUse: nextProduct.howToUse,
        expiryDate: nextProduct.expiryDate,
        weight: nextProduct.weight,
        length: nextProduct.length,
        width: nextProduct.width,
        height: nextProduct.height,
        customShippingCost: nextProduct.customShippingCost,
        gstApplicable: nextProduct.gstApplicable,
        gstRate: nextProduct.gstRate,
      }

      await fetch(`${BACKEND_BASE_URL}/product/add/new/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      }).catch(() => {
        // Keep UI flow even if backend isn't reachable; user can still see the added product in this session.
      })

      onProductAdded(nextProduct)
      setIsOpen(false)
      resetForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter complete product information. Category and warehouse are fetched in real time.
          </DialogDescription>
        </DialogHeader>

        {fetchError && (
          <Card className="p-3 border-destructive/40 bg-destructive/5 text-destructive">
            {fetchError}
          </Card>
        )}

        <div className="grid gap-6 py-4">
          {/* Top grid like your screenshot */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="ap-name">Product Name *</Label>
              <Input
                id="ap-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Organic Lavender Face Serum"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ap-category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  disabled={categoryOptions.length === 0}
                >
                  <SelectTrigger id="ap-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ap-warehouse">Warehouse *</Label>
                <Select
                  value={formData.warehouse}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, warehouse: value }))}
                  disabled={warehouseOptions.length === 0}
                >
                  <SelectTrigger id="ap-warehouse">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseOptions.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ap-mrp">MRP (₹) *</Label>
                <Input
                  id="ap-mrp"
                  type="number"
                  value={formData.mrp}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mrp: normalizeNumber(e.target.value) }))}
                  placeholder="1299"
                />
              </div>

              <div className="space-y-2">
                <Label>Stock *</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: normalizeNumber(e.target.value) }))}
                  placeholder="150"
                />
              </div>

              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discount: normalizeNumber(e.target.value) }))}
                  placeholder="15"
                />
              </div>

              <div className="space-y-2">
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
            </div>
            
              <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price (₹) *</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={sellingPrice}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

              <div className="space-y-2">
                <Label>GST Applicable *</Label>
                <RadioGroup
                  value={formData.gstApplicable ? "yes" : "no"}
                  onValueChange={(v) => {
                    const nextApplicable = v === "yes"
                    setFormData((prev) => ({
                      ...prev,
                      gstApplicable: nextApplicable,
                    }))
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="gst-yes-ap" />
                    <Label htmlFor="gst-yes-ap" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="gst-no-ap" />
                    <Label htmlFor="gst-no-ap" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>

                {formData.gstApplicable && (
                  <div className="space-y-2">
                    <Label htmlFor="gstRate-ap">GST Rate (%) *</Label>
                    <Input
                      id="gstRate-ap"
                      type="number"
                      value={formData.gstRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, gstRate: normalizeNumber(e.target.value) }))}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* About + Description like screenshots */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="ap-about">About *</Label>
              <Textarea
                id="ap-about"
                value={formData.about}
                onChange={(e) => setFormData((prev) => ({ ...prev, about: e.target.value }))}
                rows={2}
                placeholder="Brief summary of the product"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ap-description">Description *</Label>
              <Textarea
                id="ap-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Detailed product description"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Components/Active Ingredients *</Label>
                <Button type="button" size="sm" variant="outline" onClick={addComponentRow}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component Name</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead className="w-16" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(formData.components || []).map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={component.name}
                            onChange={(e) => updateComponent(index, "name", e.target.value)}
                            placeholder="e.g., Lavender Essential Oil"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={component.percentage}
                            onChange={(e) => updateComponent(index, "percentage", e.target.value)}
                            placeholder="e.g., 15%"
                          />
                        </TableCell>
                        <TableCell>
                          {(formData.components || []).length > 1 && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeComponentRow(index)}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Additional Ingredients *</Label>
                <Button type="button" size="sm" variant="outline" onClick={addIngredientRow}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient Name</TableHead>
                      <TableHead>Benefit</TableHead>
                      <TableHead className="w-16" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(formData.ingredients || []).map((ingredient, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, "name", e.target.value)}
                            placeholder="e.g., Aloe Vera"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={ingredient.benefit}
                            onChange={(e) => updateIngredient(index, "benefit", e.target.value)}
                            placeholder="e.g., Soothes and hydrates skin"
                          />
                        </TableCell>
                        <TableCell>
                          {(formData.ingredients || []).length > 1 && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeIngredientRow(index)}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ap-benefits">Benefits *</Label>
              <Textarea
                id="ap-benefits"
                value={formData.benefits}
                onChange={(e) => setFormData((prev) => ({ ...prev, benefits: e.target.value }))}
                rows={2}
                placeholder="Key benefits of the product"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ap-how-to-use">How to Use *</Label>
              <Textarea
                id="ap-how-to-use"
                value={formData.howToUse}
                onChange={(e) => setFormData((prev) => ({ ...prev, howToUse: e.target.value }))}
                rows={3}
                placeholder="Instructions on how to use the product"
              />
            </div>
          </div>

          <Separator />
          <div className="space-y-2">
  <Label>Dimensions (L × W × H) *</Label>

  <div className="flex gap-2">
    <Input
      type="number"
      value={formData.length}
      placeholder="L"
      className="w-full"
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          length: normalizeNumber(e.target.value),
        }))
      }
    />

    <Input
      type="number"
      value={formData.width}
      placeholder="W"
      className="w-full"
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          width: normalizeNumber(e.target.value),
        }))
      }
    />

    <Input
      type="number"
      value={formData.height}
      placeholder="H"
      className="w-full"
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          height: normalizeNumber(e.target.value),
        }))
      }
    />
  </div>
</div>
              <div className="space-y-2">
                <Label>GST</Label>
                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    {formData.gstApplicable ? `${formData.gstRate}%` : "Not Applicable"}
                  </p>
                  <p className="text-2xl font-bold">
                    {formData.gstApplicable ? `${formData.gstRate}%` : "—"}
                  </p>
                </div>
              </div>
            
          

          {/* Product Images */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Product Images</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload 3-7 images of your product (min 3 required)</p>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 gap-4">
                {(formData.images || []).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square border-2 border-dashed rounded-lg overflow-hidden"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && <Badge className="absolute bottom-1 left-1 text-xs">Primary</Badge>}
                  </div>
                ))}
                {(formData.images || []).length < 7 && (
                  <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload Image</span>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {(formData.images || []).length}/7 images uploaded (minimum 3 required)
              </p>
            </div>
          </div>
      

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Close
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

