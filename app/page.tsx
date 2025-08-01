import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Globe,
  Star,
  TrendingUp,
  MessageSquare,
  Heart,
  Copy,
  Search,
  Filter,
  BookOpen,
  Lightbulb,
  Code,
  Palette,
  Briefcase,
  GraduationCap,
} from "lucide-react"

export default function HomePage() {
  const featuredPrompts = [
    {
      id: 1,
      title: "Creative Writing Assistant",
      description: "Generate compelling stories and narratives with AI",
      category: "Writing",
      likes: 234,
      author: "Sarah Chen",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      title: "Code Documentation Helper",
      description: "Automatically document your code with clear explanations",
      category: "Coding",
      likes: 189,
      author: "Alex Kumar",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 3,
      title: "Marketing Copy Generator",
      description: "Create persuasive marketing content that converts",
      category: "Marketing",
      likes: 156,
      author: "Emma Wilson",
      avatar: "/placeholder-user.jpg",
    },
  ]

  const categories = [
    { name: "Writing", icon: BookOpen, count: "2.3k", color: "bg-blue-500" },
    { name: "Coding", icon: Code, count: "1.8k", color: "bg-green-500" },
    { name: "Design", icon: Palette, count: "1.2k", color: "bg-purple-500" },
    { name: "Business", icon: Briefcase, count: "956", color: "bg-orange-500" },
    { name: "Education", icon: GraduationCap, count: "743", color: "bg-red-500" },
    { name: "Creative", icon: Lightbulb, count: "892", color: "bg-yellow-500" },
  ]

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Prompts Shared", value: "125K+", icon: MessageSquare },
    { label: "Categories", value: "10+", icon: Filter },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-8 animate-fade-in border border-blue-200/50 dark:border-blue-700/50">
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              <span>New: AI-powered prompt suggestions now available!</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Beta
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              <span className="block">Discover & Share</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse">
                AI Prompts
              </span>
              <span className="block text-2xl sm:text-3xl font-normal text-gray-600 dark:text-gray-300 mt-4">
                That Actually Work
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in">
              Join <span className="font-semibold text-blue-600 dark:text-blue-400">50,000+ creators</span> sharing
              their best AI prompts. Discover, save, and create amazing content with the power of artificial
              intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Explore Prompts
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating Free
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/80 dark:bg-gray-800/80 rounded-full mx-auto mb-3 shadow-lg">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Prompts Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Star className="w-4 h-4 mr-1" />
              Featured
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">Trending Prompts</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the most popular and effective AI prompts from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPrompts.map((prompt, index) => (
              <Card
                key={prompt.id}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {prompt.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">{prompt.likes}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prompt.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">{prompt.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={prompt.avatar || "/placeholder.svg"}
                        alt={prompt.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{prompt.author}</span>
                    </div>

                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
              >
                View All Prompts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">Explore by Category</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find the perfect prompts for your specific needs across various domains
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={`/explore?category=${category.name.toLowerCase()}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 bg-white dark:bg-gray-900">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} prompts</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose PromptShare?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to discover, create, and share AI prompts with the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Discover & Explore
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Browse thousands of AI prompts across different categories and use cases. Find the perfect prompt for
                  your next project with our advanced search and filtering system.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Community Driven
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join a vibrant community of AI enthusiasts. Share your prompts, get feedback, collaborate with others,
                  and follow your favorite creators for inspiration.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Easy to Use
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Simple and intuitive interface with powerful features. Create, save, and organize your prompts with
                  just a few clicks. Templates and collections make it even easier.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Join 50,000+ creators today
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">Ready to Get Started?</h2>

          <p className="text-xl sm:text-2xl text-blue-100 mb-12 leading-relaxed">
            Start sharing your AI prompts and discover amazing content from the community.
            <br />
            <span className="font-semibold">It's completely free!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Users className="w-5 h-5 mr-2" />
                Sign Up Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent"
              >
                <Search className="w-5 h-5 mr-2" />
                Explore First
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100 text-sm">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">125K+</div>
              <div className="text-blue-100 text-sm">Prompts Shared</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100 text-sm">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100 text-sm">Community Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
