import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import Prompt from "@/models/prompt"
import User from "@/models/user"
import Notification from "@/models/notification"

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

    const prompt = await Prompt.findById(params.id).populate("creator", "username email image")

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    const isLiked = prompt.likes.includes(user._id)

    if (isLiked) {
      // Unlike
      prompt.likes = prompt.likes.filter((id: any) => id.toString() !== user._id.toString())
    } else {
      // Like
      prompt.likes.push(user._id)

      // Create notification for prompt creator (if not liking own prompt)
      if (prompt.creator._id.toString() !== user._id.toString()) {
        await Notification.create({
          user: prompt.creator._id,
          message: `${user.username} liked your prompt "${prompt.title}"`,
          type: "like",
          relatedPrompt: prompt._id,
          fromUser: user._id,
        })
      }
    }

    await prompt.save()

    return NextResponse.json(prompt)
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
