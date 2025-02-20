"use client"

import { useState, useEffect } from "react"
import { ISPComparisonTable } from "@/components/ISPComparisonTable"
import { ISPComparisonView } from "@/components/ISPComparisonView"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

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

export default function ISPComparisonPage() {
  const { toast } = useToast()
  const [isps, setIsps] = useState<ISPData[]>([])
  const [selectedISPs, setSelectedISPs] = useState<ISPData[]>([])
  const [loading, setLoading] = useState(true)

  const handleCompare = (selectedIds: string[]) => {
    const selected = isps.filter(isp => selectedIds.includes(isp.id))
    setSelectedISPs(selected)
  }

  // Fetch ISPs when location changes
  useEffect(() => {
    async function fetchISPs() {
      try {
        const response = await fetch("/api/isp/metrics")
        if (!response.ok) throw new Error("Failed to fetch ISPs")
        
        const data = await response.json()
        setIsps(data.metrics.map((metric: any) => ({
          id: metric.id,
          isp: metric.isp,
          avgDownload: metric.avgDownload,
          avgUpload: metric.avgUpload,
          avgPing: metric.avgPing,
          reliability: metric.reliability || 0.95, // Default reliability if not provided
          testCount: metric.testCount,
          pricing: {
            basic: 49.99, // Example pricing - this should come from the API
            standard: 69.99,
            premium: 89.99,
          },
          features: [
            "Unlimited Data",
            "No Contract",
            "Free Installation",
            "WiFi Router Included",
          ], // Example features - this should come from the API
          coverage: 0.85, // Example coverage - this should come from the API
        })))
      } catch (error) {
        console.error("Failed to fetch ISPs:", error)
        toast({
          title: "Error",
          description: "Failed to load ISP data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchISPs()
  }, [toast])

  if (loading) {
    return <div>Loading ISP data...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Compare Internet Service Providers
        </h1>
        <p className="text-muted-foreground mb-8">
          Find the best ISP for your needs with our detailed comparison tools.
        </p>

        {/* Main comparison table */}
        <ISPComparisonTable
          isps={isps}
          onCompare={handleCompare}
        />

        {/* Side-by-side comparison view */}
        {selectedISPs.length >= 2 && (
          <div className="mt-8">
            <ISPComparisonView isps={selectedISPs} />
          </div>
        )}
      </div>
    </div>
  )
} 