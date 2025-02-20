"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

interface ReviewFormProps {
  complexId: string
  onReviewSubmitted: (review: any) => void
}

export function ReviewForm({ complexId, onReviewSubmitted }: ReviewFormProps) {
  const [review, setReview] = useState({
    rating: 5,
    internetRating: 5,
    comment: "",
    pros: [] as string[],
    cons: [] as string[],
    currentPro: "",
    currentCon: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch(`/api/complexes/${complexId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: review.rating,
          internetRating: review.internetRating,
          comment: review.comment,
          pros: review.pros,
          cons: review.cons
        })
      })

      const data = await res.json()
      onReviewSubmitted(data)
      
      // Reset form
      setReview({
        rating: 5,
        internetRating: 5,
        comment: "",
        pros: [],
        cons: [],
        currentPro: "",
        currentCon: ""
      })
    } catch (error) {
      console.error("Failed to submit review:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Overall Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({ ...review, rating: star })}
                  className={`p-1 ${review.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                >
                  <StarIcon className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Internet Quality</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({ ...review, internetRating: star })}
                  className={`p-1 ${review.internetRating >= star ? "text-yellow-400" : "text-gray-300"}`}
                >
                  <StarIcon className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              placeholder="Share your experience..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pros</label>
            <div className="flex space-x-2">
              <Input
                value={review.currentPro}
                onChange={(e) => setReview({ ...review, currentPro: e.target.value })}
                placeholder="Add a pro..."
              />
              <Button
                type="button"
                onClick={() => {
                  if (review.currentPro) {
                    setReview({
                      ...review,
                      pros: [...review.pros, review.currentPro],
                      currentPro: ""
                    })
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {review.pros.map((pro, index) => (
                <div key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {pro}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cons</label>
            <div className="flex space-x-2">
              <Input
                value={review.currentCon}
                onChange={(e) => setReview({ ...review, currentCon: e.target.value })}
                placeholder="Add a con..."
              />
              <Button
                type="button"
                onClick={() => {
                  if (review.currentCon) {
                    setReview({
                      ...review,
                      cons: [...review.cons, review.currentCon],
                      currentCon: ""
                    })
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {review.cons.map((con, index) => (
                <div key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                  {con}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 