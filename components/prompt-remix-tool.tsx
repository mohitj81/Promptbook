"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Wand2, Copy, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RemixOptions {
  subject?: string
  tone?: string
  style?: string
  constraints?: string
  format?: string
}

interface PromptRemixToolProps {
  originalPrompt: string
  onRemixed?: (remixedPrompt: string) => void
}

export default function PromptRemixTool({ originalPrompt, onRemixed }: PromptRemixToolProps) {
  const [remixOptions, setRemixOptions] = useState<RemixOptions>({})
  const [remixedPrompt, setRemixedPrompt] = useState("")
  const [isRemixing, setIsRemixing] = useState(false)
  const [remixHistory, setRemixHistory] = useState<string[]>([])
  const { toast } = useToast()

  const toneOptions = [
    "Professional",
    "Casual",
    "Humorous",
    "Serious",
    "Creative",
    "Academic",
    "Poetic",
    "Satirical",
    "Dramatic",
    "Conversational",
    "Formal",
    "Playful",
  ]

  const styleOptions = [
    "Shakespearean",
    "Modern",
    "Minimalist",
    "Detailed",
    "Technical",
    "Artistic",
    "Scientific",
    "Journalistic",
    "Storytelling",
    "Instructional",
    "Persuasive",
  ]

  const formatOptions = [
    "Paragraph",
    "Bullet Points",
    "Step-by-step",
    "Dialogue",
    "List",
    "Essay",
    "Story",
    "Script",
    "Email",
    "Social Media Post",
    "Blog Post",
    "Report",
  ]

  const remixPrompt = async () => {
    setIsRemixing(true)
    try {
      const response = await fetch("/api/prompt/remix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt,
          options: remixOptions,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRemixedPrompt(data.remixed)
        setRemixHistory((prev) => [data.remixed, ...prev.slice(0, 4)]) // Keep last 5
        onRemixed?.(data.remixed)
        toast({
          title: "🧬 Prompt Remixed!",
          description: "Your prompt has been creatively transformed",
        })
      }
    } catch (error) {
      console.error("Error remixing prompt:", error)
      toast({
        title: "Error",
        description: "Failed to remix prompt",
        variant: "destructive",
      })
    } finally {
      setIsRemixing(false)
    }
  }

  const quickRemix = async (type: "subject" | "tone" | "style") => {
    const quickOptions: RemixOptions = {}

    switch (type) {
      case "subject":
        quickOptions.subject = "random"
        break
      case "tone":
        quickOptions.tone = toneOptions[Math.floor(Math.random() * toneOptions.length)]
        break
      case "style":
        quickOptions.style = styleOptions[Math.floor(Math.random() * styleOptions.length)]
        break
    }

    setRemixOptions((prev) => ({ ...prev, ...quickOptions }))

    setIsRemixing(true)
    try {
      const response = await fetch("/api/prompt/remix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt,
          options: { ...remixOptions, ...quickOptions },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRemixedPrompt(data.remixed)
        setRemixHistory((prev) => [data.remixed, ...prev.slice(0, 4)])
        onRemixed?.(data.remixed)
        toast({
          title: `🎭 ${type.charAt(0).toUpperCase() + type.slice(1)} Remixed!`,
          description: "Quick remix applied successfully",
        })
      }
    } catch (error) {
      console.error("Error with quick remix:", error)
    } finally {
      setIsRemixing(false)
    }
  }

  const copyRemixed = async () => {
    try {
      await navigator.clipboard.writeText(remixedPrompt)
      toast({
        title: "Copied!",
        description: "Remixed prompt copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive",
      })
    }
  }

  const useHistoryPrompt = (prompt: string) => {
    setRemixedPrompt(prompt)
    onRemixed?.(prompt)
  }

  return (
    <div className="space-y-6">
      {/* Remix Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-orange-600" />🧩 Prompt Remix Tool
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Transform your prompt by changing elements like subject, tone, style, and format
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Remix Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => quickRemix("subject")}
              disabled={isRemixing}
              className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20"
            >
              🎯 Random Subject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => quickRemix("tone")}
              disabled={isRemixing}
              className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20"
            >
              🎭 Random Tone
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => quickRemix("style")}
              disabled={isRemixing}
              className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20"
            >
              ✨ Random Style
            </Button>
          </div>

          {/* Detailed Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">New Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., AI ethics, space exploration"
                value={remixOptions.subject || ""}
                onChange={(e) => setRemixOptions((prev) => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={remixOptions.tone || ""}
                onValueChange={(value) => setRemixOptions((prev) => ({ ...prev, tone: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select
                value={remixOptions.style || ""}
                onValueChange={(value) => setRemixOptions((prev) => ({ ...prev, style: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={remixOptions.format || ""}
                onValueChange={(value) => setRemixOptions((prev) => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">Additional Constraints</Label>
            <Textarea
              id="constraints"
              placeholder="e.g., under 100 words, include specific examples, avoid technical jargon"
              value={remixOptions.constraints || ""}
              onChange={(e) => setRemixOptions((prev) => ({ ...prev, constraints: e.target.value }))}
              rows={2}
            />
          </div>

          <Button
            onClick={remixPrompt}
            disabled={isRemixing}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isRemixing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            {isRemixing ? "Remixing..." : "🧬 Remix Prompt"}
          </Button>
        </CardContent>
      </Card>

      {/* Remixed Result */}
      {remixedPrompt && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-green-600" />🧬 Remixed Prompt
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyRemixed}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={remixPrompt}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Remix Again
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={remixedPrompt}
              onChange={(e) => setRemixedPrompt(e.target.value)}
              rows={4}
              className="bg-white/50 dark:bg-gray-800/50"
            />

            {/* Applied Options */}
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(remixOptions).map(
                ([key, value]) =>
                  value && (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remix History */}
      {remixHistory.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">🕒 Remix History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {remixHistory.map((prompt, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => useHistoryPrompt(prompt)}
              >
                <p className="text-sm line-clamp-2">{prompt}</p>
                <Button size="sm" variant="ghost" className="mt-2 h-6 text-xs">
                  Use This Version
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
