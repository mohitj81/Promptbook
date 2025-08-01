import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import Prompt from "@/models/prompt"
import User from "@/models/user"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const prompt = await Prompt.findById(params.id).populate("creator", "username email image")

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    return NextResponse.json(prompt)
  } catch (error) {
    console.error("Error fetching prompt:", error)
    return NextResponse.json({ error: "Failed to fetch prompt" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const { title, prompt, tags, sampleResult } = await request.json()

    // Get user ID from session
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const existingPrompt = await Prompt.findById(params.id)

    if (!existingPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    // Check if user owns this prompt
    if (existingPrompt.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      params.id,
      { title, prompt, tags: tags || [], sampleResult },
      { new: true },
    ).populate("creator", "username email image")

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    console.error("Error updating prompt:", error)
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 })
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

    const prompt = await Prompt.findById(params.id)

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    // Check if user owns this prompt or is admin
    if (prompt.creator.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await Prompt.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Prompt deleted successfully" })
  } catch (error) {
    console.error("Error deleting prompt:", error)
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 })
  }
}
