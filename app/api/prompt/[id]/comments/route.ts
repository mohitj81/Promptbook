import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import Comment from "@/models/comment"
import User from "@/models/user"
import Notification from "@/models/notification"
import Prompt from "@/models/prompt"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const comments = await Comment.find({ prompt: params.id, parentComment: null })
      .populate("author", "username image")
      .populate({
        path: "replies",
        populate: {
          path: "author",
          select: "username image",
        },
      })
      .sort({ createdAt: -1 })

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate("author", "username image")
          .sort({ createdAt: 1 })

        return {
          ...comment.toObject(),
          replies: replies,
        }
      }),
    )

    return NextResponse.json(commentsWithReplies)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const { content, parentComment } = await request.json()

    // Get user from session
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify prompt exists
    const prompt = await Prompt.findById(params.id).populate("creator", "username")

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    const newComment = new Comment({
      prompt: params.id,
      author: user._id,
      content,
      parentComment: parentComment || null,
    })

    await newComment.save()
    await newComment.populate("author", "username image")

    // Create notification for prompt creator (if not commenting on own prompt)
    if (prompt.creator._id.toString() !== user._id.toString()) {
      await Notification.create({
        user: prompt.creator._id,
        message: `${user.username} commented on your prompt "${prompt.title}"`,
        type: "comment",
        relatedPrompt: prompt._id,
        fromUser: user._id,
      })
    }

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
