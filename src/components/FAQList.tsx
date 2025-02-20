"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful: number
  notHelpful: number
}

interface FAQListProps {
  searchQuery: string
}

export function FAQList({ searchQuery }: FAQListProps) {
  const { toast } = useToast()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFAQs()
  }, [searchQuery])

  const fetchFAQs = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) {
        params.set("q", searchQuery)
      }

      const response = await fetch(`/api/faqs?${params}`)
      if (!response.ok) throw new Error("Failed to fetch FAQs")
      
      const data = await response.json()
      setFaqs(data.faqs)
    } catch (error) {
      console.error("Failed to fetch FAQs:", error)
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (faqId: string, voteType: "helpful" | "notHelpful") => {
    try {
      const response = await fetch(`/api/faqs/${faqId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ voteType })
      })

      if (!response.ok) throw new Error("Failed to submit vote")

      const data = await response.json()
      setFaqs(prev => prev.map(faq => 
        faq.id === faqId ? { ...faq, [voteType]: data.faq[voteType] } : faq
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
    return <div>Loading FAQs...</div>
  }

  if (!faqs.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery
          ? "No FAQs found matching your search"
          : "No FAQs available yet"}
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start text-left">
              <h3 className="font-medium">{faq.question}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">
                  {faq.category}
                </Badge>
                {faq.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none pt-2 pb-4">
              {faq.answer}
            </div>
            <div className="flex items-center justify-end gap-2 border-t pt-4">
              <span className="text-sm text-muted-foreground">
                Was this helpful?
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(faq.id, "helpful")}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {faq.helpful}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(faq.id, "notHelpful")}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {faq.notHelpful}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
} 