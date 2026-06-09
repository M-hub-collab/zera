"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, TrendingUp, MapPin } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type WarehouseLocation = {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  pincode: string
  state: string
  country: string
  email: string
  isDefault: boolean
  capacity: number
  currentStock: number
  status: "operational" | "maintenance" | "full"
  products: number
}

type StockMovement = {
  id: string
  productName: string
  warehouse: string
  type: "in" | "out" | "transfer"
  quantity: number
  date: string
  reference: string
}

const initialWarehouses: WarehouseLocation[] = [
  {
    id: "1",
    name: "Main Warehouse - North",
    phone: "+91 11 2345 6789",
    addressLine1: "Plot No. 45, Sector 18",
    addressLine2: "Industrial Area",
    city: "Delhi",
    pincode: "110001",
    state: "Delhi",
    country: "India",
    email: "delhi@zeranaturals.com",
    isDefault: true,
    capacity: 10000,
    currentStock: 7250,
    status: "operational",
    products: 145,
  },
  {
    id: "2",
    name: "Distribution Center - South",
    phone: "+91 80 2345 6789",
    addressLine1: "Building 12, Tech Park",
    city: "Bangalore",
    pincode: "560001",
    state: "Karnataka",
    country: "India",
    email: "bangalore@zeranaturals.com",
    isDefault: false,
    capacity: 8000,
    currentStock: 5120,
    status: "operational",
    products: 98,
  },
  {
    id: "3",
    name: "Regional Hub - West",
    phone: "+91 22 2345 6789",
    addressLine1: "Warehouse Complex, Andheri East",
    city: "Mumbai",
    pincode: "400001",
    state: "Maharashtra",
    country: "India",
    email: "mumbai@zeranaturals.com",
    isDefault: false,
    capacity: 6000,
    currentStock: 5890,
    status: "operational",
    products: 112,
  },
  {
    id: "4",
    name: "Fulfillment Center - East",
    phone: "+91 33 2345 6789",
    addressLine1: "Salt Lake Sector V",
    city: "Kolkata",
    pincode: "700091",
    state: "West Bengal",
    country: "India",
    email: "kolkata@zeranaturals.com",
    isDefault: false,
    capacity: 5000,
    currentStock: 3200,
    status: "operational",
    products: 87,
  },
]

