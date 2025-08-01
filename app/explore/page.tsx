"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import PromptCard from "@/components/prompt-card"
import AdvancedFilters from "@/components/advanced-filters"
import UserProfileCard from "@/components/user-profile-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Loader2, Users, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CollectionCard from "@/components/collection-card"

interface Prompt {
  _id: string
  title: string
  prompt: string
  tags: string[]
  category: string
  difficulty: string
  creator: {
    _id: string
    username: string
    email: string
    image: string
  }
  likes: string[]
  createdAt: string
  sampleResult?: string
  isTemplate: boolean
  featured: boolean
  views: number
}

interface User {
  _id: string
  username: string
  email: string
  image: string
  role: string
}

interface Collection {
  _id: string
  name: string
  description: string
  creator: {
    _id: string
    username: string
    image: string
  }
  prompts: string[]
  isPublic: boolean
  tags: string[]
  createdAt: string
}

interface FilterOptions {
  categories: string[]
  difficulties: string[]
  sortBy: string
  timeRange: string
  minLikes: number
  isTemplate: boolean
  featured: boolean
}

export default function ExplorePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("prompts")
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    difficulties: [],
    sortBy: "newest",
    timeRange: "all",
    minLikes: 0,
    isTemplate: false,
    featured: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortPrompts()
  }, [prompts, searchTerm, filters])

  const fetchData = async () => {
    try {
      const [promptsRes, usersRes, collectionsRes] = await Promise.all([
        fetch("/api/prompt"),
        fetch("/api/users/discover"),
        fetch("/api/collections/public"),
      ])

      if (promptsRes.ok) {
        const promptsData = await promptsRes.json()
        setPrompts(promptsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (collectionsRes.ok) {
        const collectionsData = await collectionsRes.json()
        setCollections(collectionsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPrompts = () => {
    let filtered = prompts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          prompt.creator.username.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((prompt) => filters.categories.includes(prompt.category))
    }

    // Difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((prompt) => filters.difficulties.includes(prompt.difficulty))
    }

    // Minimum likes filter
    if (filters.minLikes > 0) {
      filtered = filtered.filter((prompt) => prompt.likes.length >= filters.minLikes)
    }

    // Template filter
    if (filters.isTemplate) {
      filtered = filtered.filter((prompt) => prompt.isTemplate)
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter((prompt) => prompt.featured)
    }

    // Time range filter
    if (filters.timeRange !== "all") {
      const now = new Date()
      const timeRanges = {
        today: 1,
        week: 7,
        month: 30,
        year: 365,
      }
      const days = timeRanges[filters.timeRange as keyof typeof timeRanges]
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((prompt) => new Date(prompt.createdAt) >= cutoff)
    }

    // Sort
    switch (filters.sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "most-liked":
        filtered.sort((a, b) => b.likes.length - a.likes.length)
        break
      case "trending":
        // Simple trending algorithm: likes + views in recent time
        filtered.sort((a, b) => {
          const aScore = a.likes.length + (a.views || 0) * 0.1
          const bScore = b.likes.length + (b.views || 0) * 0.1
          return bScore - aScore
        })
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredPrompts(filtered)
  }

  const handleLike = async (promptId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like prompts",
        variant: "destructive",
      })
      return
    }

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
      toast({
        title: "Error",
        description: "Failed to like prompt",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (promptId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save prompts",
        variant: "destructive",
      })
      return
    }

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
      toast({
        title: "Error",
        description: "Failed to save prompt",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      difficulties: [],
      sortBy: "newest",
      timeRange: "all",
      minLikes: 0,
      isTemplate: false,
      featured: false,
    })
    setSearchTerm("")
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover amazing AI prompts, connect with creators, and find curated collections
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search prompts, creators, or collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Prompts ({filteredPrompts.length})
          </TabsTrigger>
          <TabsTrigger value="creators" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Creators ({users.length})
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Collections ({collections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompts" className="mt-6">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No prompts found matching your criteria</p>
              <Button onClick={clearFilters} variant="outline" className="mt-4 bg-transparent">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  onLike={() => handleLike(prompt._id)}
                  onSave={() => handleSave(prompt._id)}
                  currentUserId={session?.user?.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="creators" className="mt-6">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No creators found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserProfileCard key={user._id} user={user} showFollowButton={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No public collections found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <CollectionCard key={collection._id} collection={collection} currentUserId={session?.user?.id} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
