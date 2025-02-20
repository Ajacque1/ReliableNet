"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Building, Wifi, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ApartmentComplex {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  website?: string
  amenities: string[]
  reviews: { count: number }[]
  isps: {
    ispMetric: {
      id: string
      isp: string
      avgDownload: number
      avgUpload: number
      avgPing: number
    }
  }[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const defaultAmenities = [
  "Fiber Ready",
  "Free WiFi",
  "Ethernet Ports",
  "Cable Ready",
  "Smart Home Features",
]

export function ApartmentComplexList() {
  const { toast } = useToast()
  const [complexes, setComplexes] = useState<ApartmentComplex[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    query: "",
    amenities: [] as string[],
    hasISP: false,
  })

  const fetchComplexes = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.city && { city: filters.city }),
        ...(filters.state && { state: filters.state }),
        ...(filters.query && { query: filters.query }),
        ...(filters.hasISP && { hasISP: "true" }),
      })

      // Add amenities as multiple parameters
      filters.amenities.forEach(amenity => {
        params.append("amenities", amenity)
      })

      const response = await fetch(`/api/complexes?${params}`)
      if (!response.ok) throw new Error("Failed to fetch complexes")
      
      const data = await response.json()
      setComplexes(data.complexes)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Failed to fetch complexes:", error)
      toast({
        title: "Error",
        description: "Failed to load apartment complexes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters, toast])

  useEffect(() => {
    fetchComplexes()
  }, [fetchComplexes])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchComplexes()
  }

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  if (loading && complexes.length === 0) {
    return <div>Loading apartment complexes...</div>
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Search & Filter</span>
            <Link href="/complexes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Complex
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Search complexes..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              />
              <Input
                placeholder="City"
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              />
              <Input
                placeholder="State"
                value={filters.state}
                onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>

            {/* Amenities Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {defaultAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.amenities.includes(amenity)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Has ISP Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.hasISP}
                onCheckedChange={(checked) => 
                  setFilters(prev => ({ ...prev, hasISP: checked as boolean }))
                }
              />
              <label className="text-sm font-medium">
                Has Internet Service Provider
              </label>
            </div>

            <Button type="submit">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {complexes.map((complex) => (
          <Link key={complex.id} href={`/complexes/${complex.id}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      {complex.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {complex.address}, {complex.city}, {complex.state}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {complex.reviews[0]?.count || 0} reviews
                  </div>
                </div>

                {/* ISPs */}
                {complex.isps.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Available ISPs</h4>
                    <div className="space-y-2">
                      {complex.isps.map((isp) => (
                        <div
                          key={isp.ispMetric.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center">
                            <Wifi className="h-4 w-4 mr-1 text-primary" />
                            {isp.ispMetric.isp}
                          </span>
                          <span>
                            {isp.ispMetric.avgDownload.toFixed(0)} Mbps
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {complex.amenities.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {complex.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {complex.amenities.length > 3 && (
                        <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                          +{complex.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 