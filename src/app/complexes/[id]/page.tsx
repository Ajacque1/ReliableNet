"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { ComplexDetails } from "@/components/ComplexDetails"
import { ReviewForm } from "@/components/ReviewForm"
import { ReviewList } from "@/components/ReviewList"

export default function ComplexDetail() {
  const params = useParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [complex, setComplex] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    const fetchComplex = async () => {
      try {
        const [complexRes, reviewsRes] = await Promise.all([
          fetch(`/api/complexes/${params.id}`),
          fetch(`/api/complexes/${params.id}/reviews`)
        ])
        
        const [complexData, reviewsData] = await Promise.all([
          complexRes.json(),
          reviewsRes.json()
        ])

        setComplex(complexData)
        setReviews(reviewsData.reviews)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch complex data",
          variant: "destructive"
        })
      }
    }

    fetchComplex()
  }, [params.id, toast])

  const handleReviewSubmitted = (newReview: any) => {
    setReviews([newReview, ...reviews])
    toast({
      title: "Success",
      description: "Review submitted successfully"
    })
  }

  if (!complex) {
    return <div>Loading...</div>
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