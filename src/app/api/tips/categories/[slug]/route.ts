import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const category = await prisma.tipCategory.findUnique({
      where: { slug }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
} 