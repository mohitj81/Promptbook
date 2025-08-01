import { NextResponse } from "next/server"
import { connectToDB } from "@/utils/database"
import Collection from "@/models/collection"

export async function GET() {
  try {
    await connectToDB()

    const collections = await Collection.find({ isPublic: true })
      .populate("creator", "username image")
      .sort({ createdAt: -1 })
      .limit(20)

    return NextResponse.json(collections)
  } catch (error) {
    console.error("Error fetching public collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}
