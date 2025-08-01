"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wand2, Shuffle, GitCompare, Mic, Sparkles, Zap, RefreshCw, Volume2 } from "lucide-react"
import PromptEnhancer from "@/components/prompt-enhancer"
import PromptRoulette from "@/components/prompt-roulette"
import PromptRemixTool from "@/components/prompt-remix-tool"
import VoiceToPrompt from "@/components/voice-to-prompt"
import PromptDiffTool from "@/components/prompt-diff-tool"

export default function ToolsPage() {
  const [samplePrompt] = useState("Write a story about a cat who discovers a hidden world")

  const tools = [
    {
      id: "enhancer",
      name: "Magic Enhancer",
      icon: Wand2,
      emoji: "💫",
      description: "Transform basic prompts into powerful, detailed instructions",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "roulette",
      name: "Prompt Roulette",
      icon: Shuffle,
      emoji: "🎰",
      description: "Discover random prompts with filters for inspiration",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "remix",
      name: "Remix Tool",
      icon: RefreshCw,
      emoji: "🧩",
      description: "Remix existing prompts by changing tone, style, and subject",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "voice",
      name: "Voice to Prompt",
      icon: Mic,
      emoji: "🎤",
      description: "Speak your ideas and convert them to structured prompts",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "diff",
      name: "Visual Diff",
      icon: GitCompare,
      emoji: "🔍",
      description: "Compare prompts side-by-side to track changes",
      color: "from-cyan-500 to-blue-500",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-200 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          Ultra-Cool AI Tools
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600">
            Prompt Tools
          </span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Supercharge your AI prompts with our collection of powerful tools. Enhance, remix, compare, and discover
          prompts like never before.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {tool.emoji} {tool.name}
                  </CardTitle>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Tools Interface */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            AI Prompt Laboratory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="enhancer" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 m-6 mb-0">
              <TabsTrigger value="enhancer" className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">Enhancer</span>
              </TabsTrigger>
              <TabsTrigger value="roulette" className="flex items-center gap-2">
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Roulette</span>
              </TabsTrigger>
              <TabsTrigger value="remix" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Remix</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger value="diff" className="flex items-center gap-2">
                <GitCompare className="w-4 h-4" />
                <span className="hidden sm:inline">Diff</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="enhancer" className="mt-0">
                <PromptEnhancer originalPrompt={samplePrompt} />
              </TabsContent>

              <TabsContent value="roulette" className="mt-0">
                <PromptRoulette />
              </TabsContent>

              <TabsContent value="remix" className="mt-0">
                <PromptRemixTool originalPrompt={samplePrompt} />
              </TabsContent>

              <TabsContent value="voice" className="mt-0">
                <VoiceToPrompt />
              </TabsContent>

              <TabsContent value="diff" className="mt-0">
                <PromptDiffTool />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
            <p className="text-gray-600 dark:text-gray-300">
              All tools use advanced AI to analyze, enhance, and transform your prompts intelligently.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get immediate feedback and improvements to your prompts with real-time processing.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Voice Enabled</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Speak your ideas naturally and watch them transform into structured prompts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
