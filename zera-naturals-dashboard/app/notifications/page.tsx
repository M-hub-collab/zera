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
import { Plus, MoreVertical, Send, Trash2, Bell, Mail, MessageSquare, Users, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  title: string
  message: string
  type: "email" | "push" | "sms" | "in-app"
  audience: "all" | "customers" | "affiliates" | "segment"
  segmentDetails?: string
  status: "draft" | "scheduled" | "sent" | "failed"
  scheduledFor?: string
  sentAt?: string
  recipients: number
  opened: number
  clicked: number
  createdAt: string
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Summer Sale Announcement",
    message: "Get 30% off on all skincare products this summer! Limited time offer.",
    type: "email",
    audience: "all",
    status: "sent",
    sentAt: "2025-01-20T10:00:00",
    recipients: 5420,
    opened: 3245,
    clicked: 1876,
    createdAt: "2025-01-19",
  },
  {
    id: "2",
    title: "New Product Launch",
    message: "Introducing our new organic face serum. Check it out now!",
    type: "push",
    audience: "customers",
    status: "sent",
    sentAt: "2025-01-22T14:30:00",
    recipients: 3890,
    opened: 2134,
    clicked: 987,
    createdAt: "2025-01-22",
  },
  {
    id: "3",
    title: "Affiliate Program Update",
    message: "New commission structure and bonuses available for top performers.",
    type: "email",
    audience: "affiliates",
    status: "sent",
    sentAt: "2025-01-23T09:00:00",
    recipients: 48,
    opened: 42,
    clicked: 38,
    createdAt: "2025-01-22",
  },
  {
    id: "4",
    title: "Cart Abandonment Reminder",
    message: "You left items in your cart! Complete your purchase and get 10% off.",
    type: "email",
    audience: "segment",
    segmentDetails: "Abandoned cart users",
    status: "scheduled",
    scheduledFor: "2025-01-26T18:00:00",
    recipients: 234,
    opened: 0,
    clicked: 0,
    createdAt: "2025-01-24",
  },
  {
    id: "5",
    title: "Weekly Newsletter",
    message: "This week's tips for natural skincare and wellness.",
    type: "email",
    audience: "all",
    status: "draft",
    recipients: 0,
    opened: 0,
    clicked: 0,
    createdAt: "2025-01-24",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "email" as "email" | "push" | "sms" | "in-app",
    audience: "all" as "all" | "customers" | "affiliates" | "segment",
    segmentDetails: "",
    scheduledFor: "",
  })

  const handleCreateNotification = (sendNow: boolean) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      audience: formData.audience,
      segmentDetails: formData.segmentDetails || undefined,
      status: sendNow ? "sent" : formData.scheduledFor ? "scheduled" : "draft",
      scheduledFor: formData.scheduledFor || undefined,
      sentAt: sendNow ? new Date().toISOString() : undefined,
      recipients: sendNow ? Math.floor(Math.random() * 5000) + 1000 : 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setNotifications([newNotification, ...notifications])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleDeleteNotification = (id: string) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      setNotifications(notifications.filter((notif) => notif.id !== id))
    }
  }

  const handleSendDraft = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              status: "sent",
              sentAt: new Date().toISOString(),
              recipients: Math.floor(Math.random() * 5000) + 1000,
            }
          : notif,
      ),
    )
  }

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "email",
      audience: "all",
      segmentDetails: "",
      scheduledFor: "",
    })
  }

  const filteredNotifications = notifications.filter(
    (notif) =>
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalSent = notifications.filter((n) => n.status === "sent").length
  const totalRecipients = notifications.reduce((acc, n) => acc + n.recipients, 0)
  const totalOpened = notifications.reduce((acc, n) => acc + n.opened, 0)
  const avgOpenRate = totalRecipients > 0 ? ((totalOpened / totalRecipients) * 100).toFixed(1) : "0.0"

  const getNotificationsByStatus = (status: string) => notifications.filter((n) => n.status === status)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "in-app":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Send and manage customer notifications</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>Send a notification to your customers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Sale Announcement"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your notification message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">{formData.message.length} characters</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Notification Type</Label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                    >
                      <option value="email">Email</option>
                      <option value="push">Push Notification</option>
                      <option value="sms">SMS</option>
                      <option value="in-app">In-App</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Audience</Label>
                    <select
                      id="audience"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      value={formData.audience}
                      onChange={(e) =>
                        setFormData({ ...formData, audience: e.target.value as typeof formData.audience })
                      }
                    >
                      <option value="all">All Users</option>
                      <option value="customers">Customers Only</option>
                      <option value="affiliates">Affiliates Only</option>
                      <option value="segment">Custom Segment</option>
                    </select>
                  </div>
                </div>
                {formData.audience === "segment" && (
                  <div className="space-y-2">
                    <Label htmlFor="segmentDetails">Segment Details</Label>
                    <Input
                      id="segmentDetails"
                      placeholder="e.g., Users who purchased in last 30 days"
                      value={formData.segmentDetails}
                      onChange={(e) => setFormData({ ...formData, segmentDetails: e.target.value })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to save as draft</p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={() => handleCreateNotification(false)}>
                  Save as Draft
                </Button>
                <Button onClick={() => handleCreateNotification(true)} disabled={!formData.title || !formData.message}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSent}</div>
              <p className="text-xs text-muted-foreground">Notifications sent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecipients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total reached</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Opened</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOpened.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total opens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgOpenRate}%</div>
              <p className="text-xs text-muted-foreground">Average rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different statuses */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({getNotificationsByStatus("sent").length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({getNotificationsByStatus("scheduled").length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({getNotificationsByStatus("draft").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>View and manage all notifications</CardDescription>
                <div className="pt-4">
                  <Input
                    placeholder="Search notifications..."
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
                      <TableHead>Notification</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Open Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => {
                      const openRate =
                        notification.recipients > 0
                          ? ((notification.opened / notification.recipients) * 100).toFixed(1)
                          : "0.0"
                      return (
                        <TableRow key={notification.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{notification.message}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(notification.type)}
                              <span className="capitalize">{notification.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="capitalize">{notification.audience}</p>
                              {notification.segmentDetails && (
                                <p className="text-xs text-muted-foreground">{notification.segmentDetails}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                notification.status === "sent"
                                  ? "default"
                                  : notification.status === "scheduled"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {notification.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{notification.recipients.toLocaleString()}</TableCell>
                          <TableCell>
                            {notification.status === "sent" ? (
                              <div>
                                <p className="font-medium">{openRate}%</p>
                                <p className="text-xs text-muted-foreground">
                                  {notification.opened} / {notification.recipients}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
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
                                {notification.status === "draft" && (
                                  <DropdownMenuItem onClick={() => handleSendDraft(notification.id)}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Now
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteNotification(notification.id)}
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

          {["sent", "scheduled", "draft"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{status} Notifications</CardTitle>
                  <CardDescription>Notifications with {status} status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getNotificationsByStatus(status).map((notification) => {
                      const openRate =
                        notification.recipients > 0
                          ? ((notification.opened / notification.recipients) * 100).toFixed(1)
                          : "0.0"
                      return (
                        <Card key={notification.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getTypeIcon(notification.type)}
                                  <h3 className="font-semibold">{notification.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span className="capitalize">{notification.audience}</span>
                                  </div>
                                  {notification.scheduledFor && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{new Date(notification.scheduledFor).toLocaleString()}</span>
                                    </div>
                                  )}
                                  {notification.sentAt && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                      <span>{new Date(notification.sentAt).toLocaleString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {notification.status === "draft" && (
                                    <DropdownMenuItem onClick={() => handleSendDraft(notification.id)}>
                                      <Send className="mr-2 h-4 w-4" />
                                      Send Now
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteNotification(notification.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {status === "sent" && (
                              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                                <div>
                                  <p className="text-xs text-muted-foreground">Recipients</p>
                                  <p className="text-lg font-semibold">{notification.recipients.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Opened</p>
                                  <p className="text-lg font-semibold">{notification.opened.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Open Rate</p>
                                  <p className="text-lg font-semibold">{openRate}%</p>
                                </div>
                              </div>
                            )}
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
      </main>
    </div>
  )
}
