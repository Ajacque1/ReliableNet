import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

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

interface ISPMetric {
  id: string
  isp: string
  avgDownload: number
  avgUpload: number
  avgPing: number
  reliability: number
  testCount: number
}

interface ComplexISP {
  id: string
  isDefault: boolean
  coverage: number
  speedTests: number
  ispMetric: ISPMetric
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
  reviews: Review[]
  isps: ComplexISP[]
  speedTests: SpeedTest[]
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch complex details with related data
    const { data: complex, error: complexError } = await supabase
      .from("ApartmentComplex")
      .select(`
        *,
        reviews:ApartmentReview(
          id,
          rating,
          internetRating,
          comment,
          pros,
          cons,
          verified,
          helpfulCount,
          createdAt,
          user:users(name)
        ),
        isps:ComplexISP(
          id,
          isDefault,
          coverage,
          speedTests,
          ispMetric:ISPMetrics(
            id,
            isp,
            avgDownload,
            avgUpload,
            avgPing,
            reliability,
            testCount
          )
        ),
        speedTests:SpeedTest(
          id,
          downloadSpeed,
          uploadSpeed,
          ping,
          createdAt,
          isp
        )
      `)
      .eq("id", id)
      .single()

    if (complexError) throw complexError

    if (!complex) {
      return NextResponse.json(
        { error: "Apartment complex not found" },
        { status: 404 }
      )
    }

    const typedComplex = complex as ApartmentComplex

    // Calculate aggregate metrics
    const metrics = {
      averageInternetRating: typedComplex.reviews.length > 0
        ? typedComplex.reviews.reduce((acc: number, review: Review) => acc + review.internetRating, 0) / typedComplex.reviews.length
        : null,
      totalReviews: typedComplex.reviews.length,
      totalSpeedTests: typedComplex.speedTests.length,
      ispBreakdown: typedComplex.isps.map((isp: ComplexISP) => ({
        name: isp.ispMetric.isp,
        coverage: isp.coverage,
        isDefault: isp.isDefault,
        averageSpeed: {
          download: isp.ispMetric.avgDownload,
          upload: isp.ispMetric.avgUpload,
          ping: isp.ispMetric.avgPing
        },
        reliability: isp.ispMetric.reliability,
        speedTests: isp.speedTests
      }))
    }

    return NextResponse.json({
      complex: {
        ...typedComplex,
        metrics
      }
    })
  } catch (error) {
    console.error("Failed to fetch apartment complex:", error)
    return NextResponse.json(
      { error: "Failed to fetch apartment complex" },
      { status: 500 }
    )
  }
} 