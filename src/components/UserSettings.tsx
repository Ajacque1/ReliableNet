"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface UserSettings {
  name: string | null
  email: string
  notifications: {
    speedTestReminders: boolean
    newReviews: boolean
    ispUpdates: boolean
  }
}

interface UserSettingsProps {
  settings: UserSettings
  onUpdate: (settings: UserSettings) => void
}

export function UserSettings({ settings: initialSettings, onUpdate }: UserSettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) throw new Error('Failed to update settings')

      onUpdate(settings)
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully."
      })
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={settings.name || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Your name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="Your email"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Speed Test Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to run periodic speed tests
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.speedTestReminders}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      speedTestReminders: checked
                    }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new reviews on your favorite complexes
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.newReviews}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      newReviews: checked
                    }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ISP Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about ISP service changes and updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.ispUpdates}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      ispUpdates: checked
                    }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  )
} 