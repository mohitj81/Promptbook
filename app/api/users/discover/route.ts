import { NextResponse } from "next/server"
import { connectToDB } from "@/utils/database"
import User from "@/models/user"

export async function GET() {
  try {
    await connectToDB()

    // Get users with their prompt counts and follower counts
    const users = await User.aggregate([
      {
        $lookup: {
          from: "prompts",
          localField: "_id",
          foreignField: "creator",
          as: "prompts",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following",
          as: "followers",
        },
      },
      {
        $addFields: {
          promptCount: { $size: "$prompts" },
          followerCount: { $size: "$followers" },
        },
      },
      {
        $match: {
          promptCount: { $gt: 0 }, // Only users with at least one prompt
        },
      },
      {
        $sort: {
          followerCount: -1,
          promptCount: -1,
        },
      },
      {
        $limit: 20,
      },
      {
        $project: {
          username: 1,
          email: 1,
          image: 1,
          role: 1,
          promptCount: 1,
          followerCount: 1,
        },
      },
    ])

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users for discovery:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
