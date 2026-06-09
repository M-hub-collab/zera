"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  label?: string
  href?: string
}

export function BackButton({ label = "Back to Dashboard", href }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.push("/")
    }
  }

  return (
    <Button variant="ghost" onClick={handleBack} className="mb-6 -ml-2 hover:bg-accent">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
