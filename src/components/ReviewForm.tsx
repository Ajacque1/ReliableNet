"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Minus, Star } from "lucide-react"

interface ReviewFormProps {
  complexId: string
  onReviewSubmitted: () => void
}

interface ReviewData {
  rating: number
  internetRating: number
  comment: string
  pros: string[]
  cons: string[]
  // Peak Hour Performance
  peakHourRating: number
  peakHourComment: string
  peakHourStart: number
  peakHourEnd: number
  peakHourDownloadSpeed: number
  peakHourUploadSpeed: number
  peakHourPing: number
  peakHourPacketLoss: number
}

export function ReviewForm({ complexId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [review, setReview] = useState<ReviewData>({
    rating: 0,
    internetRating: 0,
    comment: "",
    pros: [""],
    cons: [""],
    // Peak Hour Performance
    peakHourRating: 0,
    peakHourComment: "",
    peakHourStart: 0,
    peakHourEnd: 0,
    peakHourDownloadSpeed: 0,
    peakHourUploadSpeed: 0,
    peakHourPing: 0,
    peakHourPacketLoss: 0
  })

  const handleStarClick = (type: "rating" | "internetRating" | "peakHourRating", value: number) => {
    setReview(prev => ({ ...prev, [type]: value }))
  }

  const handleInputChange = (field: keyof ReviewData, value: string | number) => {
    setReview(prev => ({ ...prev, [field]: value }))
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
      const response = await fetch(`/api/complexes/${complexId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...review,
          pros: review.pros.filter(pro => pro.trim()),
          cons: review.cons.filter(con => con.trim()),
          // Convert string inputs to numbers for peak hour metrics
          peakHourStart: parseInt(review.peakHourStart.toString()),
          peakHourEnd: parseInt(review.peakHourEnd.toString()),
          peakHourDownloadSpeed: parseFloat(review.peakHourDownloadSpeed.toString()),
          peakHourUploadSpeed: parseFloat(review.peakHourUploadSpeed.toString()),
          peakHourPing: parseFloat(review.peakHourPing.toString()),
          peakHourPacketLoss: parseFloat(review.peakHourPacketLoss.toString())
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
        cons: [""],
        peakHourRating: 0,
        peakHourComment: "",
        peakHourStart: 0,
        peakHourEnd: 0,
        peakHourDownloadSpeed: 0,
        peakHourUploadSpeed: 0,
        peakHourPing: 0,
        peakHourPacketLoss: 0
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

  const renderStars = (type: "rating" | "internetRating" | "peakHourRating", value: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className="p-0 w-8 h-8"
          onClick={() => handleStarClick(type, star)}
        >
          <Star
            className={`h-6 w-6 ${
              star <= value
                ? "fill-primary text-primary"
                : "fill-none text-muted-foreground"
            }`}
          />
        </Button>
      ))}
    </div>
  )

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
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            {renderStars("rating", review.rating)}
          </div>

          {/* Internet Rating */}
          <div className="space-y-2">
            <Label>Internet Rating</Label>
            {renderStars("internetRating", review.internetRating)}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>Review Comment</Label>
            <Textarea
              value={review.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              placeholder="Share your experience..."
            />
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label>Pros</Label>
            {review.pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={pro}
                  onChange={(e) => handleProConChange("pros", index, e.target.value)}
                  placeholder="Add a pro..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeProCon("pros", index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addProCon("pros")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pro
            </Button>
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label>Cons</Label>
            {review.cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={con}
                  onChange={(e) => handleProConChange("cons", index, e.target.value)}
                  placeholder="Add a con..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeProCon("cons", index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addProCon("cons")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Con
            </Button>
          </div>

          {/* Peak Hour Performance Section */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Peak Hour Performance</h3>
            
            {/* Peak Hour Rating */}
            <div className="space-y-2">
              <Label>Performance During Peak Hours</Label>
              {renderStars("peakHourRating", review.peakHourRating)}
            </div>

            {/* Peak Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Peak Hours Start (24h)</Label>
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={review.peakHourStart}
                  onChange={(e) => handleInputChange("peakHourStart", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Peak Hours End (24h)</Label>
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={review.peakHourEnd}
                  onChange={(e) => handleInputChange("peakHourEnd", e.target.value)}
                />
              </div>
            </div>

            {/* Peak Hour Speeds */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Download Speed (Mbps)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={review.peakHourDownloadSpeed}
                  onChange={(e) => handleInputChange("peakHourDownloadSpeed", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Speed (Mbps)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={review.peakHourUploadSpeed}
                  onChange={(e) => handleInputChange("peakHourUploadSpeed", e.target.value)}
                />
              </div>
            </div>

            {/* Peak Hour Network Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ping (ms)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={review.peakHourPing}
                  onChange={(e) => handleInputChange("peakHourPing", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Packet Loss (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={review.peakHourPacketLoss}
                  onChange={(e) => handleInputChange("peakHourPacketLoss", e.target.value)}
                />
              </div>
            </div>

            {/* Peak Hour Comment */}
            <div className="space-y-2">
              <Label>Peak Hour Comments</Label>
              <Textarea
                value={review.peakHourComment}
                onChange={(e) => handleInputChange("peakHourComment", e.target.value)}
                placeholder="Share your experience during peak hours..."
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 