"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { X, Plus, Building } from "lucide-react"

interface ManagementContact {
  name: string
  email: string
  phone: string
}

interface ApartmentComplex {
  id?: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  latitude?: number
  longitude?: number
  website?: string
  amenities: string[]
  managementContact: ManagementContact
}

interface ApartmentComplexFormProps {
  complex?: ApartmentComplex
  onSuccess?: () => void
}

const defaultAmenities = [
  "Fiber Ready",
  "Free WiFi",
  "Ethernet Ports",
  "Cable Ready",
  "Smart Home Features",
  "Tech Support",
  "Business Center",
  "Gaming Lounge",
]

export function ApartmentComplexForm({ complex, onSuccess }: ApartmentComplexFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ApartmentComplex>(complex || {
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    amenities: [],
    managementContact: {
      name: "",
      email: "",
      phone: "",
    },
  })
  const [customAmenity, setCustomAmenity] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = complex?.id
        ? `/api/complexes/${complex.id}`
        : "/api/complexes"
      
      const method = complex?.id ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save apartment complex")
      }

      toast({
        title: "Success",
        description: `Apartment complex ${complex?.id ? "updated" : "created"} successfully`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/complexes")
      }
    } catch (error) {
      console.error("Failed to save apartment complex:", error)
      toast({
        title: "Error",
        description: "Failed to save apartment complex. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const addCustomAmenity = () => {
    if (customAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()],
      }))
      setCustomAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {complex ? "Edit" : "Add"} Apartment Complex
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Complex Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter complex name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Street Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input
                    value={formData.zip}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Management Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Management Contact</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Contact Name</label>
                <Input
                  value={formData.managementContact.name || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    managementContact: {
                      ...prev.managementContact,
                      name: e.target.value,
                    },
                  }))}
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.managementContact.email || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    managementContact: {
                      ...prev.managementContact,
                      email: e.target.value,
                    },
                  }))}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  value={formData.managementContact.phone || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    managementContact: {
                      ...prev.managementContact,
                      phone: e.target.value,
                    },
                  }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Internet & Tech Amenities</h3>
            <div className="space-y-4">
              {/* Default Amenities */}
              <div className="flex flex-wrap gap-2">
                {defaultAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.amenities.includes(amenity)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>

              {/* Custom Amenity Input */}
              <div className="flex gap-2">
                <Input
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  placeholder="Add custom amenity"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomAmenity}
                  disabled={!customAmenity.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected Amenities */}
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="hover:text-primary-foreground/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : complex
                ? "Update Complex"
                : "Add Complex"
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 