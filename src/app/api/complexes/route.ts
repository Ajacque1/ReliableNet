import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') // in miles

    let query: any = {
      where: {},
      include: {
        reviews: {
          select: {
            rating: true,
            internetRating: true
          }
        },
        isps: {
          include: {
            ispMetric: true
          }
        }
      }
    }

    // Location-based filtering
    if (city && state) {
      query.where.AND = [
        { city: { equals: city, mode: 'insensitive' } },
        { state: { equals: state, mode: 'insensitive' } }
      ]
    }

    // Geospatial search if coordinates provided
    if (lat && lng && radius) {
      // Add geospatial query conditions
      // Note: Requires PostGIS extension for proper implementation
    }

    const complexes = await prisma.apartmentComplex.findMany(query)

    return NextResponse.json({ 
      complexes: complexes.map(c => ({
        ...c,
        avgRating: c.reviews.reduce((acc, r) => acc + r.rating, 0) / c.reviews.length || 0,
        avgInternetRating: c.reviews.reduce((acc, r) => acc + r.internetRating, 0) / c.reviews.length || 0
      }))
    })
  } catch (error) {
    console.error('Failed to fetch complexes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complexes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const complex = await prisma.apartmentComplex.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        latitude: body.latitude,
        longitude: body.longitude,
        amenities: body.amenities || [],
        website: body.website
      }
    })

    return NextResponse.json(complex, { status: 201 })
  } catch (error) {
    console.error('Failed to create complex:', error)
    return NextResponse.json(
      { error: 'Failed to create complex' },
      { status: 500 }
    )
  }
} 