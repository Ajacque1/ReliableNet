import { Shield, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" strokeWidth={2.5} />,
    title: "Lightning Fast",
    description:
      "Get accurate speed comparisons and real-time performance metrics for all major ISPs in your area.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" strokeWidth={2.5} />,
    title: "Reliable Service",
    description:
      "We verify and monitor ISP reliability scores to ensure you get the most stable connection possible.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" strokeWidth={2.5} />,
    title: "User Reviews",
    description:
      "Read authentic user experiences and ratings from verified customers in your neighborhood.",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Why Choose ReliableNet?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 