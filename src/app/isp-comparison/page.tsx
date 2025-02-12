"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Mock data - replace with real API data later
const mockIsps = [
  {
    id: 1,
    name: "FastNet",
    averageSpeed: 100,
    price: 49.99,
    rating: 4.5,
    availability: "90%",
  },
  {
    id: 2,
    name: "SpeedWave",
    averageSpeed: 200,
    price: 69.99,
    rating: 4.2,
    availability: "85%",
  },
  {
    id: 3,
    name: "ConnectPro",
    averageSpeed: 150,
    price: 59.99,
    rating: 4.3,
    availability: "95%",
  },
]

export default function IspComparison() {
  const [location, setLocation] = useState("")
  const [isps, setIsps] = useState(mockIsps)

  const handleSearch = () => {
    // TODO: Implement actual location-based ISP search
    console.log("Searching for ISPs in:", location)
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
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* ISP Comparison Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {isps.map((isp) => (
          <Card key={isp.id}>
            <CardHeader>
              <CardTitle>{isp.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Average Speed</dt>
                  <dd className="text-lg font-semibold">{isp.averageSpeed} Mbps</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Monthly Price</dt>
                  <dd className="text-lg font-semibold">${isp.price}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Customer Rating</dt>
                  <dd className="text-lg font-semibold">{isp.rating}/5.0</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Area Availability</dt>
                  <dd className="text-lg font-semibold">{isp.availability}</dd>
                </div>
              </dl>
              <Button className="w-full mt-6">View Plans</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 