"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, MoreHorizontal, Edit, Trash2, Eye, Lock, Globe } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

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
  coverImage?: string
}

interface CollectionCardProps {
  collection: Collection
  onEdit?: () => void
  onDelete?: () => void
  currentUserId?: string
  showActions?: boolean
}

export default function CollectionCard({
  collection,
  onEdit,
  onDelete,
  currentUserId,
  showActions = false,
}: CollectionCardProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const isOwner = currentUserId === collection.creator._id

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this collection?")) {
      onDelete?.()
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-800 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {collection.coverImage ? (
                <img
                  src={collection.coverImage || "/placeholder.svg"}
                  alt={collection.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">{collection.name}</h3>
                {collection.isPublic ? (
                  <Globe className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={collection.creator.image || "/placeholder.svg"} alt={collection.creator.username} />
                  <AvatarFallback className="text-xs">
                    {collection.creator.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400">{collection.creator.username}</span>
              </div>
            </div>
          </div>

          {(showActions || isOwner) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/collections/${collection._id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Collection
                  </Link>
                </DropdownMenuItem>
                {isOwner && onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {isOwner && onDelete && (
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {collection.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{collection.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>{collection.prompts.length} prompts</span>
          </div>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })}
          </span>
        </div>

        {collection.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {collection.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {collection.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{collection.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-gray-100 dark:border-gray-700">
        <Link href={`/collections/${collection._id}`} className="w-full">
          <Button variant="outline" className="w-full bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            View Collection
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
