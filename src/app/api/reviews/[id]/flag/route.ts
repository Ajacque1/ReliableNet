export const runtime = "nodejs"

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

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

    // TODO: Add role check for moderators
    // if (!session.user.isModerator) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 403 }
    //   )
    // }

    const { id } = params

    // Update the review
    const review = await prisma.apartmentReview.update({
      where: { id },
      data: {
        flagged: true,
        flaggedAt: new Date(),
        flaggedBy: session.user.id
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
    console.error("Failed to flag review:", error)
    return NextResponse.json(
      { error: "Failed to flag review" },
      { status: 500 }
    )
  }
} 