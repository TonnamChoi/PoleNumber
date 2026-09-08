import { Provider, ExtractionResult, ExtractParams } from "./types";
import { extractWithGemini } from "./gemini";
import { extractWithClaude } from "./claude";
import { extractWithOpenAI } from "./openai";

export async function extract(
  provider: Provider,
  params: ExtractParams
): Promise<ExtractionResult> {
  switch (provider) {
    case "gemini":
      return extractWithGemini(params);
    case "claude":
      return extractWithClaude(params);
    case "openai":
      return extractWithOpenAI(params);
  }
}
