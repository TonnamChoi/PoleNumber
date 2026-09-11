import Anthropic from "@anthropic-ai/sdk";
import { ExtractionResult, ExtractParams } from "./types.js";
import { EXTRACTION_INSTRUCTION } from "./prompt.js";

export async function extractWithClaude({
  apiKey,
  base64Data,
  mimeType,
}: ExtractParams): Promise<ExtractionResult> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    output_config: { effort: "low" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: base64Data,
            },
          },
          {
            type: "text",
            text: EXTRACTION_INSTRUCTION,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  if (!textBlock) {
    throw new Error("Claude 응답이 비어 있습니다.");
  }

  const jsonText = textBlock.text.trim().replace(/^```(?:json)?\s*|```\s*$/g, "");

  try {
    return JSON.parse(jsonText) as ExtractionResult;
  } catch {
    const start = jsonText.indexOf("{");
    const end = jsonText.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(jsonText.slice(start, end + 1)) as ExtractionResult;
      } catch {
        // fall through to the error below
      }
    }
    throw new Error("Claude 응답을 해석할 수 없습니다.");
  }
}
