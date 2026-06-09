"use client"

import { useState, useMemo } from "react"
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
import { Plus, MoreVertical, Pencil, Trash2, Package, Eye, EyeOff, ChevronRight, FolderTree, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CategoryLevel = "parent" | "sub" | "subsub"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  level: CategoryLevel
  parentId: string | null
  productCount: number
  status: "active" | "inactive"
  createdAt: string
}

const initialCategories: Category[] = [
  { id: "1", name: "Skincare", slug: "skincare", description: "Natural and organic skincare products", level: "parent", parentId: null, productCount: 45, status: "active", createdAt: "2024-01-15" },
  { id: "2", name: "Haircare", slug: "haircare", description: "Herbal and natural hair care solutions", level: "parent", parentId: null, productCount: 32, status: "active", createdAt: "2024-01-20" },
  { id: "3", name: "Body Care", slug: "body-care", description: "Nourishing body lotions, oils and treatments", level: "parent", parentId: null, productCount: 28, status: "active", createdAt: "2024-02-01" },
  { id: "4", name: "Essential Oils", slug: "essential-oils", description: "Pure essential oils for aromatherapy", level: "parent", parentId: null, productCount: 24, status: "active", createdAt: "2024-02-10" },
  { id: "5", name: "Supplements", slug: "supplements", description: "Natural health supplements and vitamins", level: "parent", parentId: null, productCount: 18, status: "inactive", createdAt: "2024-02-15" },
  { id: "6", name: "Face Care", slug: "face-care", description: "Face cleansers, toners and moisturizers", level: "sub", parentId: "1", productCount: 20, status: "active", createdAt: "2024-03-01" },
  { id: "7", name: "Eye Care", slug: "eye-care", description: "Serums and creams for eye area", level: "sub", parentId: "1", productCount: 10, status: "active", createdAt: "2024-03-05" },
  { id: "8", name: "Shampoos", slug: "shampoos", description: "Natural shampoos for all hair types", level: "sub", parentId: "2", productCount: 15, status: "active", createdAt: "2024-03-10" },
  { id: "9", name: "Conditioners", slug: "conditioners", description: "Deep conditioning hair treatments", level: "sub", parentId: "2", productCount: 12, status: "active", createdAt: "2024-03-12" },
  { id: "10", name: "Anti-Aging Serums", slug: "anti-aging-serums", description: "Targeted anti-aging treatments", level: "subsub", parentId: "6", productCount: 8, status: "active", createdAt: "2024-04-01" },
  { id: "11", name: "Brightening Creams", slug: "brightening-creams", description: "Skin brightening moisturizers", level: "subsub", parentId: "6", productCount: 7, status: "active", createdAt: "2024-04-05" },
  { id: "12", name: "Under Eye Gels", slug: "under-eye-gels", description: "Cooling gels for dark circles", level: "subsub", parentId: "7", productCount: 5, status: "active", createdAt: "2024-04-10" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    level: "parent" as CategoryLevel,
    parentId: "",
    status: "active" as "active" | "inactive",
  })

  const parentCategories = useMemo(() => categories.filter((c) => c.level === "parent"), [categories])
  const subCategories = useMemo(() => categories.filter((c) => c.level === "sub"), [categories])

  const getParentOptions = () => {
    if (formData.level === "sub") return parentCategories
    if (formData.level === "subsub") return subCategories
    return []
  }

  const getParentName = (id: string | null) => {
    if (!id) return "—"
    return categories.find((c) => c.id === id)?.name ?? "—"
  }

  const getBreadcrumb = (cat: Category): string => {
    if (cat.level === "parent") return cat.name
    if (cat.level === "sub") {
      const parent = categories.find((c) => c.id === cat.parentId)
      return `${parent?.name ?? "?"} › ${cat.name}`
    }
    const sub = categories.find((c) => c.id === cat.parentId)
    const parent = sub ? categories.find((c) => c.id === sub.parentId) : null
    return `${parent?.name ?? "?"} › ${sub?.name ?? "?"} › ${cat.name}`
  }

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      level: formData.level,
      parentId: formData.parentId || null,
      productCount: 0,
      status: formData.status,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCategories([...categories, newCategory])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCategory = () => {
    if (!selectedCategory) return
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, name: formData.name, slug: formData.slug, description: formData.description, status: formData.status }
          : cat,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedCategory(null)
    resetForm()
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure? Child categories will also be removed.")) {
      const toDelete = new Set<string>()
      const collect = (pid: string) => {
        toDelete.add(pid)
        categories.filter((c) => c.parentId === pid).forEach((c) => collect(c.id))
      }
      collect(id)
      setCategories(categories.filter((cat) => !toDelete.has(cat.id)))
    }
  }

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map((cat) => cat.id === id ? { ...cat, status: cat.status === "active" ? "inactive" : "active" } : cat))
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setFormData({ name: category.name, slug: category.slug, description: category.description, level: category.level, parentId: category.parentId ?? "", status: category.status })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", level: "parent", parentId: "", status: "active" })
  }

  const filteredCategories = categories.filter(
    (cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const levelLabel: Record<CategoryLevel, string> = { parent: "Parent", sub: "Sub", subsub: "Sub-Sub" }
  const levelVariant: Record<CategoryLevel, "default" | "secondary" | "outline"> = { parent: "default", sub: "secondary", subsub: "outline" }

  // Build tree for category map
  const tree = useMemo(() => {
    return parentCategories.map((parent) => {
      const subs = subCategories.filter((s) => s.parentId === parent.id).map((sub) => ({
        ...sub,
        children: categories.filter((c) => c.level === "subsub" && c.parentId === sub.id),
      }))
      return { ...parent, children: subs }
    })
  }, [categories, parentCategories, subCategories])

  const CategoryForm = ({ prefix = "" }: { prefix?: string }) => (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Category Level *</Label>
        <select
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value as CategoryLevel, parentId: "" })}
        >
          <option value="parent">Parent Category</option>
          <option value="sub">Sub Category</option>
          <option value="subsub">Sub-Sub Category</option>
        </select>
      </div>

      {formData.level !== "parent" && (
        <div className="space-y-2">
          <Label>{formData.level === "sub" ? "Parent Category *" : "Sub Category (Parent) *"}</Label>
          <select
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
          >
            <option value="">Select {formData.level === "sub" ? "parent" : "sub"} category</option>
            {getParentOptions().map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}name`}>Category Name *</Label>
          <Input
            id={`${prefix}name`}
            placeholder="e.g., Face Care"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}slug`}>Slug</Label>
          <Input
            id={`${prefix}slug`}
            placeholder="e.g., face-care"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Auto-generated if empty</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}description`}>Description</Label>
        <Textarea
          id={`${prefix}description`}
          placeholder="Describe this category..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <select
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage parent, sub, and sub-sub product categories</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a parent, sub, or sub-sub category</DialogDescription>
              </DialogHeader>
              <div className="max-h-[65vh] overflow-y-auto pr-1">
                <CategoryForm prefix="add-" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCategory} disabled={!formData.name || (formData.level !== "parent" && !formData.parentId)}>
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Categories", value: categories.length, sub: `${categories.filter(c => c.status === "active").length} active` },
            { label: "Parent Categories", value: parentCategories.length, sub: "Top-level" },
            { label: "Sub Categories", value: subCategories.length, sub: "Second level" },
            { label: "Sub-Sub Categories", value: categories.filter(c => c.level === "subsub").length, sub: "Third level" },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-1.5">
              <List className="h-3.5 w-3.5" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-1.5">
              <FolderTree className="h-3.5 w-3.5" />
              Category Map
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>All Categories</CardTitle>
                <CardDescription>View and manage all product categories across all levels</CardDescription>
                <div className="pt-4">
                  <Input
                    placeholder="Search categories..."
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
                      <TableHead>Category</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={levelVariant[category.level]}>{levelLabel[category.level]}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{getBreadcrumb(category)}</span>
                        </TableCell>
                        <TableCell>{category.productCount}</TableCell>
                        <TableCell>
                          <Badge variant={category.status === "active" ? "default" : "secondary"}>{category.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                <Pencil className="mr-2 h-4 w-4" />Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(category.id)}>
                                {category.status === "active" ? <><EyeOff className="mr-2 h-4 w-4" />Deactivate</> : <><Eye className="mr-2 h-4 w-4" />Activate</>}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Map */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Category Map</CardTitle>
                <CardDescription>Visual hierarchy of all categories — parent › sub › sub-sub</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tree.map((parent) => (
                    <div key={parent.id} className="border border-border rounded-lg overflow-hidden">
                      {/* Parent row */}
                      <div className="flex items-center justify-between px-4 py-3 bg-primary/8 dark:bg-primary/10">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="font-semibold text-sm">{parent.name}</span>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{parent.slug}</code>
                          <Badge variant={parent.status === "active" ? "default" : "secondary"} className="text-xs">{parent.status}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{parent.productCount} products · {parent.children.length} subs</span>
                      </div>

                      {parent.children.length > 0 && (
                        <div className="divide-y divide-border/50">
                          {parent.children.map((sub) => (
                            <div key={sub.id}>
                              {/* Sub row */}
                              <div className="flex items-center justify-between px-4 py-2.5 pl-10 bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                  <span className="text-sm font-medium">{sub.name}</span>
                                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{sub.slug}</code>
                                  <Badge variant={sub.status === "active" ? "default" : "secondary"} className="text-xs">{sub.status}</Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">{sub.productCount} products · {sub.children.length} sub-subs</span>
                              </div>

                              {/* Sub-sub rows */}
                              {sub.children.map((ss) => (
                                <div key={ss.id} className="flex items-center justify-between px-4 py-2 pl-20 bg-background border-t border-border/30">
                                  <div className="flex items-center gap-3">
                                    <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                                    <ChevronRight className="h-3 w-3 text-muted-foreground/50 -ml-2 shrink-0" />
                                    <span className="text-sm text-muted-foreground">{ss.name}</span>
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{ss.slug}</code>
                                    <Badge variant={ss.status === "active" ? "default" : "secondary"} className="text-xs">{ss.status}</Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{ss.productCount} products</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {parent.children.length === 0 && (
                        <div className="px-10 py-3 text-xs text-muted-foreground italic">No sub-categories yet</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Category Name *</Label>
                  <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input id="edit-slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditCategory}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
