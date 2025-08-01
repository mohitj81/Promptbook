"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  _id: string
  message: string
  type: "like" | "comment" | "follow" | "system"
  read: boolean
  createdAt: string
  relatedPrompt?: {
    _id: string
    title: string
  }
  fromUser?: {
    _id: string
    username: string
    image: string
  }
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin")
      return
    }
    fetchNotifications()
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      })

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      })

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️"
      case "comment":
        return "💬"
      case "follow":
        return "👤"
      default:
        return "🔔"
    }
  }

  const filteredNotifications = notifications.filter((notification) => filter === "all" || !notification.read)

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!session?.user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">
            {unreadCount > 0 && (
              <span className="font-medium text-blue-600">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Unread
              </Button>
            </div>

            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-blue-600 hover:text-blue-700">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {filter === "unread"
                ? "All caught up! Check back later for new notifications."
                : "When you get notifications, they'll show up here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification._id}
              className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
              }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-medium" : ""} text-gray-900 dark:text-white`}>
                      {notification.message}
                    </p>

                    {notification.relatedPrompt && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        "{notification.relatedPrompt.title}"
                      </p>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}

                    <Badge variant={notification.read ? "secondary" : "default"} className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
