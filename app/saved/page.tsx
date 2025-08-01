"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import PromptCard from "@/components/prompt-card"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, Loader2 } from "lucide-react"
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

export default function SavedPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin")
      return
    }
    fetchSavedPrompts()
  }, [session])

  const fetchSavedPrompts = async () => {
    try {
      const response = await fetch("/api/prompt/saved")
      if (response.ok) {
        const data = await response.json()
        setSavedPrompts(data)
      }
    } catch (error) {
      console.error("Error fetching saved prompts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch saved prompts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompt/${promptId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const updatedPrompt = await response.json()
        setSavedPrompts((prev) => prev.map((prompt) => (prompt._id === promptId ? updatedPrompt : prompt)))
      }
    } catch (error) {
      console.error("Error liking prompt:", error)
      toast({
        title: "Error",
        description: "Failed to like prompt",
        variant: "destructive",
      })
    }
  }

  const handleUnsave = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompt/${promptId}/save`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSavedPrompts((prev) => prev.filter((prompt) => prompt._id !== promptId))
        toast({
          title: "Success",
          description: "Prompt removed from saved",
        })
      }
    } catch (error) {
      console.error("Error unsaving prompt:", error)
      toast({
        title: "Error",
        description: "Failed to remove prompt",
        variant: "destructive",
      })
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Saved Prompts</h1>
        <p className="text-gray-600 dark:text-gray-300">Your bookmarked prompts ({savedPrompts.length})</p>
      </div>

      {savedPrompts.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved prompts yet</h3>
            <p className="text-gray-600 dark:text-gray-300">Start exploring and save prompts you find interesting</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPrompts.map((prompt) => (
            <PromptCard
              key={prompt._id}
              prompt={prompt}
              onLike={() => handleLike(prompt._id)}
              onSave={() => handleUnsave(prompt._id)}
              currentUserId={session.user?.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
