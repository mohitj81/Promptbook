import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/utils/database"
import Collection from "@/models/collection"
import User from "@/models/user"

export async function GET() {
  try {
    const session = await getServerSession()

    await connectToDB()

    let query = {}

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email })
      if (user) {
        // Show public collections and user's own collections
        query = {
          $or: [{ isPublic: true }, { creator: user._id }],
        }
      } else {
        query = { isPublic: true }
      }
    } else {
      query = { isPublic: true }
    }

    const collections = await Collection.find(query).populate("creator", "username image").sort({ createdAt: -1 })

    return NextResponse.json(collections)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const { name, description, isPublic, tags } = await request.json()

    // Get user from session
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newCollection = new Collection({
      name,
      description,
      creator: user._id,
      isPublic: isPublic ?? true,
      tags: tags || [],
      prompts: [],
    })

    await newCollection.save()
    await newCollection.populate("creator", "username image")

    return NextResponse.json(newCollection, { status: 201 })
  } catch (error) {
    console.error("Error creating collection:", error)
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
  }
}
