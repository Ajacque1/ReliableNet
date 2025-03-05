"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  if (!conversations.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No conversations yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={cn(
            "w-full text-left p-3 rounded-lg transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            selectedId === conversation.id && "bg-accent text-accent-foreground",
          )}
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium">
              {conversation.name || conversation.participants.map(p => p.user.name).join(", ")}
            </h3>
            {conversation.lastMessage && (
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground line-clamp-1">
              {conversation.lastMessage?.content || "No messages yet"}
            </p>
            {conversation.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  )
} 