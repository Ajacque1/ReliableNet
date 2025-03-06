import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { updateComplexBadges } from "@/lib/badges"

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id: complexId } = params
    const { searchParams } = new URL(request.url)

    // Parse filter parameters
    const sortBy = searchParams.get("sortBy") || "recent"
    const minRating = parseInt(searchParams.get("minRating") || "0")
    const minPeakHourRating = searchParams.get("minPeakHourRating")
      ? parseInt(searchParams.get("minPeakHourRating")!)
      : null
    const hasPeakHourData = searchParams.get("hasPeakHourData") === "true"
    const peakHourStart = searchParams.get("peakHourStart")
      ? parseInt(searchParams.get("peakHourStart")!)
      : undefined
    const peakHourEnd = searchParams.get("peakHourEnd")
      ? parseInt(searchParams.get("peakHourEnd")!)
      : undefined
    const minDownloadSpeed = searchParams.get("minDownloadSpeed")
      ? parseFloat(searchParams.get("minDownloadSpeed")!)
      : undefined
    const maxPing = searchParams.get("maxPing")
      ? parseFloat(searchParams.get("maxPing")!)
      : undefined
    const maxPacketLoss = searchParams.get("maxPacketLoss")
      ? parseFloat(searchParams.get("maxPacketLoss")!)
      : undefined

    // Build where clause
    const where = {
      complexId,
      rating: { gte: minRating },
      ...(hasPeakHourData && {
        peakHourRating: { not: null }
      }),
      ...(minPeakHourRating && {
        peakHourRating: { gte: minPeakHourRating }
      }),
      ...(peakHourStart && {
        peakHourStart
      }),
      ...(peakHourEnd && {
        peakHourEnd
      }),
      ...(minDownloadSpeed && {
        peakHourDownloadSpeed: { gte: minDownloadSpeed }
      }),
      ...(maxPing && {
        peakHourPing: { lte: maxPing }
      }),
      ...(maxPacketLoss && {
        peakHourPacketLoss: { lte: maxPacketLoss }
      })
    }

    // Determine sort order
    const orderBy = (() => {
      switch (sortBy) {
        case "helpful":
          return { helpfulCount: "desc" as const }
        case "rating":
          return { rating: "desc" as const }
        case "peakRating":
          return { peakHourRating: "desc" as const }
        default:
          return { createdAt: "desc" as const }
      }
    })()

    const reviews = await prisma.apartmentReview.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id: complexId } = params
    const {
      rating,
      internetRating,
      comment,
      pros,
      cons,
      peakHourRating,
      peakHourComment,
      peakHourStart,
      peakHourEnd,
      peakHourDownloadSpeed,
      peakHourUploadSpeed,
      peakHourPing,
      peakHourPacketLoss
    } = await request.json()

    // Validate required fields
    if (!rating || !internetRating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the complex exists
    const complex = await prisma.apartmentComplex.findUnique({
      where: { id: complexId },
      select: { id: true }
    })

    if (!complex) {
      return NextResponse.json(
        { error: "Apartment complex not found" },
        { status: 404 }
      )
    }

    // Create the review
    const review = await prisma.apartmentReview.create({
      data: {
        complexId,
        userId: session.user.id,
        rating,
        internetRating,
        comment,
        pros,
        cons,
        verified: false,
        helpfulCount: 0,
        // Peak Hour Data
        peakHourRating,
        peakHourComment,
        peakHourStart,
        peakHourEnd,
        peakHourDownloadSpeed,
        peakHourUploadSpeed,
        peakHourPing,
        peakHourPacketLoss
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    // Update complex badges
    await updateComplexBadges(complexId)

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Failed to submit review:", error)
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    )
  }
} 