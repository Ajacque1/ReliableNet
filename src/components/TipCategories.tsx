"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Lightbulb } from "lucide-react"

interface TipCategory {
  id: string
  name: string
  description: string | null
  slug: string
  _count: {
    tips: number
  }
}

export function TipCategories() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<TipCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/tips/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast({
        title: "Error",
        description: "Failed to load tip categories",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading categories...</div>
  }

  if (!categories.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No categories available
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="cursor-pointer transition-all hover:shadow-md"
          onClick={() => router.push(`/help/tips/${category.slug}`)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {category.description}
            </p>
            <Badge variant="secondary">
              {category._count.tips} {category._count.tips === 1 ? "tip" : "tips"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 