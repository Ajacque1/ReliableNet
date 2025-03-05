"use client"

import { useEffect, useState, useCallback, useRef } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

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
  speedRating: number
  reliabilityRating: number
  valueRating: number
  supportRating: number
  installationRating?: number
  isVerified: boolean
  verificationProof?: string
  moderationStatus: string
  photos: string[]
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
    speedRating: 0,
    reliabilityRating: 0,
    valueRating: 0,
    supportRating: 0,
    installationRating: 0,
    photos: [] as string[],
    verificationProof: "",
  })
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [filterVerified, setFilterVerified] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('photos', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload photos')

      const { urls } = await response.json()
      setNewReview(prev => ({
        ...prev,
        photos: [...prev.photos, ...urls]
      }))

      toast({
        title: "Success",
        description: "Photos uploaded successfully",
      })
    } catch (error) {
      console.error('Failed to upload photos:', error)
      toast({
        title: "Error",
        description: "Failed to upload photos",
        variant: "destructive",
      })
    }
  }

  const handleVerificationProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('proof', file)

      const response = await fetch('/api/upload-proof', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload verification proof')

      const { url } = await response.json()
      setNewReview(prev => ({
        ...prev,
        verificationProof: url
      }))

      toast({
        title: "Success",
        description: "Verification proof uploaded successfully",
      })
    } catch (error) {
      console.error('Failed to upload verification proof:', error)
      toast({
        title: "Error",
        description: "Failed to upload verification proof",
        variant: "destructive",
      })
    }
  }

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

      if (!response.ok) throw new Error('Failed to submit review')

      toast({
        title: "Review submitted",
        description: "Your review is pending moderation. Thank you for your feedback!",
      })

      setNewReview({
        rating: 0,
        comment: "",
        pros: [""],
        cons: [""],
        speedRating: 0,
        reliabilityRating: 0,
        valueRating: 0,
        supportRating: 0,
        installationRating: 0,
        photos: [],
        verificationProof: "",
      })
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

  const filteredReviews = reviews
    .filter(review => !filterVerified || review.isVerified)
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`speed-${star}`}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, speedRating: star })}
                        className={`p-1 ${
                          star <= newReview.speedRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        <StarIcon className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reliability Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`reliability-${star}`}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, reliabilityRating: star })}
                        className={`p-1 ${
                          star <= newReview.reliabilityRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        <StarIcon className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`value-${star}`}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, valueRating: star })}
                        className={`p-1 ${
                          star <= newReview.valueRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        <StarIcon className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`support-${star}`}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, supportRating: star })}
                        className={`p-1 ${
                          star <= newReview.supportRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        <StarIcon className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Installation Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`installation-${star}`}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, installationRating: star })}
                        className={`p-1 ${
                          star <= newReview.installationRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        <StarIcon className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Textarea
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Photos (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photos
                </Button>
                {newReview.photos.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {newReview.photos.map((photo, index) => (
                      <Image
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Verification Proof (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleVerificationProof}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Proof
                </Button>
                {newReview.verificationProof && (
                  <p className="mt-2 text-sm text-green-600">
                    Verification proof uploaded successfully
                  </p>
                )}
              </div>

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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={filterVerified}
            onCheckedChange={(checked) => setFilterVerified(checked as boolean)}
          />
          <label htmlFor="verified" className="text-sm">
            Show Verified Reviews Only
          </label>
        </div>

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
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
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
                    {review.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified Review
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Speed</p>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.speedRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Reliability</p>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.reliabilityRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Value</p>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.valueRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Support</p>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.supportRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Installation</p>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < (review.installationRating ?? 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm mb-4">{review.comment}</p>

              {review.photos.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.photos.map((photo, index) => (
                    <Image
                      key={index}
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover rounded cursor-pointer"
                      onClick={() => {/* Add photo preview modal */}}
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-600 mb-2">Pros</h4>
                  <ul className="list-disc list-inside text-sm">
                    {review.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-2">Cons</h4>
                  <ul className="list-disc list-inside text-sm">
                    {review.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 