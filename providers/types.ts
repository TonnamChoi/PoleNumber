export type Provider = "gemini" | "claude" | "openai";

export interface ExtractionResult {
  lineName: string | null;
  computerizedNumber: string | null;
  lineNumber: string | null;
  confidence: number | null;
  extraInfo: string | null;
  reasoning: string | null;
}

export interface ExtractParams {
  apiKey: string;
  base64Data: string;
  mimeType: string;
}
