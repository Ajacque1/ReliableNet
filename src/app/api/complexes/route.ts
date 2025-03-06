import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { Prisma } from "@prisma/client"

export const dynamic = 'force-dynamic'

interface CreateComplexData {
  name: string
  address: string
  city: string
  state: string
  zip: string
  latitude?: number
  longitude?: number
  website?: string
  amenities: string[]
  managementContact?: {
    name: string
    email: string
    phone: string
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const data: CreateComplexData = await request.json()

    // Validate required fields
    if (!data.name || !data.address || !data.city || !data.state || !data.zip) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create the complex
    const complex = await prisma.apartmentComplex.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        latitude: data.latitude,
        longitude: data.longitude,
        website: data.website,
        amenities: data.amenities,
      }
    })

    return NextResponse.json({ complex })
  } catch (error) {
    console.error("Failed to create apartment complex:", error)
    return NextResponse.json(
      { error: "Failed to create apartment complex" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const state = searchParams.get("state")
    const amenities = searchParams.getAll("amenities")
    const hasISP = searchParams.get("hasISP") === "true"
    const query = searchParams.get("query")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    // Build query conditions
    const where: Prisma.ApartmentComplexWhereInput = {
      AND: [
        // Location filters
        ...(city ? [{ city }] : []),
        ...(state ? [{ state }] : []),
        // Amenities filter
        ...(amenities.length > 0 ? [{
          amenities: {
            hasSome: amenities
          }
        }] : []),
        // ISP filter
        ...(hasISP ? [{
          isps: {
            some: {}
          }
        }] : []),
        // Search query
        ...(query ? [{
          OR: [
            { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
            { address: { contains: query, mode: Prisma.QueryMode.insensitive } },
            { city: { contains: query, mode: Prisma.QueryMode.insensitive } },
            { state: { contains: query, mode: Prisma.QueryMode.insensitive } }
          ]
        }] : [])
      ]
    }

    // Get total count for pagination
    const total = await prisma.apartmentComplex.count({ where })

    // Get paginated results with related data
    const complexes = await prisma.apartmentComplex.findMany({
      where,
      include: {
        _count: {
          select: {
            reviews: true
          }
        },
        isps: {
          include: {
            ispMetric: {
              select: {
                id: true,
                isp: true,
                avgDownload: true,
                avgUpload: true,
                avgPing: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      complexes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Failed to fetch apartment complexes:", error)
    return NextResponse.json(
      { error: "Failed to fetch apartment complexes" },
      { status: 500 }
    )
  }
} 