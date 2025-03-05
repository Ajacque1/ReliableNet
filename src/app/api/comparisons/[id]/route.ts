import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function DELETE(
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

    const { id } = params

    // Verify ownership
    const comparison = await prisma.savedComparison.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!comparison) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404 }
      )
    }

    // Delete the comparison
    await prisma.savedComparison.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete comparison:", error)
    return NextResponse.json(
      { error: "Failed to delete comparison" },
      { status: 500 }
    )
  }
}

export async function GET(
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

    const { id } = params

    const comparison = await prisma.savedComparison.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!comparison) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ comparison })
  } catch (error) {
    console.error("Failed to fetch comparison:", error)
    return NextResponse.json(
      { error: "Failed to fetch comparison" },
      { status: 500 }
    )
  }
} 