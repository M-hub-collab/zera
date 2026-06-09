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
import { Plus, MoreVertical, Pencil, Trash2, Eye, EyeOff, ImageIcon, MousePointer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Banner {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  position: "hero" | "sidebar" | "footer" | "popup"
  status: "active" | "inactive" | "scheduled"
  startDate?: string
  endDate?: string
  clicks: number
  impressions: number
  createdAt: string
}

const initialBanners: Banner[] = [
  {
    id: "1",
    title: "Summer Sale 2025",
    description: "Get 30% off on all skincare products",
    imageUrl: "/summer-sale-banner.jpg",
    linkUrl: "/products/skincare",
    position: "hero",
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    clicks: 1245,
    impressions: 15680,
    createdAt: "2024-12-15",
  },
  {
    id: "2",
    title: "New Arrivals",
    description: "Check out our latest natural products",
    imageUrl: "/new-arrivals-banner.jpg",
    linkUrl: "/products/new",
    position: "sidebar",
    status: "active",
    clicks: 856,
    impressions: 12340,
    createdAt: "2025-01-05",
  },
  {
    id: "3",
    title: "Free Shipping",
    description: "Free shipping on orders over $50",
    imageUrl: "/free-shipping-promo.jpg",
    linkUrl: "/shipping-info",
    position: "footer",
    status: "active",
    clicks: 432,
    impressions: 8920,
    createdAt: "2025-01-10",
  },
  {
    id: "4",
    title: "Newsletter Signup",
    description: "Subscribe and get 10% off your first order",
    imageUrl: "/newsletter-popup.jpg",
    linkUrl: "/newsletter",
    position: "popup",
    status: "inactive",
    clicks: 234,
    impressions: 5670,
    createdAt: "2024-12-20",
  },
  {
    id: "5",
    title: "Valentine's Day Special",
    description: "Gift sets for your loved ones",
    imageUrl: "/valentines-banner.jpg",
    linkUrl: "/products/gift-sets",
    position: "hero",
    status: "scheduled",
    startDate: "2025-02-01",
    endDate: "2025-02-14",
    clicks: 0,
    impressions: 0,
    createdAt: "2025-01-15",
  },
]

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const pageOptions = [
    { value: "/", label: "Home" },
    { value: "/products", label: "All Products" },
    { value: "/products/skincare", label: "Skincare" },
    { value: "/products/haircare", label: "Haircare" },
    { value: "/products/body-care", label: "Body Care" },
    { value: "/products/essential-oils", label: "Essential Oils" },
    { value: "/products/supplements", label: "Supplements" },
    { value: "/products/new", label: "New Arrivals" },
    { value: "/products/sale", label: "Sale / Offers" },
    { value: "/products/gift-sets", label: "Gift Sets" },
    { value: "/newsletter", label: "Newsletter" },
    { value: "/shipping-info", label: "Shipping Info" },
    { value: "/about", label: "About Us" },
    { value: "/contact", label: "Contact" },
  ]

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    position: "hero" as "hero" | "sidebar" | "footer" | "popup",
    status: "active" as "active" | "inactive" | "scheduled",
    startDate: "",
    endDate: "",
  })

  const handleAddBanner = () => {
    const newBanner: Banner = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl,
      position: formData.position,
      status: formData.status,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setBanners([...banners, newBanner])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditBanner = () => {
    if (!selectedBanner) return
    setBanners(
      banners.map((banner) =>
        banner.id === selectedBanner.id
          ? {
              ...banner,
              title: formData.title,
              description: formData.description,
              imageUrl: formData.imageUrl,
              linkUrl: formData.linkUrl,
              position: formData.position,
              status: formData.status,
              startDate: formData.startDate || undefined,
              endDate: formData.endDate || undefined,
            }
          : banner,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedBanner(null)
    resetForm()
  }

  const handleDeleteBanner = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      setBanners(banners.filter((banner) => banner.id !== id))
    }
  }

  const handleToggleStatus = (id: string) => {
    setBanners(
      banners.map((banner) =>
        banner.id === id ? { ...banner, status: banner.status === "active" ? "inactive" : "active" } : banner,
      ),
    )
  }

  const openEditDialog = (banner: Banner) => {
    setSelectedBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      position: banner.position,
      status: banner.status,
      startDate: banner.startDate || "",
      endDate: banner.endDate || "",
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      position: "hero",
      status: "active",
      startDate: "",
      endDate: "",
    })
  }

  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeCount = banners.filter((b) => b.status === "active").length
  const totalClicks = banners.reduce((acc, b) => acc + b.clicks, 0)
  const totalImpressions = banners.reduce((acc, b) => acc + b.impressions, 0)
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00"

  const getBannersByPosition = (position: string) => banners.filter((b) => b.position === position)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ad Banners</h1>
            <p className="text-muted-foreground">Manage promotional banners and advertisements</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
                <DialogDescription>Create a new promotional banner for your store</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Sale 2025"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the banner..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/banner.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkUrl">Page / Link URL</Label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={pageOptions.some(p => p.value === formData.linkUrl) ? formData.linkUrl : "__custom__"}
                      onChange={(e) => {
                        if (e.target.value !== "__custom__") {
                          setFormData({ ...formData, linkUrl: e.target.value })
                        }
                      }}
                    >
                      <option value="__custom__">Custom URL...</option>
                      {pageOptions.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <Input
                      id="linkUrl"
                      placeholder="/custom-path"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Select a page or enter a custom URL path</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <select
                      id="position"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value as typeof formData.position })
                      }
                    >
                      <option value="hero">Hero</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="footer">Footer</option>
                      <option value="popup">Popup</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBanner} disabled={!formData.title || !formData.imageUrl}>
                  Add Banner
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{banners.length}</div>
              <p className="text-xs text-muted-foreground">{activeCount} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCTR}%</div>
              <p className="text-xs text-muted-foreground">Click-through rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Banners</TabsTrigger>
            <TabsTrigger value="hero">Hero ({getBannersByPosition("hero").length})</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar ({getBannersByPosition("sidebar").length})</TabsTrigger>
            <TabsTrigger value="footer">Footer ({getBannersByPosition("footer").length})</TabsTrigger>
            <TabsTrigger value="popup">Popup ({getBannersByPosition("popup").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Banners</CardTitle>
                <CardDescription>View and manage all promotional banners</CardDescription>
                <div className="pt-4">
                  <Input
                    placeholder="Search banners..."
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
                      <TableHead>Banner</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => {
                      const ctr =
                        banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(2) : "0.00"
                      return (
                        <TableRow key={banner.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={banner.imageUrl || "/placeholder.svg"}
                                alt={banner.title}
                                className="h-12 w-20 rounded-md object-cover"
                              />
                              <div>
                                <p className="font-medium">{banner.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{banner.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{banner.position}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                banner.status === "active"
                                  ? "default"
                                  : banner.status === "scheduled"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {banner.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{banner.clicks.toLocaleString()}</TableCell>
                          <TableCell>{banner.impressions.toLocaleString()}</TableCell>
                          <TableCell>{ctr}%</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(banner)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(banner.id)}>
                                  {banner.status === "active" ? (
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
                                  onClick={() => handleDeleteBanner(banner.id)}
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

          {["hero", "sidebar", "footer", "popup"].map((position) => (
            <TabsContent key={position} value={position}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{position} Banners</CardTitle>
                  <CardDescription>Banners displayed in the {position} position</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getBannersByPosition(position).map((banner) => (
                      <Card key={banner.id}>
                        <CardContent className="p-4">
                          <img
                            src={banner.imageUrl || "/placeholder.svg"}
                            alt={banner.title}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold mb-1">{banner.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{banner.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <Badge
                              variant={
                                banner.status === "active"
                                  ? "default"
                                  : banner.status === "scheduled"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {banner.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {banner.clicks} clicks / {banner.impressions} views
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => openEditDialog(banner)}
                            >
                              <Pencil className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
              <DialogTitle>Edit Banner</DialogTitle>
              <DialogDescription>Update banner information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Banner Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
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
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-linkUrl">Page / Link URL</Label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={pageOptions.some(p => p.value === formData.linkUrl) ? formData.linkUrl : "__custom__"}
                    onChange={(e) => {
                      if (e.target.value !== "__custom__") {
                        setFormData({ ...formData, linkUrl: e.target.value })
                      }
                    }}
                  >
                    <option value="__custom__">Custom URL...</option>
                    {pageOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <Input
                    id="edit-linkUrl"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <select
                    id="edit-position"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as typeof formData.position })}
                  >
                    <option value="hero">Hero</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditBanner}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
