"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ISPCoverageMap } from "@/components/ISPCoverageMap"
import { ISPReviews } from "@/components/ISPReviews"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentLocation } from "@/lib/location"
import { Download, Upload, Clock, Signal } from "lucide-react"

interface ISPMetrics {
  id: string
  isp: string
  avgDownload: number
  avgUpload: number
  avgPing: number
  testCount: number
  reliability?: number
  city?: string
  state?: string
}

export default function IspComparison() {
  const { toast } = useToast()
  const [location, setLocation] = useState({
    city: "",
    state: ""
  })
  const [isps, setIsps] = useState<ISPMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedISP, setSelectedISP] = useState<string | null>(null)

  // Fetch ISPs when location changes
  useEffect(() => {
    async function fetchISPs() {
      try {
        if (!location.city || !location.state) return

        const params = new URLSearchParams({
          city: location.city,
          state: location.state
        })

        const response = await fetch(`/api/isp/available?${params}`)
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setIsps(data.isps)
        
        if (data.message) {
          toast({
            title: "Notice",
            description: data.message
          })
        }
      } catch (error) {
        console.error('Failed to fetch ISPs:', error)
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
  }, [location.city, location.state, toast])

  // Auto-detect location on mount
  useEffect(() => {
    async function detectLocation() {
      try {
        const locationData = await getCurrentLocation()
        if (locationData.city && locationData.state) {
          setLocation({
            city: locationData.city,
            state: locationData.state
          })
        }
      } catch (error) {
        console.error('Location detection failed:', error)
        toast({
          title: "Location Detection Failed",
          description: "Please enter your location manually",
          variant: "destructive"
        })
      }
    }

    detectLocation()
  }, [toast])

  const handleSearch = () => {
    setLoading(true)
    // Location state is already set, which will trigger the useEffect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Loading ISP Data...
        </h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Compare Internet Service Providers
      </h1>

      {/* Location Search */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="City"
            value={location.city}
            onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
          />
          <Input
            type="text"
            placeholder="State"
            value={location.state}
            onChange={(e) => setLocation(prev => ({ ...prev, state: e.target.value }))}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* ISP Comparison Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {isps.map((isp) => (
          <Card key={isp.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isp.isp}</span>
                <Signal className="h-5 w-5 text-primary" />
              </CardTitle>
              {isp.city && isp.state && (
                <p className="text-sm text-muted-foreground">
                  {isp.city}, {isp.state}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-primary" />
                    <span className="text-sm">Download</span>
                  </div>
                  <span className="font-medium">
                    {isp.avgDownload.toFixed(1)} Mbps
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <span className="text-sm">Upload</span>
                  </div>
                  <span className="font-medium">
                    {isp.avgUpload.toFixed(1)} Mbps
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ping</span>
                  </div>
                  <span className="font-medium">
                    {isp.avgPing.toFixed(0)} ms
                  </span>
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  Based on {isp.testCount} tests
                </div>
              </dl>

              <Button 
                className="w-full mt-6"
                onClick={() => setSelectedISP(isp.id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected ISP Details */}
      {selectedISP && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <Tabs defaultValue="reviews">
              <TabsList>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews">
                <ISPReviews ispMetricId={selectedISP} />
              </TabsContent>
              
              <TabsContent value="coverage">
                <ISPCoverageMap 
                  ispName={isps.find(isp => isp.id === selectedISP)?.isp || ""}
                  city={location.city}
                  state={location.state}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 