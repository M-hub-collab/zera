"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Users,
  DollarSign,
  TrendingUp,
  LinkIcon,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Affiliate {
  id: string
  name: string
  email: string
  phone?: string
  website?: string
  affiliateCode: string
  commissionRate: number
  status: "active" | "pending" | "suspended"
  totalSales: number
  totalCommission: number
  clicks: number
  conversions: number
  joinedDate: string
  lastActivity?: string
  tier: "bronze" | "silver" | "gold" | "platinum"
}

const initialAffiliates: Affiliate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    website: "https://beautybysarah.com",
    affiliateCode: "SARAH2025",
    commissionRate: 15,
    status: "active",
    totalSales: 45230,
    totalCommission: 6784.5,
    clicks: 3420,
    conversions: 234,
    joinedDate: "2024-06-15",
    lastActivity: "2025-01-24",
    tier: "platinum",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    website: "https://naturalwellness.blog",
    affiliateCode: "MICHAEL15",
    commissionRate: 12,
    status: "active",
    totalSales: 32100,
    totalCommission: 3852,
    clicks: 2890,
    conversions: 178,
    joinedDate: "2024-08-20",
    lastActivity: "2025-01-23",
    tier: "gold",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "+1 (555) 987-6543",
    affiliateCode: "EMILY10",
    commissionRate: 10,
    status: "active",
    totalSales: 18900,
    totalCommission: 1890,
    clicks: 1560,
    conversions: 98,
    joinedDate: "2024-10-05",
    lastActivity: "2025-01-22",
    tier: "silver",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    website: "https://healthylifestyle.net",
    affiliateCode: "DAVID2025",
    commissionRate: 10,
    status: "pending",
    totalSales: 0,
    totalCommission: 0,
    clicks: 0,
    conversions: 0,
    joinedDate: "2025-01-20",
    tier: "bronze",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.m@example.com",
    affiliateCode: "JESSICA20",
    commissionRate: 10,
    status: "suspended",
    totalSales: 8500,
    totalCommission: 850,
    clicks: 890,
    conversions: 45,
    joinedDate: "2024-09-12",
    lastActivity: "2024-12-15",
    tier: "bronze",
  },
]

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    affiliateCode: "",
    commissionRate: 10,
  })

  const handleAddAffiliate = () => {
    const newAffiliate: Affiliate = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      website: formData.website || undefined,
      affiliateCode: formData.affiliateCode.toUpperCase(),
      commissionRate: formData.commissionRate,
      status: "pending",
      totalSales: 0,
      totalCommission: 0,
      clicks: 0,
      conversions: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      tier: "bronze",
    }
    setAffiliates([...affiliates, newAffiliate])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditAffiliate = () => {
    if (!selectedAffiliate) return
    setAffiliates(
      affiliates.map((affiliate) =>
        affiliate.id === selectedAffiliate.id
          ? {
              ...affiliate,
              name: formData.name,
              email: formData.email,
              phone: formData.phone || undefined,
              website: formData.website || undefined,
              affiliateCode: formData.affiliateCode.toUpperCase(),
              commissionRate: formData.commissionRate,
            }
          : affiliate,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedAffiliate(null)
    resetForm()
  }

  const handleDeleteAffiliate = (id: string) => {
    if (confirm("Are you sure you want to delete this affiliate?")) {
      setAffiliates(affiliates.filter((affiliate) => affiliate.id !== id))
    }
  }

  const handleApproveAffiliate = (id: string) => {
    setAffiliates(affiliates.map((affiliate) => (affiliate.id === id ? { ...affiliate, status: "active" } : affiliate)))
  }

  const handleSuspendAffiliate = (id: string) => {
    setAffiliates(
      affiliates.map((affiliate) => (affiliate.id === id ? { ...affiliate, status: "suspended" } : affiliate)),
    )
  }

  const openEditDialog = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate)
    setFormData({
      name: affiliate.name,
      email: affiliate.email,
      phone: affiliate.phone || "",
      website: affiliate.website || "",
      affiliateCode: affiliate.affiliateCode,
      commissionRate: affiliate.commissionRate,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      affiliateCode: "",
      commissionRate: 10,
    })
  }

  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.affiliateCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeCount = affiliates.filter((a) => a.status === "active").length
  const totalSales = affiliates.reduce((acc, a) => acc + a.totalSales, 0)
  const totalCommission = affiliates.reduce((acc, a) => acc + a.totalCommission, 0)
  const avgConversionRate =
    affiliates.reduce((acc, a) => acc + a.clicks, 0) > 0
      ? (
          (affiliates.reduce((acc, a) => acc + a.conversions, 0) / affiliates.reduce((acc, a) => acc + a.clicks, 0)) *
          100
        ).toFixed(2)
      : "0.00"

  const getAffiliatesByStatus = (status: string) => affiliates.filter((a) => a.status === status)

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "default"
      case "gold":
        return "secondary"
      case "silver":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTierIcon = (tier: string) => {
    return <Award className="h-3 w-3" />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Affiliates</h1>
            <p className="text-muted-foreground">Manage your affiliate marketing program</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Affiliate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Affiliate</DialogTitle>
                <DialogDescription>Register a new affiliate partner</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Sarah Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="affiliateCode">Affiliate Code</Label>
                    <Input
                      id="affiliateCode"
                      placeholder="e.g., SARAH2025"
                      value={formData.affiliateCode}
                      onChange={(e) => setFormData({ ...formData, affiliateCode: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      placeholder="10"
                      value={formData.commissionRate || ""}
                      onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAffiliate}
                  disabled={!formData.name || !formData.email || !formData.affiliateCode}
                >
                  Add Affiliate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliates.length}</div>
              <p className="text-xs text-muted-foreground">{activeCount} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Generated by affiliates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCommission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Paid to affiliates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConversionRate}%</div>
              <p className="text-xs text-muted-foreground">Average rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different statuses */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({affiliates.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({getAffiliatesByStatus("active").length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({getAffiliatesByStatus("pending").length})</TabsTrigger>
            <TabsTrigger value="suspended">Suspended ({getAffiliatesByStatus("suspended").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Affiliates</CardTitle>
                <CardDescription>View and manage all affiliate partners</CardDescription>
                <div className="pt-4">
                  <Input
                    placeholder="Search affiliates..."
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
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAffiliates.map((affiliate) => {
                      const conversionRate =
                        affiliate.clicks > 0 ? ((affiliate.conversions / affiliate.clicks) * 100).toFixed(1) : "0.0"
                      return (
                        <TableRow key={affiliate.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${affiliate.name}`} />
                                <AvatarFallback>{affiliate.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{affiliate.name}</p>
                                  <Badge variant={getTierBadgeVariant(affiliate.tier)} className="text-xs">
                                    {getTierIcon(affiliate.tier)}
                                    <span className="ml-1 capitalize">{affiliate.tier}</span>
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {affiliate.affiliateCode}
                            </code>
                          </TableCell>
                          <TableCell>{affiliate.commissionRate}%</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">${affiliate.totalSales.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                ${affiliate.totalCommission.toLocaleString()} earned
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{affiliate.conversions}</p>
                              <p className="text-xs text-muted-foreground">{conversionRate}% rate</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                affiliate.status === "active"
                                  ? "default"
                                  : affiliate.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {affiliate.status === "active" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                              {affiliate.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                              {affiliate.status === "suspended" && <XCircle className="mr-1 h-3 w-3" />}
                              {affiliate.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(affiliate)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {affiliate.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleApproveAffiliate(affiliate.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                )}
                                {affiliate.status === "active" && (
                                  <DropdownMenuItem onClick={() => handleSuspendAffiliate(affiliate.id)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Suspend
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteAffiliate(affiliate.id)}
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

          {["active", "pending", "suspended"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{status} Affiliates</CardTitle>
                  <CardDescription>Affiliates with {status} status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getAffiliatesByStatus(status).map((affiliate) => {
                      const conversionRate =
                        affiliate.clicks > 0 ? ((affiliate.conversions / affiliate.clicks) * 100).toFixed(1) : "0.0"
                      return (
                        <Card key={affiliate.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${affiliate.name}`}
                                  />
                                  <AvatarFallback>{affiliate.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{affiliate.name}</p>
                                  <Badge variant={getTierBadgeVariant(affiliate.tier)} className="text-xs mt-1">
                                    {getTierIcon(affiliate.tier)}
                                    <span className="ml-1 capitalize">{affiliate.tier}</span>
                                  </Badge>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  affiliate.status === "active"
                                    ? "default"
                                    : affiliate.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {affiliate.status}
                              </Badge>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{affiliate.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <LinkIcon className="h-3 w-3 text-muted-foreground" />
                                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                  {affiliate.affiliateCode}
                                </code>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-border">
                              <div>
                                <p className="text-xs text-muted-foreground">Sales</p>
                                <p className="text-sm font-semibold">${affiliate.totalSales.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Commission</p>
                                <p className="text-sm font-semibold">${affiliate.totalCommission.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Conversions</p>
                                <p className="text-sm font-semibold">{affiliate.conversions}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Rate</p>
                                <p className="text-sm font-semibold">{conversionRate}%</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => openEditDialog(affiliate)}
                              >
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                              {affiliate.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="flex-1"
                                  onClick={() => handleApproveAffiliate(affiliate.id)}
                                >
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                              )}
                              {affiliate.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuspendAffiliate(affiliate.id)}
                                  className="text-destructive"
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              )}
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
              <DialogTitle>Edit Affiliate</DialogTitle>
              <DialogDescription>Update affiliate information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone (Optional)</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-website">Website (Optional)</Label>
                  <Input
                    id="edit-website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-affiliateCode">Affiliate Code</Label>
                  <Input
                    id="edit-affiliateCode"
                    value={formData.affiliateCode}
                    onChange={(e) => setFormData({ ...formData, affiliateCode: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="edit-commissionRate"
                    type="number"
                    value={formData.commissionRate || ""}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditAffiliate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
