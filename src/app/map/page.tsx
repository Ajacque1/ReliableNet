"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component with no SSR
const DynamicMap = dynamic(
  () => import("@/components/ApartmentComplexMap").then(mod => mod.ApartmentComplexMap),
  { 
    ssr: false,
    loading: () => (
      <Card className="h-[600px] flex items-center justify-center">
        <p>Loading map...</p>
      </Card>
    )
  }
)

interface ApartmentComplex {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  isps: {
    ispMetric: {
      isp: string
      avgDownload: number
    }
  }[]
}

export default function MapPage() {
  const [complexes, setComplexes] = useState<ApartmentComplex[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComplexes()
  }, [])

  const fetchComplexes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/complexes")
      if (!response.ok) {
        throw new Error("Failed to fetch apartment complexes")
      }
      const data = await response.json()
      setComplexes(data.complexes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const filteredComplexes = complexes.filter((complex) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      complex.name.toLowerCase().includes(searchLower) ||
      complex.address.toLowerCase().includes(searchLower) ||
      complex.city.toLowerCase().includes(searchLower) ||
      complex.state.toLowerCase().includes(searchLower)
    )
  })

  // Calculate the center based on the average of all complex coordinates
  const center: [number, number] = complexes.length > 0
    ? [
        complexes.reduce((sum, c) => sum + c.latitude, 0) / complexes.length,
        complexes.reduce((sum, c) => sum + c.longitude, 0) / complexes.length,
      ]
    : [37.7749, -122.4194] // Default to San Francisco

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="h-[600px] flex items-center justify-center">
          <p>Loading map...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="h-[600px] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search by name, address, city, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xl"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <DynamicMap
        complexes={filteredComplexes}
        center={center}
        zoom={12}
      />
    </div>
  )
} 