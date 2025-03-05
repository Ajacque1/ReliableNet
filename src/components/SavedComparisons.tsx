"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SavedComparison {
  id: string
  name: string
  ispIds: string[]
  createdAt: string
}

interface SavedComparisonsProps {
  comparisons: SavedComparison[]
  onDelete: (id: string) => void
}

export function SavedComparisons({ comparisons, onDelete }: SavedComparisonsProps) {
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/comparisons/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete comparison')

      onDelete(id)
      toast({
        title: "Comparison deleted",
        description: "The saved comparison has been removed."
      })
    } catch (error) {
      console.error('Failed to delete comparison:', error)
      toast({
        title: "Error",
        description: "Failed to delete comparison",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="grid gap-4">
      {comparisons.map((comparison) => (
        <Card key={comparison.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{comparison.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Saved on {new Date(comparison.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/isp-comparison?ids=${comparison.ispIds.join(',')}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Comparison</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this saved comparison? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(comparison.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 