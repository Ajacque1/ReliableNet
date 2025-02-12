import { Navigation } from "@/components/Navigation"
import { SpeedTest } from "@/components/SpeedTest"
import { Features } from "@/components/Features"
import { CTA } from "@/components/CTA"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Find Your Perfect Internet Provider
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Compare speeds, prices, and reviews from top ISPs in your area.
              Make an informed decision with ReliableNet.
            </p>
          </div>

          {/* Speed Test Card */}
          <div className="max-w-2xl mx-auto">
            <SpeedTest />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </main>
  )
}
