import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { extract } from "./providers";
import type { Provider } from "./providers/types";

const app = express();
const PORT = 3000;

// Increase payload size limit since we will send base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const VALID_PROVIDERS: Provider[] = ["gemini", "claude", "openai"];

// API Routes
app.post("/api/extract", async (req, res) => {
  try {
    const { provider, apiKey, image, mimeType } = req.body;

    if (!provider || !VALID_PROVIDERS.includes(provider)) {
      return res.status(400).json({ error: "지원하지 않는 프로바이더입니다." });
    }
    if (!apiKey) {
      return res.status(400).json({ error: "API 키가 없습니다. 설정에서 API 키를 입력하세요." });
    }
    if (!image) {
      return res.status(400).json({ error: "이미지 데이터가 없습니다." });
    }

    // Clean base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const result = await extract(provider as Provider, {
      apiKey,
      base64Data,
      mimeType: mimeType || "image/jpeg",
    });

    res.json(result);
  } catch (error: any) {
    console.error("Extraction Error:", error);

    const errorMessage = typeof error.message === "string" ? error.message : "";
    const isAuthError =
      error.status === 401 ||
      error.status === 403 ||
      errorMessage.includes("API_KEY_INVALID") ||
      errorMessage.includes("API key not valid");

    if (isAuthError) {
      return res.status(401).json({ error: "API 키가 올바르지 않습니다. 설정을 확인하세요." });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: "요청 한도를 초과했습니다. 잠시 후 다시 시도하세요." });
    }

    res.status(500).json({ error: error.message || "분석 중 오류가 발생했습니다." });
  }
});

// Serve frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
