export type Provider = "gemini" | "claude" | "openai";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractionResult {
  lineName: string | null;
  computerizedNumber: string | null;
  lineNumber: string | null;
  confidence: number | null;
  extraInfo: string | null;
  reasoning: string | null;
  boundingBox: BoundingBox | null;
}

export interface ExtractParams {
  apiKey: string;
  base64Data: string;
  mimeType: string;
}
