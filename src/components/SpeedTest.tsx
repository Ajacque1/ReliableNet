"use client"

import { useState, useEffect } from "react"
import { Download, Upload, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { measureNetworkSpeed } from "@/lib/speedTest"
import { getCurrentLocation } from "@/lib/location"

type SpeedTestState = "idle" | "running" | "complete"

interface SpeedTestResults {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
}

interface LocationData {
  latitude: number
  longitude: number
  city?: string
  state?: string
  country?: string
  zip?: string
}

export function SpeedTest() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [state, setState] = useState<SpeedTestState>("idle")
  const [results, setResults] = useState<SpeedTestResults | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Function to get location
  const getLocation = async () => {
    try {
      const locationData = await getCurrentLocation()
      setLocation(locationData)
      setLocationError(null)
    } catch (error) {
      setLocationError("Failed to get location. Some features may be limited.")
      console.error("Location error:", error)
    }
  }

  // Get location when component mounts
  useEffect(() => {
    getLocation()
  }, [])

  const submitResults = async (testResults: SpeedTestResults) => {
    try {
      const response = await fetch("/api/speed-tests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          downloadSpeed: testResults.downloadSpeed,
          uploadSpeed: testResults.uploadSpeed,
          ping: testResults.ping,
          location: location ? {
            latitude: location.latitude,
            longitude: location.longitude,
            city: location.city,
            state: location.state,
            country: location.country,
            zip: location.zip,
          } : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit results")
      }

      toast({
        title: "Speed test completed",
        description: "Your results have been saved successfully.",
      })

    } catch (error) {
      console.error("Failed to submit results:", error)
      toast({
        title: "Error",
        description: "Failed to save speed test results.",
        variant: "destructive",
      })
    }
  }

  const runSpeedTest = async () => {
    setState("running")
    
    try {
      // Run actual speed test
      const testResults = await measureNetworkSpeed()
      
      setResults(testResults)
      setState("complete")

      // Submit results
      await submitResults(testResults)

    } catch (error) {
      console.error("Speed test failed:", error)
      setState("idle")
      toast({
        title: "Error",
        description: "Speed test failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Internet Speed Test</CardTitle>
        {location && (
          <p className="text-sm text-center text-muted-foreground">
            Testing from {location.city}, {location.state}
          </p>
        )}
        {locationError && (
          <p className="text-sm text-center text-destructive">
            {locationError}
          </p>
        )}
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