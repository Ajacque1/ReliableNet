"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StarIcon, ThumbsUp, ThumbsDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Review {
  id: string
  rating: number
  internetRating: number
  comment: string
  pros: string[]
  cons: string[]
  helpfulCount: number
  createdAt: string
  user: {
    name: string
  }
}

interface ReviewListProps {
  reviews: Review[]
  onHelpfulClick?: (reviewId: string) => void
}

export function ReviewList({ reviews, onHelpfulClick }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 font-medium">Internet Rating: {review.internetRating}/5</p>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <button 
                  onClick={() => onHelpfulClick?.(review.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.helpfulCount}</span>
                </button>
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-600 mb-4">{review.comment}</p>
            )}

            <div className="space-y-2">
              {review.pros.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-600">Pros</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {review.pros.map((pro, index) => (
                      <span 
                        key={index}
                        className="bg-green-50 text-green-700 text-sm px-2 py-1 rounded-full"
                      >
                        {pro}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {review.cons.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-600">Cons</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {review.cons.map((con, index) => (
                      <span 
                        key={index}
                        className="bg-red-50 text-red-700 text-sm px-2 py-1 rounded-full"
                      >
                        {con}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Posted by {review.user.name}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 