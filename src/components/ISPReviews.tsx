"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon, ThumbsUp, ThumbsDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ISPReviewsProps {
  ispMetricId: string
}

interface Review {
  id: string
  rating: number
  comment: string
  pros: string[]
  cons: string[]
  createdAt: string
  helpful: number
  notHelpful: number
  user: {
    name: string | null
  }
}

export function ISPReviews({ ispMetricId }: ISPReviewsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    pros: [""],
    cons: [""],
  })
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/isp/reviews/${ispMetricId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(data.reviews)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [ispMetricId, toast])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/isp/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ispMetricId,
          ...newReview,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      setNewReview({ rating: 0, comment: "", pros: [""], cons: [""] })
      fetchReviews()
    } catch (error) {
      console.error('Failed to submit review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleVote = async (reviewId: string, voteType: 'helpful' | 'notHelpful') => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on reviews",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/isp/reviews/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          voteType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit vote')
      }

      fetchReviews()
      toast({
        title: "Vote recorded",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error('Failed to submit vote:', error)
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sortedAndFilteredReviews = reviews
    .filter(review => !filterRating || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'helpful':
          return b.helpful - a.helpful
        case 'rating':
          return b.rating - a.rating
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  if (loading) {
    return <div>Loading reviews...</div>
  }

  return (
    <div className="space-y-6">
      {session && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submitReview} className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`p-1 ${
                      star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <StarIcon className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
              />
              <Button type="submit">Submit Review</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <Select
          value={filterRating?.toString() || "all"}
          onValueChange={(value) => 
            setFilterRating(value === "all" ? null : parseInt(value))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => 
            setSortBy(value as typeof sortBy)
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {sortedAndFilteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex space-x-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By {review.user.name || 'Anonymous'}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <button 
                    type="button"
                    className="flex items-center space-x-1 hover:text-primary"
                    onClick={() => handleVote(review.id, 'helpful')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful}</span>
                  </button>
                  <button 
                    type="button"
                    className="flex items-center space-x-1 hover:text-primary"
                    onClick={() => handleVote(review.id, 'notHelpful')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{review.notHelpful}</span>
                  </button>
                </div>
              </div>
              <p className="text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 