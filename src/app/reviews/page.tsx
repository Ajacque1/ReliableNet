import { ISPReviews } from "@/components/ISPReviews"

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ISP Reviews</h1>
      <div className="max-w-4xl mx-auto">
        <ISPReviews ispMetricId="default" />
      </div>
    </div>
  )
} 