"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, Search } from "lucide-react"
import { ConversationList } from "@/components/ConversationList"
import { MessageThread } from "@/components/MessageThread"
import { NewConversationDialog } from "@/components/NewConversationDialog"

interface Conversation {
  id: string
  name: string | null
  complexId: string | null
  lastMessage: {
    content: string
    createdAt: string
  } | null
  participants: {
    user: {
      id: string
      name: string | null
    }
  }[]
  unreadCount: number
}

function MessagesContent() {
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    searchParams.get("conversation")
  )
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      if (!response.ok) throw new Error("Failed to fetch conversations")
      
      const data = await response.json()
      setConversations(data.conversations)
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading conversations...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <NewConversationDialog
          onConversationCreated={(id) => {
            fetchConversations()
            setSelectedConversation(id)
          }}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Conversations List */}
        <div className="col-span-4">
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversation}
                onSelect={setSelectedConversation}
              />
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="col-span-8">
          <Card>
            <CardContent className="p-0 h-[600px]">
              {selectedConversation ? (
                <MessageThread conversationId={selectedConversation} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a conversation to start messaging
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  )
} 