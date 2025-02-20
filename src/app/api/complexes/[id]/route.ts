import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const complex = await prisma.apartmentComplex.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        isps: {
          include: {
            ispMetric: true
          }
        },
        speedTests: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!complex) {
      return NextResponse.json(
        { error: "Complex not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(complex)
  } catch (error) {
    console.error('Failed to fetch complex:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complex' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()

    const complex = await prisma.apartmentComplex.update({
      where: { id },
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        latitude: body.latitude,
        longitude: body.longitude,
        website: body.website,
        amenities: body.amenities
      }
    })

    return NextResponse.json(complex)
  } catch (error) {
    console.error('Failed to update complex:', error)
    return NextResponse.json(
      { error: 'Failed to update complex' },
      { status: 500 }
    )
  }
} 