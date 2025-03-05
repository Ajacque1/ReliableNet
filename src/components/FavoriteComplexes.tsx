"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface ApartmentComplex {
  id: string
  name: string
  address: string
  city: string
  state: string
  badges: string[]
}

interface FavoriteComplex {
  id: string
  createdAt: string
  complex: ApartmentComplex
}

interface FavoriteComplexesProps {
  favorites: FavoriteComplex[]
  onRemove: (id: string) => void
}

export function FavoriteComplexes({ favorites, onRemove }: FavoriteComplexesProps) {
  const { toast } = useToast()

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove favorite')

      onRemove(id)
      toast({
        title: "Complex removed",
        description: "The complex has been removed from your favorites."
      })
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      toast({
        title: "Error",
        description: "Failed to remove complex from favorites",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="grid gap-4">
      {favorites.map((favorite) => (
        <Card key={favorite.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{favorite.complex.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {favorite.complex.address}, {favorite.complex.city}, {favorite.complex.state}
                </p>
                {favorite.complex.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {favorite.complex.badges.map((badge) => (
                      <Badge key={badge} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/complexes/${favorite.complex.id}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(favorite.id)}
                >
                  <Star className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 