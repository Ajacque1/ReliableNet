import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get all conversations for the user with last message and unread count
    const conversations = await prisma.userConversation.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        conversation: {
          include: {
            messages: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1,
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        lastReadAt: true
      }
    })

    // Transform the data for the client
    const formattedConversations = conversations.map(({ conversation, lastReadAt }) => {
      const lastMessage = conversation.messages[0]
      const unreadCount = conversation.messages.filter(
        msg => new Date(msg.createdAt) > new Date(lastReadAt)
      ).length

      return {
        id: conversation.id,
        name: conversation.name,
        complexId: conversation.complexId,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt.toISOString()
        } : null,
        participants: conversation.participants.map(p => ({
          user: {
            id: p.user.id,
            name: p.user.name
          }
        })),
        unreadCount
      }
    })

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error("Failed to fetch conversations:", error)
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, participantIds, complexId } = data

    // Validate participants
    if (!participantIds?.length) {
      return NextResponse.json(
        { error: "At least one participant is required" },
        { status: 400 }
      )
    }

    // Create the conversation
    const conversation = await prisma.conversation.create({
      data: {
        name,
        complexId,
        participants: {
          create: [
            // Add the creator
            {
              userId: session.user.id
            },
            // Add other participants
            ...participantIds.map((id: string) => ({
              userId: id
            }))
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Failed to create conversation:", error)
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    )
  }
} 