"use client"

import { useState } from "react"
import { ComplexList } from "@/components/ComplexList"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin } from "lucide-react"
import { ApartmentComplexList } from "@/components/ApartmentComplexList"

export const metadata = {
  title: "Apartment Complexes | ReliableNet",
  description: "Find and compare internet service providers in apartment complexes near you."
}

export default function ComplexesPage() {
  const [location, setLocation] = useState({
    city: "",
    state: ""
  })

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ComplexList component will handle the actual filtering
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Find Internet Reviews by Apartment Complex
        </h1>
        <p className="text-muted-foreground mb-8">
          Compare internet service providers and read reviews from residents in apartment complexes near you.
        </p>

        <ApartmentComplexList />
      </div>
    </div>
  )
} 