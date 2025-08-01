"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Reply, Edit, Trash2, Send, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    username: string
    image: string
  }
  likes: string[]
  createdAt: string
  isEdited: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  promptId: string
  promptCreatorId: string
}

export default function CommentSection({ promptId, promptCreatorId }: CommentSectionProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [promptId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/prompt/${promptId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleSubmitComment = async () => {
    if (!session?.user || !newComment.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/prompt/${promptId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment("")
        fetchComments()
        toast({
          title: "Success",
          description: "Comment added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!session?.user || !replyContent.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/prompt/${promptId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent,
          parentComment: parentId,
        }),
      })

      if (response.ok) {
        setReplyContent("")
        setReplyingTo(null)
        fetchComments()
        toast({
          title: "Success",
          description: "Reply added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding reply:", error)
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error("Error liking comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchComments()
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      })

      if (response.ok) {
        setEditingComment(null)
        setEditContent("")
        fetchComments()
        toast({
          title: "Success",
          description: "Comment updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating comment:", error)
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isAuthor = session?.user?.id === comment.author._id
    const isPromptCreator = comment.author._id === promptCreatorId
    const isLiked = session?.user ? comment.likes.includes(session.user.id) : false

    return (
      <div className={`${isReply ? "ml-8 mt-4" : "mb-6"}`}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.image || "/placeholder.svg"} alt={comment.author.username} />
                <AvatarFallback>{comment.author.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{comment.author.username}</span>
                  {isPromptCreator && (
                    <Badge variant="secondary" className="text-xs">
                      Author
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  {comment.isEdited && <span className="text-xs text-gray-400">(edited)</span>}
                </div>

                {editingComment === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edit your comment..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditComment(comment._id)} disabled={loading}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingComment(null)
                          setEditContent("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeComment(comment._id)}
                        className={`${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
                        disabled={!session?.user}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                        {comment.likes.length}
                      </Button>

                      {!isReply && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(comment._id)}
                          disabled={!session?.user}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      )}

                      {isAuthor && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingComment(comment._id)
                              setEditContent(comment.content)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {replyingTo === comment._id && (
                  <div className="mt-4 space-y-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReply(comment._id)} disabled={loading}>
                        <Send className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyContent("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {comment.replies &&
          comment.replies.map((reply) => <CommentItem key={reply._id} comment={reply} isReply={true} />)}
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {session?.user ? (
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this prompt..."
                  rows={3}
                />
                <Button onClick={handleSubmitComment} disabled={loading || !newComment.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">Sign in to join the conversation</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}
