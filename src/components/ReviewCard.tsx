"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { useSession } from "next-auth/react"
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
  // Peak Hour Performance
  peakHourRating: number | null
  peakHourComment: string | null
  peakHourStart: number | null
  peakHourEnd: number | null
  peakHourDownloadSpeed: number | null
  peakHourUploadSpeed: number | null
  peakHourPing: number | null
  peakHourPacketLoss: number | null
  user: {
    name: string | null
  }
}

interface ReviewCardProps {
  review: Review
  onVote: () => void
}

export function ReviewCard({ review, onVote }: ReviewCardProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on reviews",
        variant: "destructive"
      })
      return
    }

    try {
      setIsVoting(true)
      const response = await fetch(`/api/reviews/${review.id}/vote`, {
        method: "POST"
      })

      if (!response.ok) throw new Error("Failed to vote")

      onVote()
      toast({
        title: "Vote submitted",
        description: "Thank you for your feedback!"
      })
    } catch (error) {
      console.error("Failed to submit vote:", error)
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive"
      })
    } finally {
      setIsVoting(false)
    }
  }

  const formatTime = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleTimeString([], {
      hour: 'numeric',
      hour12: true
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">
                {review.user.name || "Anonymous"}
              </div>
              {review.verified && (
                <Badge variant="secondary">
                  Verified Resident
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

        {/* Peak Hour Performance Section */}
        {review.peakHourRating && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-3">Peak Hour Performance</h4>
            
            {/* Peak Hours */}
            {review.peakHourStart !== null && review.peakHourEnd !== null && (
              <div className="text-sm mb-2">
                <span className="text-muted-foreground">Peak Hours: </span>
                {formatTime(review.peakHourStart)} - {formatTime(review.peakHourEnd)}
              </div>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              {review.peakHourDownloadSpeed !== null && (
                <div>
                  <div className="text-sm font-medium">Download</div>
                  <div className="text-lg">{review.peakHourDownloadSpeed} Mbps</div>
                </div>
              )}
              {review.peakHourUploadSpeed !== null && (
                <div>
                  <div className="text-sm font-medium">Upload</div>
                  <div className="text-lg">{review.peakHourUploadSpeed} Mbps</div>
                </div>
              )}
              {review.peakHourPing !== null && (
                <div>
                  <div className="text-sm font-medium">Ping</div>
                  <div className="text-lg">{review.peakHourPing} ms</div>
                </div>
              )}
              {review.peakHourPacketLoss !== null && (
                <div>
                  <div className="text-sm font-medium">Packet Loss</div>
                  <div className="text-lg">{review.peakHourPacketLoss}%</div>
                </div>
              )}
            </div>

            {/* Peak Hour Rating */}
            <div className="text-sm mb-2">
              <span className="text-muted-foreground">Peak Hour Rating: </span>
              {review.peakHourRating}/5
            </div>

            {/* Peak Hour Comment */}
            {review.peakHourComment && (
              <p className="text-sm mt-2">{review.peakHourComment}</p>
            )}
          </div>
        )}

        {/* Helpful Button */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">
            {review.helpfulCount} people found this helpful
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleVote}
            disabled={isVoting}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 