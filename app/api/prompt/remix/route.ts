import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { originalPrompt, options } = await request.json()

    if (!originalPrompt) {
      return NextResponse.json({ error: "Original prompt is required" }, { status: 400 })
    }

    // Build remix instructions
    let instructions = "Transform this prompt by applying the following changes:\n"

    if (options.subject) {
      if (options.subject === "random") {
        instructions += "- Change the subject to something completely different and interesting\n"
      } else {
        instructions += `- Change the subject to: ${options.subject}\n`
      }
    }

    if (options.tone) {
      instructions += `- Change the tone to: ${options.tone}\n`
    }

    if (options.style) {
      instructions += `- Change the writing style to: ${options.style}\n`
    }

    if (options.format) {
      instructions += `- Change the output format to: ${options.format}\n`
    }

    if (options.constraints) {
      instructions += `- Add these constraints: ${options.constraints}\n`
    }

    instructions += `\nOriginal prompt: "${originalPrompt}"\n\nReturn only the remixed prompt, nothing else.`

    const { text: remixed } = await generateText({
      model: openai("gpt-4o"),
      prompt: instructions,
    })

    return NextResponse.json({
      remixed: remixed.trim(),
    })
  } catch (error) {
    console.error("Error remixing prompt:", error)
    return NextResponse.json({ error: "Failed to remix prompt" }, { status: 500 })
  }
}
