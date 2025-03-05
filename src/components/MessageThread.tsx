"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string | null
  }
}

interface MessageThreadProps {
  conversationId: string
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      if (!response.ok) throw new Error("Failed to fetch messages")
      
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: newMessage
        })
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()
      setMessages(prev => [...prev, data.message])
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div>Loading messages...</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col max-w-[70%] space-y-1",
              message.sender.id === session?.user.id ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div
              className={cn(
                "rounded-lg px-4 py-2",
                message.sender.id === session?.user.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{message.sender.name || "Unknown"}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="px-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 