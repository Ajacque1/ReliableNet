import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SpeedTestHistory } from "@/components/SpeedTestHistory"
import { SavedComparisons } from "@/components/SavedComparisons"
import { FavoriteComplexes } from "@/components/FavoriteComplexes"
import { UserSettings } from "@/components/UserSettings"
import { prisma } from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Star, BookmarkCheck, Settings } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

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

  // Convert Date objects to ISO strings for speed tests and handle nullable fields
  const formattedSpeedTests = userData.speedTests.map(test => ({
    id: test.id,
    downloadSpeed: test.downloadSpeed,
    uploadSpeed: test.uploadSpeed,
    ping: test.ping,
    createdAt: test.createdAt.toISOString(),
    isp: test.isp || 'Unknown'
  }))

  // Convert Date objects to ISO strings for saved comparisons
  const formattedComparisons = userData.savedComparisons.map(comparison => ({
    id: comparison.id,
    name: comparison.name,
    ispIds: comparison.ispIds,
    createdAt: comparison.createdAt.toISOString()
  }))

  // Convert Date objects to ISO strings for favorites and format complex data
  const formattedFavorites = userData.favoriteComplexes.map(favorite => ({
    id: favorite.id,
    createdAt: favorite.createdAt.toISOString(),
    complex: {
      id: favorite.complex.id,
      name: favorite.complex.name,
      address: favorite.complex.address,
      city: favorite.complex.city,
      state: favorite.complex.state,
      badges: favorite.complex.badges
    }
  }))

  // Format user settings with default notifications if null
  const defaultNotifications = {
    speedTestReminders: false,
    newReviews: false,
    ispUpdates: false
  }

  const userSettings = {
    name: userData.name,
    email: userData.email,
    notifications: typeof userData.notifications === 'object' && userData.notifications !== null
      ? {
          speedTestReminders: Boolean((userData.notifications as any).speedTestReminders),
          newReviews: Boolean((userData.notifications as any).newReviews),
          ispUpdates: Boolean((userData.notifications as any).ispUpdates)
        }
      : defaultNotifications
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
            speedTests={formattedSpeedTests}
          />
        </TabsContent>

        <TabsContent value="saved">
          <SavedComparisons
            comparisons={formattedComparisons}
            onDelete={(id) => {
              // Handled by client component
            }}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoriteComplexes
            favorites={formattedFavorites}
            onRemove={(id) => {
              // Handled by client component
            }}
          />
        </TabsContent>

        <TabsContent value="settings">
          <UserSettings
            settings={userSettings}
            onUpdate={(settings) => {
              // Handled by client component
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 