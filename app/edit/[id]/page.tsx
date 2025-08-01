"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import PromptForm from "@/components/prompt-form"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Prompt {
  _id: string
  title: string
  prompt: string
  tags: string[]
  sampleResult?: string
  creator: {
    _id: string
  }
}

export default function EditPromptPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin")
      return
    }
    fetchPrompt()
  }, [session, params.id])

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompt/${params.id}`)
      if (response.ok) {
        const data = await response.json()

        // Check if user owns this prompt
        if (data.creator._id !== session?.user?.id) {
          router.push("/profile")
          return
        }

        setPrompt(data)
      } else {
        throw new Error("Prompt not found")
      }
    } catch (error) {
      console.error("Error fetching prompt:", error)
      toast({
        title: "Error",
        description: "Failed to fetch prompt",
        variant: "destructive",
      })
      router.push("/profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: {
    title: string
    prompt: string
    tags: string[]
    sampleResult?: string
  }) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/prompt/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your prompt has been updated successfully.",
        })
        router.push("/profile")
      } else {
        throw new Error("Failed to update prompt")
      }
    } catch (error) {
      console.error("Error updating prompt:", error)
      toast({
        title: "Error",
        description: "Failed to update prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Prompt not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Edit Prompt</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Update your prompt details and share improvements with the community.
        </p>
      </div>

      <PromptForm
        initialData={{
          title: prompt.title,
          prompt: prompt.prompt,
          tags: prompt.tags,
          sampleResult: prompt.sampleResult,
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update Prompt"
      />
    </div>
  )
}
