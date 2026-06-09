"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Ticket,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Coupon {
  id: string
  code: string
  description: string
  type: "percentage" | "fixed"
  value: number
  minPurchase?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  status: "active" | "inactive" | "expired"
  startDate?: string
  endDate?: string
  categories?: string[]
  createdAt: string
}

const initialCoupons: Coupon[] = [
  {
    id: "1",
    code: "SUMMER30",
    description: "30% off on all products",
    type: "percentage",
    value: 30,
    minPurchase: 50,
    maxDiscount: 100,
    usageLimit: 1000,
    usageCount: 456,
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    createdAt: "2024-12-15",
  },
  {
    id: "2",
    code: "WELCOME10",
    description: "Welcome discount for new customers",
    type: "fixed",
    value: 10,
    usageLimit: 500,
    usageCount: 234,
    status: "active",
    createdAt: "2025-01-01",
  },
  {
    id: "3",
    code: "FREESHIP",
    description: "Free shipping on orders over $30",
    type: "fixed",
    value: 5,
    minPurchase: 30,
    usageCount: 789,
    status: "active",
    createdAt: "2025-01-05",
  },
  {
    id: "4",
    code: "SKINCARE20",
    description: "20% off on skincare products",
    type: "percentage",
    value: 20,
    usageLimit: 200,
    usageCount: 145,
    status: "active",
    categories: ["Skincare"],
    startDate: "2025-01-10",
    endDate: "2025-02-28",
    createdAt: "2025-01-08",
  },
  {
    id: "5",
    code: "HOLIDAY50",
    description: "Holiday special - 50% off",
    type: "percentage",
    value: 50,
    maxDiscount: 200,
    usageLimit: 100,
    usageCount: 100,
    status: "expired",
    startDate: "2024-12-20",
    endDate: "2024-12-31",
    createdAt: "2024-12-15",
  },
  {
    id: "6",
    code: "AFFILIATE15",
    description: "Affiliate exclusive discount",
    type: "percentage",
    value: 15,
    usageCount: 67,
    status: "inactive",
    createdAt: "2025-01-12",
  },
]

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 0,
    startDate: "",
    endDate: "",
    categories: "",
  })

  const handleAddCoupon = () => {
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: formData.code.toUpperCase(),
      description: formData.description,
      type: formData.type,
      value: formData.value,
      minPurchase: formData.minPurchase || undefined,
      maxDiscount: formData.maxDiscount || undefined,
      usageLimit: formData.usageLimit || undefined,
      usageCount: 0,
      status: "active",
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      categories: formData.categories ? formData.categories.split(",").map((c) => c.trim()) : undefined,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCoupons([...coupons, newCoupon])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCoupon = () => {
    if (!selectedCoupon) return
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === selectedCoupon.id
          ? {
              ...coupon,
              code: formData.code.toUpperCase(),
              description: formData.description,
              type: formData.type,
              value: formData.value,
              minPurchase: formData.minPurchase || undefined,
              maxDiscount: formData.maxDiscount || undefined,
              usageLimit: formData.usageLimit || undefined,
              startDate: formData.startDate || undefined,
              endDate: formData.endDate || undefined,
              categories: formData.categories ? formData.categories.split(",").map((c) => c.trim()) : undefined,
            }
          : coupon,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedCoupon(null)
    resetForm()
  }

  const handleDeleteCoupon = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((coupon) => coupon.id !== id))
    }
  }

  const handleToggleStatus = (id: string) => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === id ? { ...coupon, status: coupon.status === "active" ? "inactive" : "active" } : coupon,
      ),
    )
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`Copied: ${code}`)
  }

  const openEditDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      startDate: coupon.startDate || "",
      endDate: coupon.endDate || "",
      categories: coupon.categories?.join(", ") || "",
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      type: "percentage",
      value: 0,
      minPurchase: 0,
      maxDiscount: 0,
      usageLimit: 0,
      startDate: "",
      endDate: "",
      categories: "",
    })
  }

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeCount = coupons.filter((c) => c.status === "active").length
  const totalUsage = coupons.reduce((acc, c) => acc + c.usageCount, 0)
  const totalRevenue = coupons.reduce((acc, c) => {
    if (c.type === "fixed") {
      return acc + c.value * c.usageCount
    }
    return acc + (c.maxDiscount || 50) * c.usageCount * 0.5
  }, 0)

  const getCouponsByStatus = (status: string) => coupons.filter((c) => c.status === status)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
            <p className="text-muted-foreground">Create and manage discount coupons</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
                <DialogDescription>Create a discount coupon for your customers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., SUMMER30"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Discount Type</Label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the coupon..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      {formData.type === "percentage" ? "Discount Percentage" : "Discount Amount ($)"}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder={formData.type === "percentage" ? "e.g., 30" : "e.g., 10"}
                      value={formData.value || ""}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Min Purchase Amount ($)</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      placeholder="Optional"
                      value={formData.minPurchase || ""}
                      onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Max Discount Amount ($)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      placeholder="Optional"
                      value={formData.maxDiscount || ""}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      placeholder="Optional"
                      value={formData.usageLimit || ""}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date (Optional)</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categories">Categories (Optional)</Label>
                  <Input
                    id="categories"
                    placeholder="e.g., Skincare, Haircare (comma separated)"
                    value={formData.categories}
                    onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCoupon} disabled={!formData.code || !formData.value}>
                  Create Coupon
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coupons.length}</div>
              <p className="text-xs text-muted-foreground">{activeCount} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Times redeemed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Discount Given</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total discounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalUsage / coupons.length)}</div>
              <p className="text-xs text-muted-foreground">Per coupon</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different statuses */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({coupons.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({getCouponsByStatus("active").length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({getCouponsByStatus("inactive").length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({getCouponsByStatus("expired").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Coupons</CardTitle>
                <CardDescription>View and manage all discount coupons</CardDescription>
                <div className="pt-4">
                  <Input
                    placeholder="Search coupons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoupons.map((coupon) => {
                      const usagePercent = coupon.usageLimit
                        ? ((coupon.usageCount / coupon.usageLimit) * 100).toFixed(0)
                        : null
                      return (
                        <TableRow key={coupon.id}>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <code className="font-mono font-bold text-primary">{coupon.code}</code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopyCode(coupon.code)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">{coupon.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                              </p>
                              {coupon.minPurchase && (
                                <p className="text-xs text-muted-foreground">Min: ${coupon.minPurchase}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {coupon.usageCount}
                                {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                              </p>
                              {usagePercent && <p className="text-xs text-muted-foreground">{usagePercent}% used</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                coupon.status === "active"
                                  ? "default"
                                  : coupon.status === "expired"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {coupon.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {coupon.startDate || coupon.endDate ? (
                              <div className="text-sm">
                                {coupon.startDate && <p>From: {new Date(coupon.startDate).toLocaleDateString()}</p>}
                                {coupon.endDate && <p>To: {new Date(coupon.endDate).toLocaleDateString()}</p>}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No limit</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleCopyCode(coupon.code)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Code
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(coupon)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(coupon.id)}>
                                  {coupon.status === "active" ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCoupon(coupon.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {["active", "inactive", "expired"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{status} Coupons</CardTitle>
                  <CardDescription>Coupons with {status} status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getCouponsByStatus(status).map((coupon) => {
                      const usagePercent = coupon.usageLimit
                        ? ((coupon.usageCount / coupon.usageLimit) * 100).toFixed(0)
                        : null
                      return (
                        <Card key={coupon.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <code className="font-mono font-bold text-lg text-primary">{coupon.code}</code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopyCode(coupon.code)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <Badge
                                variant={
                                  coupon.status === "active"
                                    ? "default"
                                    : coupon.status === "expired"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {coupon.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{coupon.description}</p>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Discount:</span>
                                <span className="font-semibold">
                                  {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Usage:</span>
                                <span className="font-semibold">
                                  {coupon.usageCount}
                                  {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                                  {usagePercent && ` (${usagePercent}%)`}
                                </span>
                              </div>
                              {coupon.minPurchase && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Min Purchase:</span>
                                  <span className="font-semibold">${coupon.minPurchase}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => openEditDialog(coupon)}
                              >
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Coupon</DialogTitle>
              <DialogDescription>Update coupon information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Coupon Code</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Discount Type</Label>
                  <select
                    id="edit-type"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-value">
                    {formData.type === "percentage" ? "Discount Percentage" : "Discount Amount ($)"}
                  </Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={formData.value || ""}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minPurchase">Min Purchase Amount ($)</Label>
                  <Input
                    id="edit-minPurchase"
                    type="number"
                    value={formData.minPurchase || ""}
                    onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-maxDiscount">Max Discount Amount ($)</Label>
                  <Input
                    id="edit-maxDiscount"
                    type="number"
                    value={formData.maxDiscount || ""}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-usageLimit">Usage Limit</Label>
                  <Input
                    id="edit-usageLimit"
                    type="number"
                    value={formData.usageLimit || ""}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date (Optional)</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-categories">Categories (Optional)</Label>
                <Input
                  id="edit-categories"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCoupon}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
