"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

interface NewConversationDialogProps {
  complexId?: string
  onConversationCreated?: (conversationId: string) => void
}

export function NewConversationDialog({ complexId, onConversationCreated }: NewConversationDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [participants, setParticipants] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Split and clean participant IDs
      const participantIds = participants
        .split(",")
        .map(id => id.trim())
        .filter(Boolean)

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim() || null,
          participantIds,
          complexId: complexId || null
        })
      })

      if (!response.ok) throw new Error("Failed to create conversation")

      const data = await response.json()
      setOpen(false)
      toast({
        title: "Conversation created",
        description: "You can now start messaging"
      })

      if (onConversationCreated) {
        onConversationCreated(data.conversation.id)
      } else {
        router.push(`/messages?conversation=${data.conversation.id}`)
      }
    } catch (error) {
      console.error("Failed to create conversation:", error)
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Start a new conversation with other residents
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Conversation Name (Optional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Building Maintenance"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="participants">
                Participant IDs (Comma Separated)
              </Label>
              <Input
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="user1, user2, user3"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || !participants.trim()}
            >
              {loading ? "Creating..." : "Create Conversation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 