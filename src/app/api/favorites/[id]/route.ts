export const runtime = "nodejs"

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

export async function DELETE(
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

    const { id } = params

    // Verify ownership
    const favorite = await prisma.favoriteComplex.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      )
    }

    // Delete the favorite
    await prisma.favoriteComplex.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete favorite:", error)
    return NextResponse.json(
      { error: "Failed to delete favorite" },
      { status: 500 }
    )
  }
}

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

    const { id } = params

    const favorite = await prisma.favoriteComplex.findUnique({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        complex: true
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ favorite })
  } catch (error) {
    console.error("Failed to fetch favorite:", error)
    return NextResponse.json(
      { error: "Failed to fetch favorite" },
      { status: 500 }
    )
  }
} 