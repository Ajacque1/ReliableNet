"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft } from "lucide-react"
import { TipsList } from "@/components/TipsList"

interface TipCategory {
  id: string
  name: string
  description: string | null
  slug: string
}

export default function CategoryTipsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [category, setCategory] = useState<TipCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchCategory()
    }
  }, [params.slug])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/tips/categories/${params.slug}`)
      if (!response.ok) throw new Error("Failed to fetch category")
      
      const data = await response.json()
      setCategory(data.category)
    } catch (error) {
      console.error("Failed to fetch category:", error)
      toast({
        title: "Error",
        description: "Failed to load category",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading category...</div>
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/help")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/help")}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tips & Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <TipsList categoryId={category.id} searchQuery="" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 