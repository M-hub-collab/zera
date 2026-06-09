"use client"

import type React from "react"

import { useState } from "react"
import { Search, Eye, Download, Package, CheckCircle, XCircle, Clock, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackButton } from "@/components/back-button"

type Order = {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  products: { name: string; quantity: number; price: number }[]
  totalAmount: number
  status: "pending" | "processing" | "packed" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  shippingAddress: string
  packagingImages?: {
    before: string[]
    after: string[]
  }
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    products: [
      { name: "Organic Lavender Face Serum", quantity: 2, price: 1104.15 },
      { name: "Rose Water Toner", quantity: 1, price: 599.0 },
    ],
    totalAmount: 2807.3,
    status: "processing",
    orderDate: "2024-01-15",
    shippingAddress: "123 MG Road, Bangalore, Karnataka 560001",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Rahul Verma",
    email: "rahul.v@email.com",
    phone: "+91 87654 32109",
    products: [{ name: "Tea Tree Face Wash", quantity: 3, price: 449.0 }],
    totalAmount: 1347.0,
    status: "packed",
    orderDate: "2024-01-14",
    shippingAddress: "456 Park Street, Mumbai, Maharashtra 400001",
    packagingImages: {
      before: ["/products-before-packaging.jpg"],
      after: ["/sealed-package.jpg"],
    },
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Anjali Desai",
    email: "anjali.d@email.com",
    phone: "+91 76543 21098",
    products: [
      { name: "Neem Face Pack", quantity: 1, price: 349.0 },
      { name: "Aloe Vera Gel", quantity: 2, price: 299.0 },
    ],
    totalAmount: 947.0,
    status: "shipped",
    orderDate: "2024-01-13",
    shippingAddress: "789 Civil Lines, Delhi 110054",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isPackagingDialogOpen, setIsPackagingDialogOpen] = useState(false)
  const [beforeImages, setBeforeImages] = useState<string[]>([])
  const [afterImages, setAfterImages] = useState<string[]>([])

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], { variant: any; icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      processing: { variant: "default", icon: Package },
      packed: { variant: "default", icon: CheckCircle },
      shipped: { variant: "default", icon: Package },
      delivered: { variant: "default", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
    }
    const { variant, icon: Icon } = variants[status]
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleOpenPackaging = (order: Order) => {
    setSelectedOrder(order)
    setBeforeImages(order.packagingImages?.before || [])
    setAfterImages(order.packagingImages?.after || [])
    setIsPackagingDialogOpen(true)
  }

  const handleBeforeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setBeforeImages([...beforeImages, ...newImages])
  }

  const handleAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setAfterImages([...afterImages, ...newImages])
  }

  const savePackagingImages = () => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, packagingImages: { before: beforeImages, after: afterImages } }
          : order,
      )
      setOrders(updatedOrders)
      setIsPackagingDialogOpen(false)
    }
  }

  const downloadLabel = (order: Order) => {
    // Mock label download
    const labelContent = `
      SHIPPING LABEL
      Order: ${order.orderNumber}
      To: ${order.customerName}
      ${order.shippingAddress}
      Phone: ${order.phone}
    `
    const blob = new Blob([labelContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `label-${order.orderNumber}.txt`
    a.click()
  }

  const downloadManifest = (order: Order) => {
    // Mock manifest download
    const manifestContent = `
      ORDER MANIFEST
      Order Number: ${order.orderNumber}
      Date: ${order.orderDate}
      Customer: ${order.customerName}
      
      ITEMS:
      ${order.products.map((p) => `${p.name} x${p.quantity} - ₹${p.price}`).join("\n")}
      
      Total: ₹${order.totalAmount}
      Status: ${order.status}
    `
    const blob = new Blob([manifestContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `manifest-${order.orderNumber}.txt`
    a.click()
  }

  const statsCards = [
    {
      title: "Total Orders",
      value: orders.length,
      description: "All time orders",
      icon: Package,
    },
    {
      title: "Processing",
      value: orders.filter((o) => o.status === "processing").length,
      description: "Being prepared",
      icon: Clock,
    },
    {
      title: "Packed",
      value: orders.filter((o) => o.status === "packed").length,
      description: "Ready to ship",
      icon: CheckCircle,
    },
    {
      title: "Shipped",
      value: orders.filter((o) => o.status === "shipped").length,
      description: "In transit",
      icon: Package,
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.products.length} items</TableCell>
                  <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenPackaging(order)}>
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadLabel(order)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadManifest(order)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>Complete order information and status</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedOrder.status)}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => downloadLabel(selectedOrder)}>
                    <Download className="h-4 w-4 mr-2" />
                    Label
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadManifest(selectedOrder)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Manifest
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                  <p className="text-base">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p className="text-base">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Shipping Address</p>
                <p className="text-base">{selectedOrder.shippingAddress}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-4">Order Items</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>₹{product.price.toFixed(2)}</TableCell>
                        <TableCell>₹{(product.quantity * product.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total Amount
                      </TableCell>
                      <TableCell className="font-bold">₹{selectedOrder.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {selectedOrder.packagingImages && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-4">Packaging Verification</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Before Packaging</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedOrder.packagingImages.before.map((img, i) => (
                            <img
                              key={i}
                              src={img || "/placeholder.svg"}
                              alt={`Before ${i + 1}`}
                              className="w-full h-32 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">After Packaging</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedOrder.packagingImages.after.map((img, i) => (
                            <img
                              key={i}
                              src={img || "/placeholder.svg"}
                              alt={`After ${i + 1}`}
                              className="w-full h-32 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Packaging Verification Dialog */}
      <Dialog open={isPackagingDialogOpen} onOpenChange={setIsPackagingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verify Packaging - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>Upload images before and after packaging for quality control</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Tabs defaultValue="before" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="before">Before Packaging</TabsTrigger>
                <TabsTrigger value="after">After Packaging</TabsTrigger>
              </TabsList>
              <TabsContent value="before" className="space-y-4">
                <div>
                  <Label>Upload Before Packaging Images</Label>
                  <p className="text-sm text-muted-foreground mb-4">Take photos of products before they are packed</p>
                  <div className="grid grid-cols-3 gap-4">
                    {beforeImages.map((img, index) => (
                      <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Before ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Upload</span>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleBeforeImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="after" className="space-y-4">
                <div>
                  <Label>Upload After Packaging Images</Label>
                  <p className="text-sm text-muted-foreground mb-4">Take photos of sealed and labeled packages</p>
                  <div className="grid grid-cols-3 gap-4">
                    {afterImages.map((img, index) => (
                      <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`After ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Upload</span>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleAfterImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackagingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePackagingImages}>Save Images</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
