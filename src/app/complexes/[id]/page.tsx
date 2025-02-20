"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { ComplexDetails } from "@/components/ComplexDetails"
import { ReviewForm } from "@/components/ReviewForm"
import { ReviewList } from "@/components/ReviewList"
import type { Complex, ComplexReview } from "@/types/complex"

export default function ComplexDetail() {
  const params = useParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [complex, setComplex] = useState<Complex | null>(null)
  const [reviews, setReviews] = useState<ComplexReview[]>([])

  useEffect(() => {
    const fetchComplex = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!params.id) {
          setError("Complex ID not found")
          return
        }

        const [complexRes, reviewsRes] = await Promise.all([
          fetch(`/api/complexes/${params.id}`),
          fetch(`/api/complexes/${params.id}/reviews`)
        ])

        if (!complexRes.ok) {
          throw new Error("Failed to fetch complex")
        }

        if (!reviewsRes.ok) {
          throw new Error("Failed to fetch reviews")
        }
        
        const [complexData, reviewsData] = await Promise.all([
          complexRes.json(),
          reviewsRes.json()
        ])

        setComplex(complexData)
        setReviews(reviewsData.reviews || [])
      } catch (error) {
        console.error("Error fetching complex:", error)
        setError("Failed to load complex data")
        toast({
          title: "Error",
          description: "Failed to fetch complex data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchComplex()
  }, [params.id, toast])

  const handleReviewSubmitted = (newReview: ComplexReview) => {
    setReviews([newReview, ...reviews])
    toast({
      title: "Success",
      description: "Review submitted successfully"
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !complex) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error || "Complex not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ComplexDetails complex={complex} />
      
      <div className="mt-8">
        {session ? (
          <ReviewForm 
            complexId={params.id as string} 
            onReviewSubmitted={handleReviewSubmitted} 
          />
        ) : (
          <p className="text-center text-gray-600">
            Please sign in to leave a review
          </p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  )
} 