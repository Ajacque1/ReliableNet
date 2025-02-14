"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, Clock, Signal } from "lucide-react"
import { ISPCoverageMap } from './ISPCoverageMap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarIcon } from "lucide-react"
import { ISPDetailedStats } from "./ISPDetailedStats"
import { ISPReviews } from "./ISPReviews"

interface ISPMetrics {
  isp: string
  avgDownload: number
  avgUpload: number
  avgPing: number
  testCount: number
  city?: string
  state?: string
}

interface ISPReview {
  id: string
  rating: number
  comment: string
  pros: string[]
  cons: string[]
  createdAt: string
  user: {
    name: string
  }
}

export function ISPComparison() {
  const [metrics, setMetrics] = useState<ISPMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{city?: string, state?: string} | null>(null)
  const [selectedISP, setSelectedISP] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ISPReview[]>([])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const locationParams = location 
          ? `?city=${location.city}&state=${location.state}` 
          : '';
        
        const response = await fetch(`/api/isp/metrics${locationParams}`);
        if (!response.ok) throw new Error('Failed to fetch ISP metrics');
        
        const data = await response.json();
        setMetrics(data.metrics);
      } catch (error) {
        console.error('Error fetching ISP metrics:', error);
        setError('Failed to load ISP comparison data');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [location]);

  if (loading) return <div>Loading ISP comparisons...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((isp) => (
          <Card key={isp.isp}>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-primary" />
                    <span className="text-sm">Download</span>
                  </div>
                  <span className="font-medium">{isp.avgDownload.toFixed(1)} Mbps</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <span className="text-sm">Upload</span>
                  </div>
                  <span className="font-medium">{isp.avgUpload.toFixed(1)} Mbps</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ping</span>
                  </div>
                  <span className="font-medium">{isp.avgPing.toFixed(0)} ms</span>
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  Based on {isp.testCount} tests
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedISP && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{selectedISP}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Detailed Stats</TabsTrigger>
                <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <ISPDetailedStats
                  ispId={selectedISP}
                  city={location?.city}
                  state={location?.state}
                />
              </TabsContent>
              
              <TabsContent value="coverage">
                <ISPCoverageMap 
                  ispName={selectedISP}
                  city={location?.city}
                  state={location?.state}
                />
              </TabsContent>
              
              <TabsContent value="reviews">
                <ISPReviews ispMetricId={selectedISP} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 