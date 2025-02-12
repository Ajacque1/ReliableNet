"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function SpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<{
    download: number | null
    upload: number | null
    ping: number | null
  }>({
    download: null,
    upload: null,
    ping: null,
  })

  const startTest = async () => {
    setIsRunning(true)
    // TODO: Implement actual speed test logic
    // For now, just simulate a test with setTimeout
    setTimeout(() => {
      setResults({
        download: 50.5, // Mbps
        upload: 10.2,   // Mbps
        ping: 25,       // ms
      })
      setIsRunning(false)
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Internet Speed Test</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Test Your Connection Speed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Speed Test Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={startTest} 
              disabled={isRunning}
            >
              {isRunning ? "Testing..." : "Start Speed Test"}
            </Button>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold">Download</h3>
              <p className="text-2xl">
                {results.download ? `${results.download} Mbps` : '-'}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Upload</h3>
              <p className="text-2xl">
                {results.upload ? `${results.upload} Mbps` : '-'}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Ping</h3>
              <p className="text-2xl">
                {results.ping ? `${results.ping} ms` : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 