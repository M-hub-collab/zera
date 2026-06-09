"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Analytics", href: "/analytics" },
  { name: "Orders", href: "/orders" },
  { name: "Products", href: "/products" },
  { name: "Warehouse", href: "/warehouse" },
  { name: "Categories", href: "/categories" },
  { name: "Ad Banners", href: "/banners" },
  { name: "Notifications", href: "/notifications" },
  { name: "Coupons", href: "/coupons" },
  { name: "Affiliates", href: "/affiliates" },
]

export function Header() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  const handleLogout = () => {
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo row */}
      <div className="border-b border-border/50">
        <div className="container flex h-14 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image src="/logo.png" alt="Zera Naturals" fill className="object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-wide text-foreground">ZERA</span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">Naturals</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    A
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Navigation strip */}
      <div className="bg-primary/5 dark:bg-primary/10">
        <div className="container px-6">
          <nav className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative shrink-0 px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap border-b-2",
                  pathname === item.href
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