const initialMovements: StockMovement[] = [
  {
    id: "1",
    productName: "Organic Lavender Face Serum",
    warehouse: "Main Warehouse - North",
    type: "in",
    quantity: 50,
    date: "2024-01-20",
    reference: "PO-2024-001",
  },
  {
    id: "2",
    productName: "Argan Oil Hair Treatment",
    warehouse: "Distribution Center - South",
    type: "out",
    quantity: 30,
    date: "2024-01-19",
    reference: "SO-2024-045",
  },
  {
    id: "3",
    productName: "Shea Butter Body Cream",
    warehouse: "Main Warehouse - North",
    type: "transfer",
    quantity: 25,
    date: "2024-01-18",
    reference: "TR-2024-012",
  },
  {
    id: "4",
    productName: "Tea Tree Essential Oil",
    warehouse: "Regional Hub - West",
    type: "in",
    quantity: 100,
    date: "2024-01-17",
    reference: "PO-2024-002",
  },
  {
    id: "5",
    productName: "Turmeric Glow Capsules",
    warehouse: "Fulfillment Center - East",
    type: "out",
    quantity: 15,
    date: "2024-01-16",
    reference: "SO-2024-046",
  },
]

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>(initialWarehouses)
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false)
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false)
  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    email: "",
    isDefault: false,
    capacity: 5000,
  })

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.pincode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0)
  const totalStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0)
  const utilizationRate = ((totalStock / totalCapacity) * 100).toFixed(1)
  const warehousesNearCapacity = warehouses.filter((w) => w.currentStock / w.capacity > 0.85).length

  const handleAddWarehouse = () => {
    const newWarehouse: WarehouseLocation = {
      id: (warehouses.length + 1).toString(),
      ...warehouseForm,
      currentStock: 0,
      status: "operational",
      products: 0,
    }
    setWarehouses([...warehouses, newWarehouse])
    setIsAddWarehouseOpen(false)
    setWarehouseForm({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      pincode: "",
      state: "",
      country: "India",
      email: "",
      isDefault: false,
      capacity: 5000,
    })
  }

  const handleDeleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter((w) => w.id !== id))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Management</h1>
          <p className="text-muted-foreground">Monitor and manage warehouse operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Record Movement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
                <DialogDescription>Add a new stock movement entry</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label>Warehouse</Label>
                  <Input placeholder="Select warehouse" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input placeholder="In/Out/Transfer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reference</Label>
                  <Input placeholder="PO/SO/TR number" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMovementOpen(false)}>
                  Cancel
                </Button>
                <Button>Record Movement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddWarehouseOpen} onOpenChange={setIsAddWarehouseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Warehouse</DialogTitle>
                <DialogDescription>Add a new warehouse location for your products</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wh-name">
                      Warehouse Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="wh-name"
                      value={warehouseForm.name}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                      placeholder="Enter warehouse name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wh-phone">Phone</Label>
                    <Input
                      id="wh-phone"
                      value={warehouseForm.phone}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wh-address1">
                    Address Line 1 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="wh-address1"
                    value={warehouseForm.addressLine1}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, addressLine1: e.target.value })}
                    placeholder="Enter address line 1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wh-address2">Address Line 2</Label>
                  <Input
                    id="wh-address2"
                    value={warehouseForm.addressLine2}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, addressLine2: e.target.value })}
                    placeholder="Enter address line 2 (optional)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wh-city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="wh-city"
                      value={warehouseForm.city}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wh-pincode">
                      Pincode <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="wh-pincode"
                      value={warehouseForm.pincode}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, pincode: e.target.value })}
                      placeholder="Enter pincode"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wh-state">
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={warehouseForm.state}
                      onValueChange={(value) => setWarehouseForm({ ...warehouseForm, state: value })}
                    >
                      <SelectTrigger id="wh-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wh-country">
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={warehouseForm.country}
                      onValueChange={(value) => setWarehouseForm({ ...warehouseForm, country: value })}
                    >
                      <SelectTrigger id="wh-country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wh-email">Email</Label>
                    <Input
                      id="wh-email"
                      type="email"
                      value={warehouseForm.email}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wh-capacity">Capacity (units)</Label>
                  <Input
                    id="wh-capacity"
                    type="number"
                    value={warehouseForm.capacity}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, capacity: Number(e.target.value) })}
                    placeholder="5000"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wh-default"
                    checked={warehouseForm.isDefault}
                    onCheckedChange={(checked) => setWarehouseForm({ ...warehouseForm, isDefault: checked as boolean })}
                  />
                  <Label htmlFor="wh-default" className="text-sm font-normal cursor-pointer">
                    Set as default warehouse
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddWarehouseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWarehouse}>Add Warehouse</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground">Across {warehouses.length} locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{utilizationRate}% utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehousesNearCapacity}</div>
            <p className="text-xs text-muted-foreground">Above 85% capacity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="locations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="locations">Warehouse Locations</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Warehouse Locations</CardTitle>
                  <CardDescription>Manage all warehouse facilities</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search warehouses..."
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
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse) => {
                    const utilization = ((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)
                    const isNearCapacity = Number.parseFloat(utilization) > 85

                    return (
                      <TableRow key={warehouse.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{warehouse.name}</span>
                            {warehouse.isDefault && (
                              <Badge variant="outline" className="w-fit mt-1">
                                Default
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span>
                              {warehouse.city}, {warehouse.state}
                            </span>
                            <span className="text-muted-foreground">{warehouse.pincode}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span>{warehouse.phone}</span>
                            <span className="text-muted-foreground">{warehouse.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{warehouse.capacity.toLocaleString()}</TableCell>
                        <TableCell>{warehouse.currentStock.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={isNearCapacity ? "text-destructive font-semibold" : ""}>{utilization}%</span>
                        </TableCell>
                        <TableCell>{warehouse.products}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              warehouse.status === "operational"
                                ? "default"
                                : warehouse.status === "full"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {warehouse.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteWarehouse(warehouse.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>Track all inventory movements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{movement.productName}</TableCell>
                      <TableCell>{movement.warehouse}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            movement.type === "in" ? "default" : movement.type === "out" ? "secondary" : "outline"
                          }
                        >
                          {movement.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
