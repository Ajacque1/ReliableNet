"use client"

import { ApartmentComplexForm } from "@/components/ApartmentComplexForm"

export default function NewComplexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Apartment Complex</h1>
        <ApartmentComplexForm />
      </div>
    </div>
  )
} 