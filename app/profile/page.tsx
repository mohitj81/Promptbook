"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import PromptCard from "@/components/prompt-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Prompt {
  _id: string
  title: string
  prompt: string
  tags: string[]
  creator: {
    _id: string
    username: string
    email: string
    image: string
  }
  likes: string[]
  createdAt: string
  sampleResult?: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPrompts: 0,
    totalLikes: 0,
    totalViews: 0,
  })

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin")
      return
    }
    fetchUserPrompts()
  }, [session])

  const fetchUserPrompts = async () => {
    try {
      const response = await fetch(`/api/prompt/user/${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)

        // Calculate stats
        const totalLikes = data.reduce((sum: number, prompt: Prompt) => sum + prompt.likes.length, 0)
        setStats({
          totalPrompts: data.length,
          totalLikes,
          totalViews: 0, // This would need to be tracked separately
        })
      }
    } catch (error) {
      console.error("Error fetching user prompts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your prompts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (promptId: string) => {
    router.push(`/edit/${promptId}`)
  }

  const handleDelete = async (promptId: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPrompts((prev) => prev.filter((prompt) => prompt._id !== promptId))
        toast({
          title: "Success",
          description: "Prompt deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting prompt:", error)
      toast({
        title: "Error",
        description: "Failed to delete prompt",
        variant: "destructive",
      })
    }
  }

  const handleLike = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompt/${promptId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const updatedPrompt = await response.json()
        setPrompts((prev) => prev.map((prompt) => (prompt._id === promptId ? updatedPrompt : prompt)))
      }
    } catch (error) {
      console.error("Error liking prompt:", error)
    }
  }

  const handleSave = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompt/${promptId}/save`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Prompt saved successfully",
        })
      }
    } catch (error) {
      console.error("Error saving prompt:", error)
    }
  }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback className="text-2xl">{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{session.user.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{session.user.email}</p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalPrompts}</div>
                  <div className="text-sm text-gray-500">Prompts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{stats.totalLikes}</div>
                  <div className="text-sm text-gray-500">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{stats.totalViews}</div>
                  <div className="text-sm text-gray-500">Views</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Prompt
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Prompts */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Prompts ({prompts.length})</h2>
      </div>

      {prompts.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No prompts yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Start sharing your AI prompts with the community</p>
              <Link href="/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Prompt
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt._id}
              prompt={prompt}
              onLike={() => handleLike(prompt._id)}
              onSave={() => handleSave(prompt._id)}
              onEdit={() => handleEdit(prompt._id)}
              onDelete={() => handleDelete(prompt._id)}
              currentUserId={session.user?.id}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
