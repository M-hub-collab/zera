"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye, Package, AlertCircle, Upload, X } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import AddProductDialog from "./add-product-dialog"
import type { Product } from "./product-types"

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Lavender Face Serum",
    category: "Skincare",
    subCategory: "Face Care",
    subSubCategory: "Anti-Aging Serums",
    warehouse: "Mumbai Central",
    tags: ["organic", "lavender", "serum", "anti-aging"],
    mrp: 1299,
    discount: 15,
    price: 1104.15,
    stock: 150,
    status: "active",
    about: "A luxurious organic face serum infused with pure lavender essential oil",
    description: "Transform your skincare routine with our premium Organic Lavender Face Serum...",
    components: [
      { name: "Lavender Essential Oil", percentage: "15%" },
      { name: "Hyaluronic Acid", percentage: "10%" },
      { name: "Vitamin E", percentage: "5%" },
    ],
    ingredients: [
      { name: "Aloe Vera", benefit: "Soothes and hydrates skin" },
      { name: "Rosehip Oil", benefit: "Reduces fine lines" },
      { name: "Green Tea Extract", benefit: "Antioxidant protection" },
    ],
    benefits: "Deeply moisturizes, reduces fine lines, calms irritated skin",
    howToUse: "Apply 2-3 drops on clean face and neck. Gently massage in upward motions.",
    expiryDate: "2026-12-31",
    weight: 0.5,
    length: 15,
    width: 5,
    height: 5,
    customShipping: false,
    customShippingCost: 80,
    gstApplicable: true,
    gstRate: 18,
    images: ["/lavender-serum-bottle.jpg"],
  },
  {
    id: "2",
    name: "Argan Oil Hair Treatment",
    category: "Hair Care",
    subCategory: "Conditioners",
    subSubCategory: "",
    warehouse: "Delhi North",
    tags: ["argan", "hair", "treatment", "natural"],
    mrp: 999,
    discount: 10,
    price: 899.1,
    stock: 200,
    status: "active",
    about: "Nourishing argan oil for healthy, shiny hair",
    description: "This rich argan oil treatment deeply conditions hair, reduces frizz, and adds a brilliant shine.",
    components: [
      { name: "Pure Argan Oil", percentage: "95%" },
      { name: "Vitamin E", percentage: "3%" },
    ],
    ingredients: [
      { name: "Jojoba Oil", benefit: "Moisturizes scalp" },
      { name: "Rosemary Extract", benefit: "Stimulates hair growth" },
    ],
    benefits: "Repairs split ends, Enhances shine, Tames frizz, Strengthens hair",
    howToUse: "Apply a small amount to damp or dry hair, focusing on ends. Do not rinse.",
    expiryDate: "2026-03-15",
    weight: 0.1,
    length: 12,
    width: 4,
    height: 12,
    customShipping: false,
    customShippingCost: 0,
    gstApplicable: true,
    gstRate: 18,
    images: ["/placeholder.svg?key=z8f2q"],
  },
  {
    id: "3",
    name: "Shea Butter Body Cream",
    category: "Body Care",
    subCategory: "",
    subSubCategory: "",
    warehouse: "Bangalore South",
    tags: ["shea", "body", "moisturizer"],
    mrp: 799,
    discount: 5,
    price: 759.05,
    stock: 120,
    status: "active",
    about: "Intensely moisturizing body cream with natural shea butter",
    description: "Our creamy body butter provides long-lasting hydration, leaving skin soft and smooth.",
    components: [
      { name: "Shea Butter", percentage: "40%" },
      { name: "Coconut Oil", percentage: "20%" },
    ],
    ingredients: [
      { name: "Cocoa Butter", benefit: "Deeply conditions skin" },
      { name: "Vitamin F", benefit: "Improves skin barrier" },
    ],
    benefits: "Deep moisturization, Soothes dry skin, Improves elasticity, Protects skin barrier",
    howToUse: "Apply generously to clean, dry skin after bathing. Massage until absorbed.",
    expiryDate: "2025-11-20",
    weight: 0.25,
    length: 15,
    width: 7,
    height: 15,
    customShipping: false,
    customShippingCost: 0,
    gstApplicable: true,
    gstRate: 18,
    images: ["/placeholder.svg?key=x9w3k"],
  },
  {
    id: "4",
    name: "Tea Tree Essential Oil",
    category: "Essential Oils",
    subCategory: "",
    subSubCategory: "",
    warehouse: "Chennai East",
    tags: ["tea-tree", "essential-oil", "antiseptic"],
    mrp: 499,
    discount: 0,
    price: 499,
    stock: 300,
    status: "active",
    about: "Pure therapeutic grade tea tree essential oil",
    description:
      "Known for its cleansing and purifying properties, tea tree oil is a must-have for your wellness routine.",
    components: [{ name: "100% Pure Tea Tree Oil", percentage: "100%" }],
    ingredients: [{ name: "Melaleuca Alternifolia Leaf Oil", benefit: "Antiseptic and anti-inflammatory" }],
    benefits: "Antiseptic, Antibacterial, Antifungal, Cleanses skin, Freshens air",
    howToUse: "Dilute with a carrier oil before topical application. Add to diffusers or cleaning solutions.",
    expiryDate: "2027-06-30",
    weight: 0.03,
    length: 8,
    width: 3,
    height: 8,
    customShipping: false,
    customShippingCost: 0,
    gstApplicable: true,
    gstRate: 18,
    images: ["/placeholder.svg?key=a1b2c"],
  },
  {
    id: "5",
    name: "Turmeric Glow Capsules",
    category: "Supplements",
    subCategory: "",
    subSubCategory: "",
    warehouse: "Kolkata West",
    tags: ["turmeric", "supplements", "glow", "wellness"],
    mrp: 1499,
    discount: 20,
    price: 1199.2,
    stock: 80,
    status: "active",
    about: "Natural supplement for radiant skin and wellness",
    description:
      "Boost your natural glow with our turmeric capsules, rich in curcumin for anti-inflammatory and antioxidant benefits.",
    components: [
      { name: "Organic Turmeric Root Extract", percentage: "500mg" },
      { name: "Black Pepper Extract", percentage: "5mg" },
    ],
    ingredients: [{ name: "Vegetarian Capsule", benefit: "Easy to swallow" }],
    benefits: "Anti-inflammatory, Antioxidant support, Promotes skin health, Supports joint health",
    howToUse: "Take 1-2 capsules daily with food. Consult your healthcare provider if pregnant or nursing.",
    expiryDate: "2026-08-15",
    weight: 0.08,
    length: 10,
    width: 5,
    height: 10,
    customShipping: false,
    customShippingCost: 0,
    gstApplicable: true,
    gstRate: 18,
    images: ["/placeholder.svg?key=d4e5f"],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState<Partial<Product>>({
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
    weight: 1,
    length: 10,
    width: 10,
    height: 10,
    customShipping: false,
    customShippingCost: 0,
    gstApplicable: true,
    gstRate: 18,
    images: [],
  })

  const categoryMap: Record<string, Record<string, string[]>> = {
    "Skincare": {
      "Face Care": ["Anti-Aging Serums", "Brightening Creams", "Cleansers", "Toners", "Moisturizers"],
      "Eye Care": ["Under Eye Gels", "Eye Creams", "Eye Serums"],
      "Lip Care": ["Lip Balms", "Lip Scrubs"],
    },
    "Hair Care": {
      "Shampoos": ["Anti-Dandruff", "Volumizing", "Moisturizing"],
      "Conditioners": ["Deep Conditioners", "Leave-In", "Hair Masks"],
      "Hair Oils": ["Growth Oils", "Scalp Treatments"],
    },
    "Body Care": {
      "Body Lotions": ["Daily Moisturizers", "Night Creams"],
      "Body Scrubs": ["Sugar Scrubs", "Salt Scrubs"],
      "Body Oils": ["Massage Oils", "Dry Oils"],
    },
    "Essential Oils": {
      "Single Oils": ["Floral", "Citrus", "Woody"],
      "Blends": ["Relaxation", "Energy", "Focus"],
    },
    "Supplements": {
      "Vitamins": ["Vitamin C", "Vitamin D", "Multivitamins"],
      "Herbal": ["Turmeric", "Ashwagandha", "Moringa"],
    },
  }

  const categories = Object.keys(categoryMap)
  const warehouses = ["Mumbai Central", "Delhi North", "Bangalore South", "Chennai East", "Kolkata West"]

  const subCategories = formData.category ? Object.keys(categoryMap[formData.category] || {}) : []
  const subSubCategories = formData.category && formData.subCategory
    ? (categoryMap[formData.category]?.[formData.subCategory] || [])
    : []

  const [tagInput, setTagInput] = useState("")

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-")
      if (!(formData.tags || []).includes(tag)) {
        setFormData({ ...formData, tags: [...(formData.tags || []), tag] })
      }
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: (formData.tags || []).filter((t) => t !== tag) })
  }

  const calculateDiscountedPrice = (
    mrp: number,
    discount: number,
    gstRate: number,
    gstApplicable: boolean,
    shippingCost: number,
  ) => {
    const discountedPrice = mrp - (mrp * discount) / 100
    const gst = gstApplicable ? (discountedPrice * gstRate) / 100 : 0
    return discountedPrice + gst + shippingCost
  }

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
    setFormData({ ...formData, images: [...currentImages, ...newImages] })
  }

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])]
    newImages.splice(index, 1)
    setFormData({ ...formData, images: newImages })
  }

  const addComponentRow = () => {
    setFormData({
      ...formData,
      components: [...(formData.components || []), { name: "", percentage: "" }],
    })
  }

  const removeComponentRow = (index: number) => {
    const newComponents = [...(formData.components || [])]
    newComponents.splice(index, 1)
    setFormData({ ...formData, components: newComponents })
  }

  const updateComponent = (index: number, field: "name" | "percentage", value: string) => {
    const newComponents = [...(formData.components || [])]
    newComponents[index][field] = value
    setFormData({ ...formData, components: newComponents })
  }

  const addIngredientRow = () => {
    setFormData({
      ...formData,
      ingredients: [...(formData.ingredients || []), { name: "", benefit: "" }],
    })
  }

  const removeIngredientRow = (index: number) => {
    const newIngredients = [...(formData.ingredients || [])]
    newIngredients.splice(index, 1)
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const updateIngredient = (index: number, field: "name" | "benefit", value: string) => {
    const newIngredients = [...(formData.ingredients || [])]
    newIngredients[index][field] = value
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleProductAdded = (newProduct: Product) => {
    setProducts([...products, newProduct])
  }

  const handleEditProduct = () => {
    if (selectedProduct) {
      const finalPrice = calculateDiscountedPrice(
        formData.mrp || 0,
        formData.discount || 0,
        formData.gstRate || 0,
        formData.gstApplicable || false,
        formData.customShippingCost || 0,
      )
      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? { ...selectedProduct, ...formData, price: finalPrice } : p)),
      )
      setIsEditDialogOpen(false)
      resetForm()
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData(product)
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
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
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
      customShipping: false,
      customShippingCost: 0,
      gstApplicable: true,
      gstRate: 18,
      images: [],
    })
    setSelectedProduct(null)
  }

  const renderProductForm = () => (
    <div className="grid gap-6 py-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Product Images</h3>
        <p className="text-sm text-muted-foreground mb-4">Upload 3-7 images of your product (min 3 required)</p>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 gap-4">
            {(formData.images || []).map((image, index) => (
              <div key={index} className="relative aspect-square border-2 border-dashed rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
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
                <Input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {(formData.images || []).length}/7 images uploaded (minimum 3 required)
          </p>
        </div>
      </div>

      <Separator />

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Lavender Face Serum"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value, subCategory: "", subSubCategory: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse *</Label>
              <Select
                value={formData.warehouse}
                onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh} value={wh}>{wh}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category</Label>
              <Select
                value={formData.subCategory || ""}
                onValueChange={(value) => setFormData({ ...formData, subCategory: value, subSubCategory: "" })}
                disabled={!formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.category ? "Select sub category" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {subCategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subSubCategory">Sub-Sub Category</Label>
              <Select
                value={formData.subSubCategory || ""}
                onValueChange={(value) => setFormData({ ...formData, subSubCategory: value })}
                disabled={!formData.subCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.subCategory ? "Select sub-sub category" : "Select sub category first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {subSubCategories.map((ss) => (
                    <SelectItem key={ss} value={ss}>{ss}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[42px] bg-background">
              {(formData.tags || []).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={(formData.tags || []).length === 0 ? "Type a tag and press Enter or comma..." : "Add more tags..."}
                className="flex-1 min-w-[160px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Pricing Information */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Pricing Information</h3>
        <p className="text-sm text-muted-foreground mb-4">Set your product pricing and inventory details</p>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mrp">MRP (₹) *</Label>
              <Input
                id="mrp"
                type="number"
                value={formData.mrp}
                onChange={(e) => {
                  const mrp = Number(e.target.value)
                  const price = calculateDiscountedPrice(
                    mrp,
                    formData.discount || 0,
                    formData.gstRate || 0,
                    formData.gstApplicable || false,
                    formData.customShippingCost || 0,
                  )
                  setFormData({ ...formData, mrp, price })
                }}
                placeholder="Enter MRP"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="discount">Discount (%)</Label>
                <span className="text-sm font-medium">{formData.discount || 0}%</span>
              </div>
              <Slider
                id="discount"
                min={0}
                max={100}
                step={1}
                value={[formData.discount || 0]}
                onValueChange={([value]) => {
                  const price = calculateDiscountedPrice(
                    formData.mrp || 0,
                    value,
                    formData.gstRate || 0,
                    formData.gstApplicable || false,
                    formData.customShippingCost || 0,
                  )
                  setFormData({ ...formData, discount: value, price })
                }}
                className="w-full"
              />
            </div>
          </div>

          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Discounted Price</p>
                <p className="text-xs text-muted-foreground">This is the final price shown to customers</p>
              </div>
              <p className="text-2xl font-bold">₹{formData.price?.toFixed(2) || "0.00"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="weight">Weight (kg)</Label>
                <span className="text-sm font-medium">{formData.weight || 0.1} kg</span>
              </div>
              <Slider
                id="weight"
                min={0.1}
                max={3}
                step={0.1}
                value={[formData.weight || 0.1]}
                onValueChange={([value]) => setFormData({ ...formData, weight: value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Range: 100gms - 3kg</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingCost">Shipping Cost (₹)</Label>
              <Input
                id="shippingCost"
                type="number"
                value={formData.customShippingCost || 0}
                onChange={(e) => {
                  const shippingCost = Number(e.target.value)
                  const price = calculateDiscountedPrice(
                    formData.mrp || 0,
                    formData.discount || 0,
                    formData.gstRate || 0,
                    formData.gstApplicable || false,
                    shippingCost,
                  )
                  setFormData({ ...formData, customShippingCost: shippingCost, price })
                }}
                placeholder="80"
              />
              <p className="text-xs text-muted-foreground">Default: ₹80 (1-5kg)</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (cm) *</Label>
              <Input
                id="length"
                type="number"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (cm) *</Label>
              <Input
                id="width"
                type="number"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>GST Applicable *</Label>
            <RadioGroup
              value={formData.gstApplicable ? "yes" : "no"}
              onValueChange={(value) => {
                const gstApplicable = value === "yes"
                const price = calculateDiscountedPrice(
                  formData.mrp || 0,
                  formData.discount || 0,
                  formData.gstRate || 0,
                  gstApplicable,
                  formData.customShippingCost || 0,
                )
                setFormData({ ...formData, gstApplicable, price })
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="gst-yes" />
                <Label htmlFor="gst-yes" className="font-normal">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="gst-no" />
                <Label htmlFor="gst-no" className="font-normal">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.gstApplicable && (
            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%) *</Label>
              <Input
                id="gstRate"
                type="number"
                value={formData.gstRate}
                onChange={(e) => {
                  const gstRate = Number(e.target.value)
                  const price = calculateDiscountedPrice(
                    formData.mrp || 0,
                    formData.discount || 0,
                    gstRate,
                    formData.gstApplicable || false,
                    formData.customShippingCost || 0,
                  )
                  setFormData({ ...formData, gstRate, price })
                }}
                placeholder="18"
              />
              <p className="text-xs text-muted-foreground">Common rates: 5%, 12%, 18%, 28%</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Product Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="about">About Product *</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Brief summary of the product"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product description"
              rows={3}
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
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(formData.components || []).map((component, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={component.name}
                          onChange={(e) => updateComponent(index, "name", e.target.value)}
                          placeholder="e.g., Lavender Oil"
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
                          <Button type="button" size="icon" variant="ghost" onClick={() => removeComponentRow(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
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
                    <TableHead className="w-16"></TableHead>
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
                          placeholder="e.g., Soothes skin"
                        />
                      </TableCell>
                      <TableCell>
                        {(formData.ingredients || []).length > 1 && (
                          <Button type="button" size="icon" variant="ghost" onClick={() => removeIngredientRow(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
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
            <Label htmlFor="benefits">Benefits *</Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="Key benefits of the product"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="howToUse">How to Use *</Label>
            <Textarea
              id="howToUse"
              value={formData.howToUse}
              onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
              placeholder="Instructions on how to use the product"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <AddProductDialog onProductAdded={handleProductAdded} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter((p) => p.stock < 20).length}</div>
            <p className="text-xs text-muted-foreground">Items below 20 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(products.reduce((sum, p) => sum + p.price * p.stock, 0) / 100).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product List</CardTitle>
              <CardDescription>Browse and manage all products</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.warehouse}</TableCell>
                  <TableCell>₹{product.mrp}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active"
                          ? "default"
                          : product.status === "inactive"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openViewDialog(product)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below</DialogDescription>
          </DialogHeader>
          {renderProductForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>Complete product information</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-base">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Warehouse</p>
                  <p className="text-base">{selectedProduct.warehouse}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MRP</p>
                  <p className="text-base">₹{selectedProduct.mrp}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Selling Price</p>
                  <p className="text-base">₹{selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock</p>
                  <p className="text-base">{selectedProduct.stock} units</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                  <p className="text-base">{selectedProduct.expiryDate}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">About</p>
                <p className="text-base">{selectedProduct.about}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-base">{selectedProduct.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Components/Ingredients</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component Name</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduct.components.map((comp, index) => (
                      <TableRow key={index}>
                        <TableCell>{comp.name}</TableCell>
                        <TableCell>{comp.percentage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Additional Ingredients</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient Name</TableHead>
                      <TableHead>Benefit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduct.ingredients.map((ing, index) => (
                      <TableRow key={index}>
                        <TableCell>{ing.name}</TableCell>
                        <TableCell>{ing.benefit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Benefits</p>
                <p className="text-base">{selectedProduct.benefits}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">How to Use</p>
                <p className="text-base">{selectedProduct.howToUse}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weight</p>
                  <p className="text-base">{selectedProduct.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dimensions (L×W×H)</p>
                  <p className="text-base">
                    {selectedProduct.length}×{selectedProduct.width}×{selectedProduct.height} cm
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">GST</p>
                  <p className="text-base">
                    {selectedProduct.gstApplicable ? `${selectedProduct.gstRate}%` : "Not Applicable"}
                  </p>
                </div>
              </div>

              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Product Images</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
