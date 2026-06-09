import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, DollarSign, ShoppingCart } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "2,350",
    change: "+180 from last month",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "156",
    change: "+12 new products",
    icon: Package,
  },
  {
    title: "Active Affiliates",
    value: "48",
    change: "+8 this month",
    icon: Users,
  },
]

const recentOrders = [
  { id: "ORD-001", product: "Organic Face Cream", amount: "$49.99", status: "Completed" },
  { id: "ORD-002", product: "Natural Body Lotion", amount: "$29.99", status: "Processing" },
  { id: "ORD-003", product: "Herbal Shampoo", amount: "$24.99", status: "Completed" },
  { id: "ORD-004", product: "Essential Oil Set", amount: "$89.99", status: "Pending" },
  { id: "ORD-005", product: "Organic Soap Bar", amount: "$12.99", status: "Completed" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Zera Naturals</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{order.product}</p>
                      <p className="text-xs text-muted-foreground">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <p className="font-medium">Add New Product</p>
                <p className="text-xs text-muted-foreground">Create a new product listing</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <p className="font-medium">Create Coupon</p>
                <p className="text-xs text-muted-foreground">Generate discount codes</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <p className="font-medium">Send Notification</p>
                <p className="text-xs text-muted-foreground">Notify customers</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
