export interface ExtractedInfo {
  lineName: string | null;
  computerizedNumber: string | null;
  lineNumber: string | null;
  confidence: number | null;
  extraInfo: string | null;
  reasoning: string | null;
}

export interface PoleImage {
  id: string;
  name: string;
  url: string; // Base64 data URL or Object URL
  mimeType: string;
  status: "idle" | "processing" | "completed" | "failed";
  error: string | null;
  lineName: string | null;
  computerizedNumber: string | null;
  lineNumber: string | null;
  confidence: number | null;
  extraInfo: string | null;
  reasoning: string | null;
  isSample: boolean;
  uploadedAt: string;
}

export interface SamplePlate {
  id: string;
  title: string;
  description: string;
  svgMarkup: string;
}
