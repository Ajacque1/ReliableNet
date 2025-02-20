"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ReviewFormProps {
  complexId: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ complexId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [review, setReview] = useState({
    rating: 0,
    internetRating: 0,
    comment: "",
    pros: [""],
    cons: [""]
  })

  const handleStarClick = (type: "rating" | "internetRating", value: number) => {
    setReview(prev => ({ ...prev, [type]: value }))
  }

  const handleProConChange = (
    type: "pros" | "cons",
    index: number,
    value: string
  ) => {
    setReview(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? value : item))
    }))
  }

  const addProCon = (type: "pros" | "cons") => {
    setReview(prev => ({
      ...prev,
      [type]: [...prev[type], ""]
    }))
  }

  const removeProCon = (type: "pros" | "cons", index: number) => {
    setReview(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
        variant: "destructive"
      })
      return
    }

    if (review.rating === 0 || review.internetRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide both overall and internet ratings",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/apartments/${complexId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...review,
          pros: review.pros.filter(pro => pro.trim()),
          cons: review.cons.filter(con => con.trim())
        })
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      })

      setReview({
        rating: 0,
        internetRating: 0,
        comment: "",
        pros: [""],
        cons: [""]
      })

      onReviewSubmitted()
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to leave a review
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Overall Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick("rating", value)}
                  className={`p-1 ${
                    value <= review.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Internet Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Internet Quality Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick("internetRating", value)}
                  className={`p-1 ${
                    value <= review.internetRating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Review
            </label>
            <Textarea
              value={review.comment}
              onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience with the internet service in this building..."
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Pros */}
          <div>
            <label className="block text-sm font-medium mb-2">Pros</label>
            {review.pros.map((pro, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => handleProConChange("pros", index, e.target.value)}
                  placeholder="Add a pro"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeProCon("pros", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addProCon("pros")}
            >
              Add Pro
            </Button>
          </div>

          {/* Cons */}
          <div>
            <label className="block text-sm font-medium mb-2">Cons</label>
            {review.cons.map((con, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => handleProConChange("cons", index, e.target.value)}
                  placeholder="Add a con"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeProCon("cons", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addProCon("cons")}
            >
              Add Con
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 