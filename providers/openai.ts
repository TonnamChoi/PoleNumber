import OpenAI from "openai";
import { ExtractionResult, ExtractParams } from "./types";
import { EXTRACTION_INSTRUCTION } from "./prompt";

export async function extractWithOpenAI({
  apiKey,
  base64Data,
  mimeType,
}: ExtractParams): Promise<ExtractionResult> {
  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model: "gpt-6-astra",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: EXTRACTION_INSTRUCTION },
          {
            type: "input_image",
            image_url: `data:${mimeType};base64,${base64Data}`,
            detail: "auto",
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "pole_extraction",
        schema: {
          type: "object",
          properties: {
            lineName: { type: ["string", "null"] },
            computerizedNumber: { type: ["string", "null"] },
            lineNumber: { type: ["string", "null"] },
            confidence: { type: "integer" },
            extraInfo: { type: ["string", "null"] },
            reasoning: { type: ["string", "null"] },
          },
          required: [
            "lineName",
            "computerizedNumber",
            "lineNumber",
            "confidence",
            "extraInfo",
            "reasoning",
          ],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("OpenAI 응답이 비어 있습니다.");
  }

  return JSON.parse(response.output_text) as ExtractionResult;
}
