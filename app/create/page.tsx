"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import PromptForm from "@/components/prompt-form"
import { useToast } from "@/hooks/use-toast"

export default function CreatePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session?.user) {
    router.push("/signin")
    return null
  }

  const handleSubmit = async (formData: {
    title: string
    prompt: string
    tags: string[]
    sampleResult?: string
  }) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your prompt has been created successfully.",
        })
        router.push("/profile")
      } else {
        throw new Error("Failed to create prompt")
      }
    } catch (error) {
      console.error("Error creating prompt:", error)
      toast({
        title: "Error",
        description: "Failed to create prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Create New Prompt</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Share your AI prompt with the community and help others create amazing content.
        </p>
      </div>

      <PromptForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Create Prompt" />
    </div>
  )
}
