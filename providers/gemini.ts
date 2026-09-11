import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult, ExtractParams } from "./types.js";
import { EXTRACTION_INSTRUCTION } from "./prompt.js";

export async function extractWithGemini({
  apiKey,
  base64Data,
  mimeType,
}: ExtractParams): Promise<ExtractionResult> {
  const ai = new GoogleGenAI({ apiKey });

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const textPart = { text: EXTRACTION_INSTRUCTION };

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lineName: { type: Type.STRING, description: "선로명, 찾지 못한 경우 null" },
          computerizedNumber: { type: Type.STRING, description: "8자리 전산화번호, 찾지 못한 경우 null" },
          lineNumber: { type: Type.STRING, description: "선로번호 또는 호수/순번, 찾지 못한 경우 null" },
          confidence: { type: Type.INTEGER, description: "추출 정확도 신뢰도 점수 (0~100)" },
          extraInfo: { type: Type.STRING, description: "기타 정보, 없으면 null" },
          reasoning: { type: Type.STRING, description: "확인한 근거를 한국어로 간단히 설명" },
          boundingBox: {
            type: Type.OBJECT,
            description: "번호판이 이미지에서 차지하는 영역 (0~1 비율), 찾지 못한 경우 null",
            nullable: true,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
            },
            required: ["x", "y", "width", "height"],
          },
        },
        required: ["lineName", "computerizedNumber", "lineNumber", "confidence", "boundingBox"],
      },
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Gemini 응답이 비어 있습니다.");
  }

  return JSON.parse(resultText.trim()) as ExtractionResult;
}
