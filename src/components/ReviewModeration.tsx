"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Review {
  id: string
  rating: number
  internetRating: number
  comment: string
  pros: string[]
  cons: string[]
  verified: boolean
  helpfulCount: number
  createdAt: string
  user: {
    name: string | null
  }
}

interface ReviewModerationProps {
  reviews: Review[]
  onReviewUpdated: () => void
}

export function ReviewModeration({ reviews, onReviewUpdated }: ReviewModerationProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleVerifyReview = async (reviewId: string) => {
    try {
      setLoading(reviewId)
      const response = await fetch(`/api/reviews/${reviewId}/verify`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to verify review')
      }

      toast({
        title: "Review verified",
        description: "The review has been marked as verified.",
      })

      onReviewUpdated()
    } catch (error) {
      console.error('Failed to verify review:', error)
      toast({
        title: "Error",
        description: "Failed to verify review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  const handleRemoveReview = async (reviewId: string) => {
    try {
      setLoading(reviewId)
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to remove review')
      }

      toast({
        title: "Review removed",
        description: "The review has been removed successfully.",
      })

      onReviewUpdated()
    } catch (error) {
      console.error('Failed to remove review:', error)
      toast({
        title: "Error",
        description: "Failed to remove review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  const handleFlagReview = async (reviewId: string) => {
    try {
      setLoading(reviewId)
      const response = await fetch(`/api/reviews/${reviewId}/flag`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to flag review')
      }

      toast({
        title: "Review flagged",
        description: "The review has been flagged for further review.",
      })

      onReviewUpdated()
    } catch (error) {
      console.error('Failed to flag review:', error)
      toast({
        title: "Error",
        description: "Failed to flag review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Review Moderation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">
                          {review.user.name || "Anonymous"}
                        </div>
                        {review.verified ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        Overall: {review.rating}/5
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Internet: {review.internetRating}/5
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="mt-4">{review.comment}</p>
                  )}

                  {(review.pros.length > 0 || review.cons.length > 0) && (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {review.pros.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Pros</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {review.pros.map((pro, index) => (
                              <li key={index} className="text-sm">{pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.cons.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">Cons</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {review.cons.map((con, index) => (
                              <li key={index} className="text-sm">{con}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-end space-x-2">
                    {!review.verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyReview(review.id)}
                        disabled={loading === review.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagReview(review.id)}
                      disabled={loading === review.id}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Flag
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={loading === review.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this review? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveReview(review.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 