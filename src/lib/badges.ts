import { prisma } from "@/lib/prisma"

export type Badge = {
  id: string
  name: string
  description: string
  criteria: {
    minDownloadSpeed?: number
    minUploadSpeed?: number
    maxPing?: number
    minReliability?: number
    minRating?: number
    requiredAmenities?: string[]
    // Peak Hour Criteria
    minPeakHourRating?: number
    maxPeakHourPacketLoss?: number
    minPeakHourDownload?: number
    maxPeakHourPing?: number
  }
}

export const BADGES: Badge[] = [
  {
    id: "wfh_friendly",
    name: "WFH Friendly",
    description: "Excellent for remote work with reliable high-speed internet",
    criteria: {
      minDownloadSpeed: 100,
      minUploadSpeed: 20,
      maxPing: 30,
      minReliability: 0.95,
      minRating: 4,
      minPeakHourRating: 4,
      maxPeakHourPacketLoss: 1,
      minPeakHourDownload: 80,
      maxPeakHourPing: 40
    }
  },
  {
    id: "streamer_approved",
    name: "Streamer Approved",
    description: "Perfect for content creators and streamers",
    criteria: {
      minDownloadSpeed: 150,
      minUploadSpeed: 30,
      maxPing: 20,
      minReliability: 0.98,
      minPeakHourRating: 4.5,
      maxPeakHourPacketLoss: 0.5,
      minPeakHourDownload: 100,
      maxPeakHourPing: 30
    }
  },
  {
    id: "gamer_ready",
    name: "Gamer Ready",
    description: "Low latency and reliable connection for gaming",
    criteria: {
      minDownloadSpeed: 100,
      minUploadSpeed: 15,
      maxPing: 15,
      minReliability: 0.97,
      minPeakHourRating: 4,
      maxPeakHourPacketLoss: 0.2,
      maxPeakHourPing: 20
    }
  },
  {
    id: "budget_friendly",
    name: "Budget Friendly",
    description: "Good value for money with reliable basic service",
    criteria: {
      minDownloadSpeed: 50,
      minUploadSpeed: 10,
      maxPing: 50,
      minReliability: 0.9,
      minPeakHourRating: 3.5,
      maxPeakHourPacketLoss: 2,
      minPeakHourDownload: 30,
      maxPeakHourPing: 60
    }
  },
  {
    id: "family_choice",
    name: "Family Choice",
    description: "Reliable service for multiple users and devices",
    criteria: {
      minDownloadSpeed: 200,
      minUploadSpeed: 20,
      maxPing: 40,
      minReliability: 0.93,
      minPeakHourRating: 4,
      maxPeakHourPacketLoss: 1.5,
      minPeakHourDownload: 150,
      maxPeakHourPing: 50
    }
  }
]

export async function calculateComplexBadges(complexId: string): Promise<string[]> {
  try {
    // Fetch complex data with reviews and speed tests
    const complex = await prisma.apartmentComplex.findUnique({
      where: { id: complexId },
      include: {
        reviews: {
          where: {
            verified: true
          }
        },
        speedTests: true,
        isps: {
          include: {
            ispMetric: true
          }
        }
      }
    })

    if (!complex) return []

    const badges: string[] = []

    // Calculate average metrics
    const avgRating = complex.reviews.length > 0
      ? complex.reviews.reduce((sum, r) => sum + r.rating, 0) / complex.reviews.length
      : 0

    // Calculate peak hour metrics
    const peakHourReviews = complex.reviews.filter(r => r.peakHourRating !== null)
    const avgPeakHourRating = peakHourReviews.length > 0
      ? peakHourReviews.reduce((sum, r) => sum + (r.peakHourRating || 0), 0) / peakHourReviews.length
      : 0

    const avgPeakHourDownload = peakHourReviews.length > 0
      ? peakHourReviews.reduce((sum, r) => sum + (r.peakHourDownloadSpeed || 0), 0) / peakHourReviews.length
      : 0

    const avgPeakHourPing = peakHourReviews.length > 0
      ? peakHourReviews.reduce((sum, r) => sum + (r.peakHourPing || 0), 0) / peakHourReviews.length
      : 0

    const avgPeakHourPacketLoss = peakHourReviews.length > 0
      ? peakHourReviews.reduce((sum, r) => sum + (r.peakHourPacketLoss || 0), 0) / peakHourReviews.length
      : 0

    // Get the best performing ISP metrics
    const bestIsp = complex.isps.reduce((best, current) => {
      const currentMetrics = current.ispMetric
      const bestMetrics = best?.ispMetric

      if (!bestMetrics) return current
      
      const currentScore = currentMetrics.avgDownload + currentMetrics.avgUpload - currentMetrics.avgPing
      const bestScore = bestMetrics.avgDownload + bestMetrics.avgUpload - bestMetrics.avgPing

      return currentScore > bestScore ? current : best
    }, complex.isps[0])

    // Check each badge's criteria
    for (const badge of BADGES) {
      const meetsSpeedCriteria = bestIsp && (
        (!badge.criteria.minDownloadSpeed || bestIsp.ispMetric.avgDownload >= badge.criteria.minDownloadSpeed) &&
        (!badge.criteria.minUploadSpeed || bestIsp.ispMetric.avgUpload >= badge.criteria.minUploadSpeed) &&
        (!badge.criteria.maxPing || bestIsp.ispMetric.avgPing <= badge.criteria.maxPing) &&
        (!badge.criteria.minReliability || (bestIsp.ispMetric.reliability ?? 0) >= badge.criteria.minReliability)
      )

      const meetsRatingCriteria = !badge.criteria.minRating || avgRating >= badge.criteria.minRating

      const meetsPeakHourCriteria = (
        (!badge.criteria.minPeakHourRating || avgPeakHourRating >= badge.criteria.minPeakHourRating) &&
        (!badge.criteria.maxPeakHourPacketLoss || avgPeakHourPacketLoss <= badge.criteria.maxPeakHourPacketLoss) &&
        (!badge.criteria.minPeakHourDownload || avgPeakHourDownload >= badge.criteria.minPeakHourDownload) &&
        (!badge.criteria.maxPeakHourPing || avgPeakHourPing <= badge.criteria.maxPeakHourPing)
      )

      const meetsAmenityCriteria = !badge.criteria.requiredAmenities ||
        badge.criteria.requiredAmenities.every(amenity => complex.amenities.includes(amenity))

      if (meetsSpeedCriteria && meetsRatingCriteria && meetsPeakHourCriteria && meetsAmenityCriteria) {
        badges.push(badge.id)
      }
    }

    return badges
  } catch (error) {
    console.error("Failed to calculate complex badges:", error)
    return []
  }
}

export async function updateComplexBadges(complexId: string): Promise<void> {
  try {
    const badges = await calculateComplexBadges(complexId)
    
    await prisma.apartmentComplex.update({
      where: { id: complexId },
      data: { badges }
    })
  } catch (error) {
    console.error("Failed to update complex badges:", error)
  }
} 