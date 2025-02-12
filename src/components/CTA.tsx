import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Internet Provider?
          </h2>
          
          <p className="text-lg text-white/90 mb-8">
            Compare prices, speeds, and reviews from top ISPs in your area.
            Get connected with the best service for your needs.
          </p>

          <Button 
            size="lg" 
            variant="secondary"
            className="group bg-white text-primary hover:bg-white/90 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
} 