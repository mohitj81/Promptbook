"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GitCompare, Copy, RefreshCw, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DiffResult {
  added: string[]
  removed: string[]
  modified: string[]
  unchanged: string[]
  similarity: number
}

interface PromptDiffToolProps {
  initialPromptA?: string
  initialPromptB?: string
}

export default function PromptDiffTool({ initialPromptA = "", initialPromptB = "" }: PromptDiffToolProps) {
  const [promptA, setPromptA] = useState(initialPromptA)
  const [promptB, setPromptB] = useState(initialPromptB)
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
  const [showWordLevel, setShowWordLevel] = useState(true)
  const { toast } = useToast()

  const calculateDiff = () => {
    if (!promptA.trim() || !promptB.trim()) {
      toast({
        title: "Missing Input",
        description: "Please provide both prompts to compare",
        variant: "destructive",
      })
      return
    }

    // Simple word-level diff implementation
    const wordsA = promptA.toLowerCase().split(/\s+/)
    const wordsB = promptB.toLowerCase().split(/\s+/)

    const added: string[] = []
    const removed: string[] = []
    const unchanged: string[] = []

    // Find words in B but not in A (added)
    wordsB.forEach((word) => {
      if (!wordsA.includes(word)) {
        added.push(word)
      } else {
        unchanged.push(word)
      }
    })

    // Find words in A but not in B (removed)
    wordsA.forEach((word) => {
      if (!wordsB.includes(word)) {
        removed.push(word)
      }
    })

    // Calculate similarity
    const totalWords = Math.max(wordsA.length, wordsB.length)
    const similarity = Math.round(((totalWords - added.length - removed.length) / totalWords) * 100)

    setDiffResult({
      added,
      removed,
      modified: [], // Simplified - not detecting modifications
      unchanged,
      similarity,
    })

    toast({
      title: "🔍 Diff Complete!",
      description: `Found ${added.length} additions and ${removed.length} removals`,
    })
  }

  const highlightDifferences = (text: string, type: "A" | "B") => {
    if (!diffResult) return text

    const words = text.split(/(\s+)/)

    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().trim()

      if (type === "A" && diffResult.removed.includes(cleanWord)) {
        return (
          <span key={index} className="bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 px-1 rounded">
            {word}
          </span>
        )
      }

      if (type === "B" && diffResult.added.includes(cleanWord)) {
        return (
          <span
            key={index}
            className="bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-1 rounded"
          >
            {word}
          </span>
        )
      }

      return <span key={index}>{word}</span>
    })
  }

  const swapPrompts = () => {
    const temp = promptA
    setPromptA(promptB)
    setPromptB(temp)
    setDiffResult(null)
  }

  const copyDiffSummary = async () => {
    if (!diffResult) return

    const summary = `
Prompt Comparison Summary:
Similarity: ${diffResult.similarity}%

Added words (${diffResult.added.length}): ${diffResult.added.join(", ")}
Removed words (${diffResult.removed.length}): ${diffResult.removed.join(", ")}
Unchanged words: ${diffResult.unchanged.length}
    `.trim()

    try {
      await navigator.clipboard.writeText(summary)
      toast({
        title: "Copied!",
        description: "Diff summary copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy summary",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-600" />🔍 Visual Prompt Diff Tool
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Compare two prompts side by side to see exactly what changed
          </p>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Prompt A (Original)</Label>
              <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20">
                {promptA.split(/\s+/).filter((w) => w.trim()).length} words
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={promptA}
              onChange={(e) => setPromptA(e.target.value)}
              placeholder="Enter the first prompt to compare..."
              rows={8}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Prompt B (Modified)</Label>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20">
                {promptB.split(/\s+/).filter((w) => w.trim()).length} words
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={promptB}
              onChange={(e) => setPromptB(e.target.value)}
              placeholder="Enter the second prompt to compare..."
              rows={8}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={calculateDiff}
          disabled={!promptA.trim() || !promptB.trim()}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <GitCompare className="w-4 h-4 mr-2" />🔍 Compare Prompts
        </Button>

        <Button onClick={swapPrompts} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Swap A ↔ B
        </Button>

        <Button onClick={() => setShowWordLevel(!showWordLevel)} variant="outline" className="flex items-center gap-2">
          {showWordLevel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showWordLevel ? "Hide" : "Show"} Highlights
        </Button>
      </div>

      {/* Diff Results */}
      {diffResult && (
        <>
          {/* Summary Stats */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📊 Comparison Results</span>
                <Button size="sm" variant="outline" onClick={copyDiffSummary}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Summary
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{diffResult.similarity}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Similarity</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{diffResult.added.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Added</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{diffResult.removed.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Removed</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{diffResult.unchanged.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Unchanged</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Diff */}
          {showWordLevel && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    Prompt A
                    <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30">
                      Removals highlighted
                    </Badge>
                  </Label>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[200px] text-sm leading-relaxed">
                    {highlightDifferences(promptA, "A")}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    Prompt B
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30">
                      Additions highlighted
                    </Badge>
                  </Label>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[200px] text-sm leading-relaxed">
                    {highlightDifferences(promptB, "B")}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legend */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 dark:bg-red-900/50 rounded"></div>
                  <span>Removed from A</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 dark:bg-green-900/50 rounded"></div>
                  <span>Added in B</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <span>Unchanged</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Tips */}
      <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Use this tool to track prompt optimization experiments</li>
            <li>• Compare different versions to see what changes improved results</li>
            <li>• Perfect for A/B testing your prompts</li>
            <li>• Copy the summary to document your prompt evolution</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
