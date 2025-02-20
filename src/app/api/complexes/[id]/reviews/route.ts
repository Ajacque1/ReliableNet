import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
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
      cons
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
        verified: false, // This could be updated later based on verification process
        helpfulCount: 0
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Failed to submit review:", error)
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: complexId } = params

    const reviews = await prisma.apartmentReview.findMany({
      where: {
        complexId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
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