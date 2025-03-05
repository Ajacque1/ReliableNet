"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

interface ReviewFilters {
  sortBy: string
  minRating: number
  minPeakHourRating: number | null
  hasPeakHourData: boolean
  peakHourStart?: number
  peakHourEnd?: number
  minDownloadSpeed?: number
  maxPing?: number
  maxPacketLoss?: number
}

interface ReviewFiltersProps {
  onFiltersChange: (filters: ReviewFilters) => void
}

export function ReviewFilters({ onFiltersChange }: ReviewFiltersProps) {
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: "recent",
    minRating: 0,
    minPeakHourRating: null,
    hasPeakHourData: false,
    peakHourStart: undefined,
    peakHourEnd: undefined,
    minDownloadSpeed: undefined,
    maxPing: undefined,
    maxPacketLoss: undefined
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters = {
      sortBy: "recent",
      minRating: 0,
      minPeakHourRating: null,
      hasPeakHourData: false,
      peakHourStart: undefined,
      peakHourEnd: undefined,
      minDownloadSpeed: undefined,
      maxPing: undefined,
      maxPacketLoss: undefined
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
    setShowAdvanced(false)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="font-medium">Filter Reviews</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="peakRating">Best Peak Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Basic Filters */}
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <Select
              value={filters.minRating.toString()}
              onValueChange={(value) => handleFilterChange("minRating", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="5">5 Stars Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Peak Hour Toggle */}
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Show Peak Hour Data Only</Label>
            <Switch
              checked={filters.hasPeakHourData}
              onCheckedChange={(checked) => handleFilterChange("hasPeakHourData", checked)}
            />
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Filters
          </Button>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              {/* Peak Hour Rating */}
              <div className="space-y-2">
                <Label>Minimum Peak Hour Rating</Label>
                <Select
                  value={filters.minPeakHourRating?.toString() || ""}
                  onValueChange={(value) => handleFilterChange("minPeakHourRating", value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Peak Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Peak Start Hour</Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={filters.peakHourStart || ""}
                    onChange={(e) => handleFilterChange("peakHourStart", e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Any"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Peak End Hour</Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={filters.peakHourEnd || ""}
                    onChange={(e) => handleFilterChange("peakHourEnd", e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Any"
                  />
                </div>
              </div>

              {/* Performance Thresholds */}
              <div className="space-y-2">
                <Label>Minimum Download Speed (Mbps)</Label>
                <Input
                  type="number"
                  min="0"
                  value={filters.minDownloadSpeed || ""}
                  onChange={(e) => handleFilterChange("minDownloadSpeed", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Any"
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Ping (ms)</Label>
                <Input
                  type="number"
                  min="0"
                  value={filters.maxPing || ""}
                  onChange={(e) => handleFilterChange("maxPing", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Any"
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Packet Loss (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxPacketLoss || ""}
                  onChange={(e) => handleFilterChange("maxPacketLoss", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Any"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 