"use client"

import { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Sparkles } from "lucide-react"

export default function SignInPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      router.push("/")
    }
  }, [session, router])

  if (session?.user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full mx-4">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to PromptShare</CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Sign in to discover, create, and share AI prompts with the community
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button onClick={() => signIn("google")} className="w-full h-12 text-base" size="lg">
              <Chrome className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            New to PromptShare? <span className="font-medium">Create an account by signing in with Google</span>
          </p>
        </div>
      </div>
    </div>
  )
}
