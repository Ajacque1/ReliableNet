"use client"

import { useState } from "react"
import { ComplexList } from "@/components/ComplexList"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin } from "lucide-react"

export default function ComplexesPage() {
  const [location, setLocation] = useState({
    city: "",
    state: ""
  })

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ComplexList component will handle the actual filtering
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Internet Reviews</h1>
        <p className="text-lg text-gray-600">
          Read community reviews about internet service in apartment complexes near you
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Search by Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLocationSubmit} className="flex gap-4">
            <Input
              placeholder="City"
              value={location.city}
              onChange={(e) => setLocation(l => ({ ...l, city: e.target.value }))}
              className="flex-1"
            />
            <Input
              placeholder="State"
              value={location.state}
              onChange={(e) => setLocation(l => ({ ...l, state: e.target.value }))}
              className="w-32"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <ComplexList />
    </div>
  )
} 