import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import SavedPrompt from "@/models/saved-prompt"
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

    // Check if already saved
    const existingSave = await SavedPrompt.findOne({
      user: user._id,
      prompt: params.id,
    })

    if (existingSave) {
      return NextResponse.json({ message: "Prompt already saved" })
    }

    await SavedPrompt.create({
      user: user._id,
      prompt: params.id,
    })

    return NextResponse.json({ message: "Prompt saved successfully" })
  } catch (error) {
    console.error("Error saving prompt:", error)
    return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 })
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

    await SavedPrompt.findOneAndDelete({
      user: user._id,
      prompt: params.id,
    })

    return NextResponse.json({ message: "Prompt unsaved successfully" })
  } catch (error) {
    console.error("Error unsaving prompt:", error)
    return NextResponse.json({ error: "Failed to unsave prompt" }, { status: 500 })
  }
}
