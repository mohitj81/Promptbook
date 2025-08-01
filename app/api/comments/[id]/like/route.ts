import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import Comment from "@/models/comment"
import User from "@/models/user"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get user from session
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const comment = await Comment.findById(params.id).populate("author", "username")

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    const isLiked = comment.likes.includes(user._id)

    if (isLiked) {
      // Unlike
      comment.likes = comment.likes.filter((id: any) => id.toString() !== user._id.toString())
    } else {
      // Like
      comment.likes.push(user._id)
    }

    await comment.save()

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error toggling comment like:", error)
    return NextResponse.json({ error: "Failed to toggle comment like" }, { status: 500 })
  }
}
