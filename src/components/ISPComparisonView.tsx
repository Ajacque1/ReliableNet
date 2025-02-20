"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, Clock, DollarSign, Signal, Wifi } from "lucide-react"

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

interface ISPComparisonViewProps {
  isps: ISPData[]
}

export function ISPComparisonView({ isps }: ISPComparisonViewProps) {
  // Find the best value for each metric
  const bestMetrics = isps.reduce(
    (acc, isp) => ({
      download: Math.max(acc.download, isp.avgDownload),
      upload: Math.max(acc.upload, isp.avgUpload),
      ping: Math.min(acc.ping, isp.avgPing),
      reliability: Math.max(acc.reliability, isp.reliability),
      price: isp.pricing?.standard && (!acc.price || isp.pricing.standard < acc.price)
        ? isp.pricing.standard
        : acc.price,
    }),
    {
      download: 0,
      upload: 0,
      ping: Infinity,
      reliability: 0,
      price: undefined as number | undefined,
    }
  )

  const metrics = [
    {
      icon: <Download className="h-5 w-5" />,
      label: "Download Speed",
      getValue: (isp: ISPData) => `${isp.avgDownload.toFixed(1)} Mbps`,
      isBest: (isp: ISPData) => isp.avgDownload === bestMetrics.download,
    },
    {
      icon: <Upload className="h-5 w-5" />,
      label: "Upload Speed",
      getValue: (isp: ISPData) => `${isp.avgUpload.toFixed(1)} Mbps`,
      isBest: (isp: ISPData) => isp.avgUpload === bestMetrics.upload,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Ping",
      getValue: (isp: ISPData) => `${isp.avgPing.toFixed(0)} ms`,
      isBest: (isp: ISPData) => isp.avgPing === bestMetrics.ping,
    },
    {
      icon: <Signal className="h-5 w-5" />,
      label: "Reliability",
      getValue: (isp: ISPData) => `${(isp.reliability * 100).toFixed(1)}%`,
      isBest: (isp: ISPData) => isp.reliability === bestMetrics.reliability,
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "Standard Price",
      getValue: (isp: ISPData) => 
        isp.pricing?.standard ? `$${isp.pricing.standard}/mo` : "N/A",
      isBest: (isp: ISPData) => 
        isp.pricing?.standard && bestMetrics.price === isp.pricing.standard,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Side-by-Side Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto,repeat(3,1fr)] gap-4">
          {/* Header Row */}
          <div className="font-medium" />
          {isps.map((isp) => (
            <div key={isp.id} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Wifi className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-lg font-semibold">{isp.isp}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {isp.testCount} speed tests
              </p>
            </div>
          ))}

          {/* Metrics Rows */}
          {metrics.map((metric, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center space-x-2 py-4 font-medium">
                {metric.icon}
                <span>{metric.label}</span>
              </div>
              {isps.map((isp) => (
                <div
                  key={isp.id}
                  className={`text-center py-4 ${
                    metric.isBest(isp)
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  {metric.getValue(isp)}
                  {metric.isBest(isp) && (
                    <div className="text-xs text-primary mt-1">
                      Best Value
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Features Row */}
          <div className="flex items-center space-x-2 py-4 font-medium">
            Features
          </div>
          {isps.map((isp) => (
            <div key={isp.id} className="py-4">
              {isp.features?.map((feature, index) => (
                <span
                  key={index}
                  className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full m-1"
                >
                  {feature}
                </span>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 