"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { Download, FileDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface SpeedTest {
  id: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  createdAt: string
  isp: string
}

interface SpeedTestHistoryProps {
  speedTests: SpeedTest[]
  complexId?: string
  userId?: string
}

export function SpeedTestHistory({ speedTests, complexId, userId }: SpeedTestHistoryProps) {
  const { toast } = useToast()

  // Sort speed tests by date
  const sortedTests = [...speedTests].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  // Transform data for the chart
  const chartData = sortedTests.map(test => ({
    date: format(new Date(test.createdAt), "MMM d, yyyy"),
    download: test.downloadSpeed,
    upload: test.uploadSpeed,
    ping: test.ping,
    isp: test.isp
  }))

  // Calculate averages
  const averages = speedTests.reduce(
    (acc, test) => {
      acc.download += test.downloadSpeed
      acc.upload += test.uploadSpeed
      acc.ping += test.ping
      return acc
    },
    { download: 0, upload: 0, ping: 0 }
  )

  const count = speedTests.length
  const avgDownload = count > 0 ? averages.download / count : 0
  const avgUpload = count > 0 ? averages.upload / count : 0
  const avgPing = count > 0 ? averages.ping / count : 0

  const handleExport = async (format: string) => {
    try {
      const params = new URLSearchParams()
      params.set("format", format)
      if (complexId) params.set("complexId", complexId)
      if (userId) params.set("userId", userId)

      const response = await fetch(`/api/speed-tests/export?${params}`)
      if (!response.ok) throw new Error("Failed to export data")

      if (format === "csv") {
        // Download the CSV file
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `speed_tests_${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        // Handle JSON download
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `speed_tests_${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      toast({
        title: "Export successful",
        description: `Speed test data exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Failed to export data:", error)
      toast({
        title: "Export failed",
        description: "Failed to export speed test data",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="flex justify-end space-x-4">
        <Select onValueChange={handleExport}>
          <SelectTrigger className="w-[180px]">
            <FileDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Export Data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">Export as CSV</SelectItem>
            <SelectItem value="json">Export as JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Averages */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Average Download</p>
            <p className="text-2xl font-bold">{avgDownload.toFixed(1)} Mbps</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Average Upload</p>
            <p className="text-2xl font-bold">{avgUpload.toFixed(1)} Mbps</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Average Ping</p>
            <p className="text-2xl font-bold">{avgPing.toFixed(0)} ms</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="download"
                  name="Download (Mbps)"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="upload"
                  name="Upload (Mbps)"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ping"
                  name="Ping (ms)"
                  stroke="#dc2626"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">ISP</th>
                  <th className="text-right py-2">Download</th>
                  <th className="text-right py-2">Upload</th>
                  <th className="text-right py-2">Ping</th>
                </tr>
              </thead>
              <tbody>
                {sortedTests.map((test) => (
                  <tr key={test.id} className="border-b">
                    <td className="py-2">
                      {format(new Date(test.createdAt), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="py-2">{test.isp}</td>
                    <td className="text-right py-2">{test.downloadSpeed.toFixed(1)} Mbps</td>
                    <td className="text-right py-2">{test.uploadSpeed.toFixed(1)} Mbps</td>
                    <td className="text-right py-2">{test.ping.toFixed(0)} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 