import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import User from "@/models/user"
import Prompt from "@/models/prompt"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get user from session and check if admin
    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get dashboard statistics
    const [totalUsers, totalPrompts, recentUsers, recentPrompts] = await Promise.all([
      User.countDocuments(),
      Prompt.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("username email image createdAt"),
      Prompt.find()
        .populate("creator", "username")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title creator likes createdAt"),
    ])

    // Calculate total likes
    const allPrompts = await Prompt.find().select("likes")
    const totalLikes = allPrompts.reduce((sum, prompt) => sum + prompt.likes.length, 0)

    const stats = {
      totalUsers,
      totalPrompts,
      totalLikes,
      recentUsers,
      recentPrompts,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
