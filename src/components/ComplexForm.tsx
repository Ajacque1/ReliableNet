"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface ComplexFormProps {
  onComplexAdded?: (complex: any) => void
}

export function ComplexForm({ onComplexAdded }: ComplexFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    website: "",
    amenities: [] as string[],
    currentAmenity: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/complexes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          website: formData.website || undefined,
          amenities: formData.amenities
        })
      })

      if (!res.ok) throw new Error("Failed to create complex")

      const complex = await res.json()
      onComplexAdded?.(complex)
      
      // Reset form
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        website: "",
        amenities: [],
        currentAmenity: ""
      })

      toast({
        title: "Success",
        description: "Apartment complex added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add apartment complex",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Complex</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Complex Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
              placeholder="Enter complex name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              required
              value={formData.address}
              onChange={(e) => setFormData(f => ({ ...f, address: e.target.value }))}
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                required
                value={formData.city}
                onChange={(e) => setFormData(f => ({ ...f, city: e.target.value }))}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Input
                required
                value={formData.state}
                onChange={(e) => setFormData(f => ({ ...f, state: e.target.value }))}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP Code</label>
              <Input
                required
                value={formData.zip}
                onChange={(e) => setFormData(f => ({ ...f, zip: e.target.value }))}
                placeholder="ZIP"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Website (Optional)</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(f => ({ ...f, website: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Internet Amenities</label>
            <div className="flex space-x-2">
              <Input
                value={formData.currentAmenity}
                onChange={(e) => setFormData(f => ({ ...f, currentAmenity: e.target.value }))}
                placeholder="e.g., Fiber Ready"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (formData.currentAmenity) {
                    setFormData(f => ({
                      ...f,
                      amenities: [...f.amenities, f.currentAmenity],
                      currentAmenity: ""
                    }))
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {amenity}
                  <button
                    type="button"
                    className="ml-2 hover:text-red-500"
                    onClick={() => {
                      setFormData(f => ({
                        ...f,
                        amenities: f.amenities.filter((_, i) => i !== index)
                      }))
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Complex...
              </>
            ) : (
              "Add Complex"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 