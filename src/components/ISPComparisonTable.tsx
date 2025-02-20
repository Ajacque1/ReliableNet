"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Wifi, Download, Upload, Clock, DollarSign, Signal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface ISPData {
  id: string
  isp: string
  avgDownload: number
  avgUpload: number
  avgPing: number
  reliability: number
  testCount: number
  pricing?: {
    basic?: number
    standard?: number
    premium?: number
  }
  features?: string[]
  coverage: number
}

interface ISPComparisonTableProps {
  isps: ISPData[]
  onCompare?: (selectedIsps: string[]) => void
}

export function ISPComparisonTable({ isps, onCompare }: ISPComparisonTableProps) {
  const [filters, setFilters] = useState({
    minSpeed: "",
    maxPrice: "",
    reliability: "",
    features: [] as string[],
  })
  const [selectedISPs, setSelectedISPs] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("avgDownload")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Get unique features across all ISPs
  const allFeatures = Array.from(
    new Set(isps.flatMap(isp => isp.features || []))
  )

  // Apply filters and sorting
  const filteredISPs = isps
    .filter(isp => {
      if (filters.minSpeed && isp.avgDownload < parseFloat(filters.minSpeed)) {
        return false
      }
      if (filters.maxPrice && isp.pricing?.standard && 
          isp.pricing.standard > parseFloat(filters.maxPrice)) {
        return false
      }
      if (filters.reliability && isp.reliability < parseFloat(filters.reliability)) {
        return false
      }
      if (filters.features.length > 0) {
        return filters.features.every(feature => 
          isp.features?.includes(feature)
        )
      }
      return true
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof ISPData]
      const bValue = b[sortBy as keyof ISPData]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })

  const handleCompare = () => {
    if (onCompare && selectedISPs.length >= 2) {
      onCompare(selectedISPs)
    }
  }

  const toggleISPSelection = (ispId: string) => {
    setSelectedISPs(prev => {
      if (prev.includes(ispId)) {
        return prev.filter(id => id !== ispId)
      }
      if (prev.length < 3) { // Limit to 3 ISPs for comparison
        return [...prev, ispId]
      }
      return prev
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Min Download Speed (Mbps)
              </label>
              <Input
                type="number"
                value={filters.minSpeed}
                onChange={(e) => setFilters(prev => ({ ...prev, minSpeed: e.target.value }))}
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Max Monthly Price ($)
              </label>
              <Input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                placeholder="e.g., 80"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Min Reliability (%)
              </label>
              <Input
                type="number"
                value={filters.reliability}
                onChange={(e) => setFilters(prev => ({ ...prev, reliability: e.target.value }))}
                placeholder="e.g., 95"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Sort By
              </label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avgDownload">Download Speed</SelectItem>
                  <SelectItem value="avgUpload">Upload Speed</SelectItem>
                  <SelectItem value="avgPing">Ping</SelectItem>
                  <SelectItem value="reliability">Reliability</SelectItem>
                  <SelectItem value="coverage">Coverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features Filter */}
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">
              Features
            </label>
            <div className="flex flex-wrap gap-4">
              {allFeatures.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={filters.features.includes(feature)}
                    onCheckedChange={(checked: boolean) => {
                      setFilters(prev => ({
                        ...prev,
                        features: checked
                          ? [...prev.features, feature]
                          : prev.features.filter(f => f !== feature)
                      }))
                    }}
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ISP List */}
      <div className="space-y-4">
        {filteredISPs.map((isp) => (
          <Card
            key={isp.id}
            className={`transition-colors ${
              selectedISPs.includes(isp.id)
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedISPs.includes(isp.id)}
                    onCheckedChange={() => toggleISPSelection(isp.id)}
                    disabled={
                      !selectedISPs.includes(isp.id) &&
                      selectedISPs.length >= 3
                    }
                  />
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Wifi className="h-5 w-5 mr-2 text-primary" />
                      {isp.isp}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Based on {isp.testCount} speed tests
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {isp.pricing?.standard && (
                    <p className="text-lg font-bold flex items-center justify-end">
                      <DollarSign className="h-4 w-4 text-primary" />
                      {isp.pricing.standard}/mo
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Standard plan
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </p>
                  <p className="text-lg font-semibold">
                    {isp.avgDownload.toFixed(1)} Mbps
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </p>
                  <p className="text-lg font-semibold">
                    {isp.avgUpload.toFixed(1)} Mbps
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Ping
                  </p>
                  <p className="text-lg font-semibold">
                    {isp.avgPing.toFixed(0)} ms
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Signal className="h-4 w-4 mr-1" />
                    Reliability
                  </p>
                  <p className="text-lg font-semibold">
                    {(isp.reliability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {isp.features && isp.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {isp.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compare Button */}
      {selectedISPs.length >= 2 && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleCompare}
          >
            Compare Selected ISPs
          </Button>
        </div>
      )}
    </div>
  )
} 