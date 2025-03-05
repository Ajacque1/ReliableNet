import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SpeedTestHistory } from "@/components/SpeedTestHistory"
import { SavedComparisons } from "@/components/SavedComparisons"
import { FavoriteComplexes } from "@/components/FavoriteComplexes"
import { UserSettings } from "@/components/UserSettings"
import { prisma } from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Star, BookmarkCheck, Settings } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // Fetch user data including speed tests, saved comparisons, and favorites
  const userData = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      speedTests: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      savedComparisons: true,
      favoriteComplexes: {
        include: {
          complex: true
        }
      }
    }
  })

  if (!userData) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData.name || 'User'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="speed-tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="speed-tests" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Speed Tests
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4" />
            Saved Comparisons
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="speed-tests">
          <SpeedTestHistory 
            userId={session.user.id} 
            speedTests={userData.speedTests}
          />
        </TabsContent>

        <TabsContent value="saved">
          <SavedComparisons
            comparisons={userData.savedComparisons}
            onDelete={async () => {
              'use server'
              // Handled by client component
            }}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoriteComplexes
            favorites={userData.favoriteComplexes}
            onRemove={async () => {
              'use server'
              // Handled by client component
            }}
          />
        </TabsContent>

        <TabsContent value="settings">
          <UserSettings
            settings={{
              name: userData.name,
              email: userData.email,
              notifications: userData.notifications
            }}
            onUpdate={async () => {
              'use server'
              // Handled by client component
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 