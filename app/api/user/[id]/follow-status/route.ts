import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import Follow from "@/models/follow"
import User from "@/models/user"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ isFollowing: false })
    }

    await connectToDB()

    // Get user from session
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ isFollowing: false })
    }

    const follow = await Follow.findOne({
      follower: user._id,
      following: params.id,
    })

    return NextResponse.json({ isFollowing: !!follow })
  } catch (error) {
    console.error("Error checking follow status:", error)
    return NextResponse.json({ isFollowing: false })
  }
}
