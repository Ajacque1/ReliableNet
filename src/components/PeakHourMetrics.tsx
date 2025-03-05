"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Download, Upload, Activity, Zap } from "lucide-react"

interface PeakHourMetricsProps {
  reviews: {
    peakHourRating: number | null
    peakHourStart: number | null
    peakHourEnd: number | null
    peakHourDownloadSpeed: number | null
    peakHourUploadSpeed: number | null
    peakHourPing: number | null
    peakHourPacketLoss: number | null
  }[]
}

export function PeakHourMetrics({ reviews }: PeakHourMetricsProps) {
  // Filter reviews with peak hour data
  const peakHourReviews = reviews.filter(r => r.peakHourRating !== null)
  
  if (peakHourReviews.length === 0) {
    return null
  }

  // Calculate averages
  const avgPeakHourRating = peakHourReviews.reduce((sum, r) => sum + (r.peakHourRating || 0), 0) / peakHourReviews.length
  const avgDownload = peakHourReviews.reduce((sum, r) => sum + (r.peakHourDownloadSpeed || 0), 0) / peakHourReviews.length
  const avgUpload = peakHourReviews.reduce((sum, r) => sum + (r.peakHourUploadSpeed || 0), 0) / peakHourReviews.length
  const avgPing = peakHourReviews.reduce((sum, r) => sum + (r.peakHourPing || 0), 0) / peakHourReviews.length
  const avgPacketLoss = peakHourReviews.reduce((sum, r) => sum + (r.peakHourPacketLoss || 0), 0) / peakHourReviews.length

  // Find most common peak hours
  const peakStartHours = peakHourReviews
    .filter(r => r.peakHourStart !== null)
    .map(r => r.peakHourStart as number)
  const peakEndHours = peakHourReviews
    .filter(r => r.peakHourEnd !== null)
    .map(r => r.peakHourEnd as number)

  const mostCommonStart = mode(peakStartHours)
  const mostCommonEnd = mode(peakEndHours)

  // Helper function to format time
  const formatTime = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleTimeString([], {
      hour: 'numeric',
      hour12: true
    })
  }

  // Helper function to get performance badge
  const getPerformanceBadge = (rating: number) => {
    if (rating >= 4.5) return { text: "Excellent", color: "bg-green-100 text-green-800" }
    if (rating >= 4.0) return { text: "Very Good", color: "bg-blue-100 text-blue-800" }
    if (rating >= 3.0) return { text: "Good", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Fair", color: "bg-orange-100 text-orange-800" }
  }

  const performanceBadge = getPerformanceBadge(avgPeakHourRating)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Peak Hour Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Rating */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Peak Hour Rating</div>
              <div className="text-2xl font-bold">{avgPeakHourRating.toFixed(1)}/5</div>
            </div>
            <Badge className={performanceBadge.color}>
              {performanceBadge.text}
            </Badge>
          </div>

          {/* Peak Hours */}
          {mostCommonStart !== undefined && mostCommonEnd !== undefined && (
            <div>
              <div className="text-sm font-medium mb-1">Typical Peak Hours</div>
              <div className="text-lg">
                {formatTime(mostCommonStart)} - {formatTime(mostCommonEnd)}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-1">
                <Download className="h-4 w-4" />
                Download
              </div>
              <div className="text-lg font-semibold">
                {avgDownload.toFixed(1)} Mbps
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-1">
                <Upload className="h-4 w-4" />
                Upload
              </div>
              <div className="text-lg font-semibold">
                {avgUpload.toFixed(1)} Mbps
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-1">
                <Activity className="h-4 w-4" />
                Ping
              </div>
              <div className="text-lg font-semibold">
                {avgPing.toFixed(0)} ms
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-1">
                <Zap className="h-4 w-4" />
                Packet Loss
              </div>
              <div className="text-lg font-semibold">
                {avgPacketLoss.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            Based on {peakHourReviews.length} {peakHourReviews.length === 1 ? 'review' : 'reviews'} with peak hour data
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to find the mode of an array
function mode(arr: number[]): number | undefined {
  if (arr.length === 0) return undefined
  
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  let maxCount = 0
  let modeValue = arr[0]

  for (const [value, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count
      modeValue = parseInt(value)
    }
  }

  return modeValue
} 