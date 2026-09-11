import { Provider, ExtractionResult, ExtractParams } from "./types.js";
import { extractWithGemini } from "./gemini.js";
import { extractWithClaude } from "./claude.js";
import { extractWithOpenAI } from "./openai.js";

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
