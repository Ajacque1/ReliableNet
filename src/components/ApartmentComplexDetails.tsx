"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Globe, MapPin, Wifi } from "lucide-react"
import { SpeedTestHistory } from "./SpeedTestHistory"
import { ReviewForm } from "./ReviewForm"
import { ComplexBadges } from "./ComplexBadges"
import { useSession } from "next-auth/react"
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
  badges: string[]
  managementContact?: {
    name: string
    email: string
    phone: string
  }
  reviews: Review[]
  isps: ISP[]
  speedTests: SpeedTest[]
  _count: {
    reviews: number
    speedTests: number
  }
}

interface ApartmentComplexDetailsProps {
  complex: ApartmentComplex
}

export function ApartmentComplexDetails({ complex }: ApartmentComplexDetailsProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate average ratings
  const avgRating = complex.reviews.length > 0
    ? complex.reviews.reduce((sum, review) => sum + review.rating, 0) / complex.reviews.length
    : 0

  const avgInternetRating = complex.reviews.length > 0
    ? complex.reviews.reduce((sum, review) => sum + review.internetRating, 0) / complex.reviews.length
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            {complex.name}
          </h1>
          <p className="text-lg text-muted-foreground flex items-center mt-2">
            <MapPin className="h-5 w-5 mr-1" />
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
      </div>

      {/* Badges */}
      {complex.badges?.length > 0 && (
        <ComplexBadges badges={complex.badges} />
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="internet">Internet</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({complex._count.reviews})
          </TabsTrigger>
          <TabsTrigger value="speed-tests">
            Speed Tests ({complex._count.speedTests})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{avgRating.toFixed(1)}/5</div>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{avgInternetRating.toFixed(1)}/5</div>
                <p className="text-sm text-muted-foreground">Internet Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{complex.isps.length}</div>
                <p className="text-sm text-muted-foreground">Available ISPs</p>
              </CardContent>
            </Card>
          </div>

          {/* Amenities */}
          {complex.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Internet & Tech Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {complex.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Management Contact */}
          {complex.managementContact && (
            <Card>
              <CardHeader>
                <CardTitle>Management Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {complex.managementContact.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${complex.managementContact.email}`}
                      className="text-primary hover:underline"
                    >
                      {complex.managementContact.email}
                    </a>
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    <a
                      href={`tel:${complex.managementContact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {complex.managementContact.phone}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="internet" className="space-y-6">
          {/* Available ISPs */}
          <Card>
            <CardHeader>
              <CardTitle>Available Internet Service Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complex.isps.map((isp) => (
                  <div
                    key={isp.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <Wifi className="h-5 w-5 mr-2 text-primary" />
                        {isp.ispMetric.isp}
                        {isp.isDefault && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Default Provider
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Coverage: {(isp.coverage * 100).toFixed(0)}% of building
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {isp.ispMetric.avgDownload.toFixed(1)} Mbps ↓
                      </div>
                      <div className="font-medium">
                        {isp.ispMetric.avgUpload.toFixed(1)} Mbps ↑
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isp.ispMetric.avgPing.toFixed(0)}ms ping
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Review Form */}
          {session && (
            <ReviewForm
              complexId={complex.id}
              onReviewSubmitted={() => setActiveTab("reviews")}
            />
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {complex.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">
                          {review.user.name || "Anonymous"}
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Verified Resident
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        Overall: {review.rating}/5
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Internet: {review.internetRating}/5
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="mt-4">{review.comment}</p>
                  )}

                  {(review.pros.length > 0 || review.cons.length > 0) && (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {review.pros.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Pros</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {review.pros.map((pro, index) => (
                              <li key={index} className="text-sm">{pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.cons.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">Cons</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {review.cons.map((con, index) => (
                              <li key={index} className="text-sm">{con}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 text-sm text-muted-foreground">
                    {review.helpfulCount} people found this review helpful
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="speed-tests" className="space-y-6">
          <SpeedTestHistory speedTests={complex.speedTests} complexId={complex.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 