"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface SpeedTest {
  id: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  timestamp: string
}

export function SpeedTestHistory({ userId }: { userId: string }) {
  const [tests, setTests] = useState<SpeedTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await fetch(`/api/speed-tests?userId=${userId}`)
        const data = await response.json()
        setTests(data.tests)
      } catch (error) {
        console.error("Failed to fetch speed tests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [userId])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid gap-4">
      {tests.map((test) => (
        <Card key={test.id}>
          <CardHeader>
            <CardTitle>Speed Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Download</p>
                <p className="text-2xl font-bold">{test.downloadSpeed} Mbps</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Upload</p>
                <p className="text-2xl font-bold">{test.uploadSpeed} Mbps</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ping</p>
                <p className="text-2xl font-bold">{test.ping} ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 