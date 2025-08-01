import { type NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/utils/database"
import Prompt from "@/models/prompt"
import Follow from "@/models/follow"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const [promptCount, followerCount, followingCount, userPrompts] = await Promise.all([
      Prompt.countDocuments({ creator: params.id }),
      Follow.countDocuments({ following: params.id }),
      Follow.countDocuments({ follower: params.id }),
      Prompt.find({ creator: params.id }).select("likes"),
    ])

    const totalLikes = userPrompts.reduce((sum, prompt) => sum + prompt.likes.length, 0)

    return NextResponse.json({
      promptCount,
      followerCount,
      followingCount,
      totalLikes,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
