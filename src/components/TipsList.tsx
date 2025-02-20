"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface Tip {
  id: string
  title: string
  content: string
  category: {
    name: string
    slug: string
  }
  tags: string[]
  helpful: number
  notHelpful: number
}

interface TipsListProps {
  searchQuery: string
}

export function TipsList({ searchQuery }: TipsListProps) {
  const { toast } = useToast()
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTips()
  }, [searchQuery])

  const fetchTips = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) {
        params.set("q", searchQuery)
      }

      const response = await fetch(`/api/tips?${params}`)
      if (!response.ok) throw new Error("Failed to fetch tips")
      
      const data = await response.json()
      setTips(data.tips)
    } catch (error) {
      console.error("Failed to fetch tips:", error)
      toast({
        title: "Error",
        description: "Failed to load tips",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (tipId: string, voteType: "helpful" | "notHelpful") => {
    try {
      const response = await fetch(`/api/tips/${tipId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ voteType })
      })

      if (!response.ok) throw new Error("Failed to submit vote")

      const data = await response.json()
      setTips(prev => prev.map(tip => 
        tip.id === tipId ? { ...tip, [voteType]: data.tip[voteType] } : tip
      ))
    } catch (error) {
      console.error("Failed to submit vote:", error)
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div>Loading tips...</div>
  }

  if (!tips.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery
          ? "No tips found matching your search"
          : "No tips available yet"}
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {tips.map((tip) => (
        <AccordionItem key={tip.id} value={tip.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start text-left">
              <h3 className="font-medium">{tip.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">
                  {tip.category.name}
                </Badge>
                {tip.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none pt-2 pb-4">
              {tip.content}
            </div>
            <div className="flex items-center justify-end gap-2 border-t pt-4">
              <span className="text-sm text-muted-foreground">
                Was this helpful?
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(tip.id, "helpful")}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {tip.helpful}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(tip.id, "notHelpful")}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {tip.notHelpful}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
} 