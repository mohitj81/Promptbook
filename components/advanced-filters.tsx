"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Filter, X, Star, TrendingUp, Clock, Users } from "lucide-react"

interface FilterOptions {
  categories: string[]
  difficulties: string[]
  sortBy: string
  timeRange: string
  minLikes: number
  isTemplate: boolean
  featured: boolean
}

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
}

const CATEGORIES = [
  { id: "writing", label: "Writing", icon: "✍️" },
  { id: "coding", label: "Coding", icon: "💻" },
  { id: "marketing", label: "Marketing", icon: "📈" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "entertainment", label: "Entertainment", icon: "🎭" },
  { id: "productivity", label: "Productivity", icon: "⚡" },
  { id: "research", label: "Research", icon: "🔬" },
  { id: "other", label: "Other", icon: "📝" },
]

const DIFFICULTIES = [
  { id: "beginner", label: "Beginner", color: "bg-green-100 text-green-800" },
  { id: "intermediate", label: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
  { id: "advanced", label: "Advanced", color: "bg-red-100 text-red-800" },
]

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "oldest", label: "Oldest First", icon: Clock },
  { id: "most-liked", label: "Most Liked", icon: Star },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "most-followed", label: "Popular Creators", icon: Users },
]

const TIME_RANGES = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
]

export default function AdvancedFilters({ filters, onFiltersChange, onClearFilters }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId]

    onFiltersChange({ ...filters, categories: newCategories })
  }

  const toggleDifficulty = (difficultyId: string) => {
    const newDifficulties = filters.difficulties.includes(difficultyId)
      ? filters.difficulties.filter((d) => d !== difficultyId)
      : [...filters.difficulties, difficultyId]

    onFiltersChange({ ...filters, difficulties: newDifficulties })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.minLikes > 0 ||
    filters.isTemplate ||
    filters.featured ||
    filters.sortBy !== "newest" ||
    filters.timeRange !== "all"

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filters.categories.length +
                  filters.difficulties.length +
                  (filters.minLikes > 0 ? 1 : 0) +
                  (filters.isTemplate ? 1 : 0) +
                  (filters.featured ? 1 : 0)}{" "}
                active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Categories</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category.id}
                  variant={filters.categories.includes(category.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Difficulty */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((difficulty) => (
                <Badge
                  key={difficulty.id}
                  variant={filters.difficulties.includes(difficulty.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleDifficulty(difficulty.id)}
                >
                  {difficulty.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sort Options */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Sort By</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SORT_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  variant={filters.sortBy === option.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, sortBy: option.id })}
                  className="justify-start"
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Time Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Time Range</Label>
            <div className="flex flex-wrap gap-2">
              {TIME_RANGES.map((range) => (
                <Badge
                  key={range.id}
                  variant={filters.timeRange === range.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => onFiltersChange({ ...filters, timeRange: range.id })}
                >
                  {range.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Minimum Likes */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Minimum Likes: {filters.minLikes}</Label>
            <Slider
              value={[filters.minLikes]}
              onValueChange={(value) => onFiltersChange({ ...filters, minLikes: value[0] })}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Special Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Templates Only</Label>
                <p className="text-xs text-gray-500">Show only prompt templates</p>
              </div>
              <Switch
                checked={filters.isTemplate}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, isTemplate: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Featured Prompts</Label>
                <p className="text-xs text-gray-500">Show only featured content</p>
              </div>
              <Switch
                checked={filters.featured}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, featured: checked })}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
