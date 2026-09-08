import { extract } from "./index";
import type { Provider } from "./types";

const VALID_PROVIDERS: Provider[] = ["gemini", "claude", "openai"];

export interface ExtractRequestResult {
  status: number;
  body: unknown;
}

export async function handleExtractRequest(body: any): Promise<ExtractRequestResult> {
  const { provider, apiKey, image, mimeType } = body ?? {};

  if (!provider || !VALID_PROVIDERS.includes(provider)) {
    return { status: 400, body: { error: "지원하지 않는 프로바이더입니다." } };
  }
  if (!apiKey) {
    return { status: 400, body: { error: "API 키가 없습니다. 설정에서 API 키를 입력하세요." } };
  }
  if (!image) {
    return { status: 400, body: { error: "이미지 데이터가 없습니다." } };
  }

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const result = await extract(provider as Provider, {
      apiKey,
      base64Data,
      mimeType: mimeType || "image/jpeg",
    });

    return { status: 200, body: result };
  } catch (error: any) {
    console.error("Extraction Error:", error);

    const errorMessage = typeof error.message === "string" ? error.message : "";
    const isAuthError =
      error.status === 401 ||
      error.status === 403 ||
      errorMessage.includes("API_KEY_INVALID") ||
      errorMessage.includes("API key not valid");

    if (isAuthError) {
      return { status: 401, body: { error: "API 키가 올바르지 않습니다. 설정을 확인하세요." } };
    }
    if (error.status === 429) {
      return { status: 429, body: { error: "요청 한도를 초과했습니다. 잠시 후 다시 시도하세요." } };
    }

    return { status: 500, body: { error: error.message || "분석 중 오류가 발생했습니다." } };
  }
}
