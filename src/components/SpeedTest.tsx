"use client"

import { useState } from "react"
import { Download, Upload, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SpeedTestState = "idle" | "running" | "complete"

interface SpeedTestResults {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
}

export function SpeedTest() {
  const [state, setState] = useState<SpeedTestState>("idle")
  const [results, setResults] = useState<SpeedTestResults | null>(null)

  const runSpeedTest = async () => {
    setState("running")
    
    // Simulated speed test - replace with actual speed test logic
    try {
      // Simulate network test with delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Sample results - replace with actual speed test results
      setResults({
        downloadSpeed: Math.random() * 100 + 50, // 50-150 Mbps
        uploadSpeed: Math.random() * 50 + 25,    // 25-75 Mbps
        ping: Math.random() * 20 + 5,           // 5-25 ms
      })
      
      setState("complete")
    } catch (error) {
      console.error("Speed test failed:", error)
      setState("idle")
    }
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Internet Speed Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Speed Test Results */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Download className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm text-gray-500">Download</p>
              <p className="text-2xl font-bold">
                {state === "complete" && results
                  ? `${results.downloadSpeed.toFixed(1)} Mbps`
                  : "--"}
              </p>
            </div>
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm text-gray-500">Upload</p>
              <p className="text-2xl font-bold">
                {state === "complete" && results
                  ? `${results.uploadSpeed.toFixed(1)} Mbps`
                  : "--"}
              </p>
            </div>
            <div className="space-y-2">
              <Clock className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm text-gray-500">Ping</p>
              <p className="text-2xl font-bold">
                {state === "complete" && results
                  ? `${results.ping.toFixed(0)} ms`
                  : "--"}
              </p>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={runSpeedTest}
              disabled={state === "running"}
              className="w-full md:w-auto"
            >
              {state === "running" ? (
                <>
                  <div className="animate-spin mr-2">
                    <Clock className="h-4 w-4" />
                  </div>
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {state === "complete" ? "Test Again" : "Start Test"}
                </>
              )}
            </Button>
          </div>

          {/* Status Message */}
          {state === "running" && (
            <p className="text-center text-sm text-gray-500 animate-pulse">
              Measuring your connection speed...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 