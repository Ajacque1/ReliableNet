"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DetailedStats {
  peakHours: {
    download: number
    upload: number
    ping: number
  }
  offPeak: {
    download: number
    upload: number
    ping: number
  }
  reliability: number
  hourlyStats: {
    hour: number
    avgSpeed: number
  }[]
}

interface ISPDetailedStatsProps {
  ispId: string
  city?: string
  state?: string
}

interface ChartData {
  hour: number
  download: number
  upload: number
  ping: number
}

export function ISPDetailedStats({ ispId, city, state }: ISPDetailedStatsProps) {
  const [stats, setStats] = useState<DetailedStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartMetric, setChartMetric] = useState<'download' | 'upload' | 'ping'>('download')
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams({
          ispId,
          ...(city && { city }),
          ...(state && { state }),
        })

        const response = await fetch(`/api/isp/detailed-stats?${params}`)
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch detailed stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [ispId, city, state])

  if (loading) return <StatsLoadingSkeleton />

  if (!stats) return <div>Failed to load statistics</div>

  const renderChart = () => {
    if (!stats) return null

    const ChartComponent = chartType === 'bar' ? BarChart : LineChart
    const DataComponent = chartType === 'bar' ? Bar : Line

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={stats.hourlyStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour"
            tickFormatter={(hour) => `${hour}:00`}
          />
          <YAxis 
            label={{ 
              value: chartMetric === 'ping' ? 'ms' : 'Mbps', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip 
            formatter={(value: number) => [
              `${value.toFixed(1)} ${chartMetric === 'ping' ? 'ms' : 'Mbps'}`,
              chartMetric.charAt(0).toUpperCase() + chartMetric.slice(1)
            ]}
            labelFormatter={(hour) => `${hour}:00`}
          />
          <Legend />
          <DataComponent 
            dataKey={chartMetric}
            name={chartMetric.charAt(0).toUpperCase() + chartMetric.slice(1)}
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary))"
          />
        </ChartComponent>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      {/* Peak vs Off-Peak Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Download</dt>
                <dd>{stats.peakHours.download.toFixed(1)} Mbps</dd>
              </div>
              <div className="flex justify-between">
                <dt>Upload</dt>
                <dd>{stats.peakHours.upload.toFixed(1)} Mbps</dd>
              </div>
              <div className="flex justify-between">
                <dt>Ping</dt>
                <dd>{stats.peakHours.ping.toFixed(0)} ms</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Off-Peak Hours</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Download</dt>
                <dd>{stats.offPeak.download.toFixed(1)} Mbps</dd>
              </div>
              <div className="flex justify-between">
                <dt>Upload</dt>
                <dd>{stats.offPeak.upload.toFixed(1)} Mbps</dd>
              </div>
              <div className="flex justify-between">
                <dt>Ping</dt>
                <dd>{stats.offPeak.ping.toFixed(0)} ms</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Reliability Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Reliability Score</h3>
            <span className="text-2xl font-bold text-primary">
              {(stats.reliability * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on successful speed tests and consistent performance
          </p>
        </CardContent>
      </Card>

      {/* Speed by Hour Chart */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance Over Time</h3>
            <div className="flex space-x-2">
              <Select
                value={chartMetric}
                onValueChange={(value) => setChartMetric(value as typeof chartMetric)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="ping">Ping</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={chartType}
                onValueChange={(value) => setChartType(value as typeof chartType)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-[300px]">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
} 