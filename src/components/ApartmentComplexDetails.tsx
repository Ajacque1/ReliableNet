"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Wifi, MapPin, Globe, Star, Activity } from "lucide-react"
import { SpeedTestHistory } from "@/components/SpeedTestHistory"
import Link from "next/link"

interface Review {
  id: string
  rating: number
  internetRating: number
  comment: string
  pros: string[]
  cons: string[]
  verified: boolean
  helpfulCount: number
  createdAt: string
  user: {
    name: string | null
  }
}

interface ISP {
  id: string
  isDefault: boolean
  coverage: number
  speedTests: number
  ispMetric: {
    id: string
    isp: string
    avgDownload: number
    avgUpload: number
    avgPing: number
    reliability: number
    testCount: number
  }
}

interface SpeedTest {
  id: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  createdAt: string
  isp: string
}

interface ApartmentComplex {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  website?: string
  amenities: string[]
  managementContact?: {
    name: string
    email: string
    phone: string
  }
  reviews: Review[]
  isps: ISP[]
  speedTests: SpeedTest[]
}

interface ApartmentComplexDetailsProps {
  complex: ApartmentComplex
  onEdit?: () => void
}

export function ApartmentComplexDetails({ complex, onEdit }: ApartmentComplexDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate average ratings
  const avgInternetRating = complex.reviews.length > 0
    ? complex.reviews.reduce((acc, review) => acc + review.internetRating, 0) / complex.reviews.length
    : 0

  const avgOverallRating = complex.reviews.length > 0
    ? complex.reviews.reduce((acc, review) => acc + review.rating, 0) / complex.reviews.length
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            {complex.name}
          </h1>
          <p className="text-muted-foreground flex items-center mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            {complex.address}, {complex.city}, {complex.state} {complex.zip}
          </p>
          {complex.website && (
            <Link
              href={complex.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center mt-2"
            >
              <Globe className="h-4 w-4 mr-1" />
              Visit Website
            </Link>
          )}
        </div>
        {onEdit && (
          <Button onClick={onEdit}>
            Edit Complex
          </Button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {avgInternetRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Internet Rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {complex.isps.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Available ISPs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {complex.speedTests.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Speed Tests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {avgOverallRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Overall Rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Contact */}
      {complex.managementContact && (
        <Card>
          <CardHeader>
            <CardTitle>Management Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="font-medium">{complex.managementContact.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="font-medium">
                  <a
                    href={`mailto:${complex.managementContact.email}`}
                    className="text-primary hover:underline"
                  >
                    {complex.managementContact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Phone</dt>
                <dd className="font-medium">
                  <a
                    href={`tel:${complex.managementContact.phone}`}
                    className="text-primary hover:underline"
                  >
                    {complex.managementContact.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Detailed Content */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="speed-tests">Speed Tests</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Internet & Tech Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {complex.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* ISPs */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">Available ISPs</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {complex.isps.map((isp) => (
                    <Card key={isp.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium flex items-center">
                            <Wifi className="h-4 w-4 mr-2 text-primary" />
                            {isp.ispMetric.isp}
                          </h4>
                          {isp.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Default Provider
                            </span>
                          )}
                        </div>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Download</dt>
                            <dd className="font-medium">
                              {isp.ispMetric.avgDownload.toFixed(1)} Mbps
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Upload</dt>
                            <dd className="font-medium">
                              {isp.ispMetric.avgUpload.toFixed(1)} Mbps
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Ping</dt>
                            <dd className="font-medium">
                              {isp.ispMetric.avgPing.toFixed(0)} ms
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Reliability</dt>
                            <dd className="font-medium">
                              {(isp.ispMetric.reliability * 100).toFixed(0)}%
                            </dd>
                          </div>
                        </dl>
                        <div className="mt-4 text-xs text-muted-foreground">
                          Coverage: {(isp.coverage * 100).toFixed(0)}% |
                          {isp.speedTests} speed tests
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="speed-tests" className="mt-6">
              <SpeedTestHistory
                speedTests={complex.speedTests}
                complexId={complex.id}
              />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {complex.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.internetRating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            By {review.user.name || "Anonymous"}
                          </p>
                        </div>
                        {review.verified && (
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified Resident
                          </span>
                        )}
                      </div>
                      <p className="mb-4">{review.comment}</p>
                      {(review.pros.length > 0 || review.cons.length > 0) && (
                        <div className="grid gap-4 md:grid-cols-2">
                          {review.pros.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Pros</h4>
                              <ul className="text-sm space-y-1">
                                {review.pros.map((pro, i) => (
                                  <li key={i} className="text-green-600">
                                    + {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {review.cons.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Cons</h4>
                              <ul className="text-sm space-y-1">
                                {review.cons.map((con, i) => (
                                  <li key={i} className="text-red-600">
                                    - {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 