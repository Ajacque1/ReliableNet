import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.tipCategory.findMany({
      include: {
        _count: {
          select: {
            tips: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching tip categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch tip categories" },
      { status: 500 }
    )
  }
} 