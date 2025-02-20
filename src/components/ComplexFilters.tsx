"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X } from "lucide-react"

interface Filters {
  query: string
  city: string
  state: string
  amenities: string[]
  hasISP: boolean
}

interface ComplexFiltersProps {
  onFiltersChange: (filters: Filters) => void
  defaultAmenities: string[]
}

export function ComplexFilters({ onFiltersChange, defaultAmenities }: ComplexFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    city: "",
    state: "",
    amenities: [],
    hasISP: false
  })

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity]
    handleFilterChange('amenities', newAmenities)
  }

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      city: "",
      state: "",
      amenities: [],
      hasISP: false
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.query || filters.city || filters.state || 
    filters.amenities.length > 0 || filters.hasISP

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Search & Filter</CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Clear
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Search complexes..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="flex-1"
            />
            <Button variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Location */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="City"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
            <Input
              placeholder="State"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Internet & Tech Amenities
            </label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {defaultAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 text-sm"
                >
                  <Checkbox
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ISP Filter */}
          <div>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={filters.hasISP}
                onCheckedChange={(checked) => 
                  handleFilterChange('hasISP', checked)
                }
              />
              <span className="text-sm font-medium">
                Has Internet Service Provider
              </span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 