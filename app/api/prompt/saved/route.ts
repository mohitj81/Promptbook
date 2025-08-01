import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import SavedPrompt from "@/models/saved-prompt"
import User from "@/models/user"

export async function GET() {
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

    const savedPrompts = await SavedPrompt.find({ user: user._id })
      .populate({
        path: "prompt",
        populate: {
          path: "creator",
          select: "username email image",
        },
      })
      .sort({ createdAt: -1 })

    // Extract the actual prompts from the saved prompts
    const prompts = savedPrompts.map((saved) => saved.prompt)

    return NextResponse.json(prompts)
  } catch (error) {
    console.error("Error fetching saved prompts:", error)
    return NextResponse.json({ error: "Failed to fetch saved prompts" }, { status: 500 })
  }
}
