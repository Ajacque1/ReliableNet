"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ApartmentComplexDetails } from "@/components/ApartmentComplexDetails"
import { useToast } from "@/components/ui/use-toast"

export default function ComplexDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [complex, setComplex] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComplex() {
      try {
        const response = await fetch(`/api/complexes/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch complex")
        
        const data = await response.json()
        setComplex(data.complex)
      } catch (error) {
        console.error("Failed to fetch complex:", error)
        toast({
          title: "Error",
          description: "Failed to load apartment complex",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchComplex()
    }
  }, [params.id, toast])

  const handleEdit = () => {
    router.push(`/complexes/${params.id}/edit`)
  }

  if (loading) {
    return <div>Loading complex details...</div>
  }

  if (!complex) {
    return <div>Complex not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <ApartmentComplexDetails
          complex={complex}
          onEdit={handleEdit}
        />
      </div>
    </div>
  )
} 