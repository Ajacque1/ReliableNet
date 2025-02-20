"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Complex {
  id: string
  name: string
  address: string
  city: string
  state: string
  avgRating: number
  avgInternetRating: number
}

export function ComplexList() {
  const [complexes, setComplexes] = useState<Complex[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: "",
    state: ""
  })
  const { toast } = useToast()

  const fetchComplexes = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.city) params.append("city", filters.city)
      if (filters.state) params.append("state", filters.state)

      const res = await fetch(`/api/complexes?${params}`)
      const data = await res.json()
      setComplexes(data.complexes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch apartment complexes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplexes()
  }, [filters])

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
        />
        <Input
          placeholder="State"
          value={filters.state}
          onChange={(e) => setFilters(f => ({ ...f, state: e.target.value }))}
        />
      </div>

      {/* Complex List */}
      <div className="grid gap-4">
        {complexes.map((complex) => (
          <Card key={complex.id}>
            <CardHeader>
              <CardTitle>{complex.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{complex.address}</p>
              <p className="text-sm text-gray-600">
                {complex.city}, {complex.state}
              </p>
              <div className="mt-4 flex justify-between">
                <div>
                  <p className="text-sm font-medium">Overall Rating</p>
                  <p className="text-2xl font-bold">{complex.avgRating.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Internet Rating</p>
                  <p className="text-2xl font-bold">{complex.avgInternetRating.toFixed(1)}</p>
                </div>
                <Link href={`/complexes/${complex.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 