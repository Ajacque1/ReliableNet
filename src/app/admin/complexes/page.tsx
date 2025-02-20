"use client"

import { useState } from "react"
import { ComplexForm } from "@/components/ComplexForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminComplexesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Complexes</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Complex
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ComplexForm
            onComplexAdded={() => {
              setShowForm(false)
              // Optionally refresh the complex list
            }}
          />
        </div>
      )}

      {/* Complex list with edit/delete functionality */}
    </div>
  )
} 