import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import Follow from "@/models/follow"
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

    // Can't follow yourself
    if (user._id.toString() === params.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if target user exists
    const targetUser = await User.findById(params.id)

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 })
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: user._id,
      following: params.id,
    })

    if (existingFollow) {
      return NextResponse.json({ message: "Already following this user" })
    }

    // Create follow relationship
    await Follow.create({
      follower: user._id,
      following: params.id,
    })

    // Create notification
    await Notification.create({
      user: params.id,
      message: `${user.username} started following you`,
      type: "follow",
      fromUser: user._id,
    })

    return NextResponse.json({ message: "Successfully followed user" })
  } catch (error) {
    console.error("Error following user:", error)
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    await Follow.findOneAndDelete({
      follower: user._id,
      following: params.id,
    })

    return NextResponse.json({ message: "Successfully unfollowed user" })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 })
  }
}
