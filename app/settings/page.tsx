"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      email: false,
    },
  })

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin")
      return
    }

    // Initialize form with user data
    setFormData({
      username: session.user.name || "",
      email: session.user.email || "",
      notifications: {
        likes: true,
        comments: true,
        follows: true,
        email: false,
      },
    })
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await update() // Update session
        toast({
          title: "Success",
          description: "Settings updated successfully",
        })
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback className="text-xl">{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your profile picture is managed through your Google account
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    disabled
                  />
                  <p className="text-xs text-gray-500">Email is managed through your Google account</p>
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Like Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when someone likes your prompts</p>
              </div>
              <Switch
                checked={formData.notifications.likes}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, likes: checked },
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Comment Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when someone comments on your prompts
                </p>
              </div>
              <Switch
                checked={formData.notifications.comments}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, comments: checked },
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Follow Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when someone follows you</p>
              </div>
              <Switch
                checked={formData.notifications.follows}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, follows: checked },
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
              </div>
              <Switch
                checked={formData.notifications.email}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-lg border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Delete Account</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
