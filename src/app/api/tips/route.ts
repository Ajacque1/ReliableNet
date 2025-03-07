import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const categoryId = searchParams.get("categoryId")

    const tips = await prisma.tip.findMany({
      where: {
        AND: [
          categoryId ? { categoryId } : {},
          query ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
              { tags: { has: query } }
            ]
          } : {}
        ]
      },
      include: {
        category: true
      },
      orderBy: {
        helpfulCount: "desc"
      }
    })

    return NextResponse.json({ tips })
  } catch (error) {
    console.error("Error fetching tips:", error)
    return NextResponse.json(
      { error: "Failed to fetch tips" },
      { status: 500 }
    )
  }
} 