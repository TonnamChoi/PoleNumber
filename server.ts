import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload size limit since we will send base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/extract", async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: "이미지 데이터가 없습니다." });
    }

    // Clean base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: base64Data,
      },
    };

    const textPart = {
      text: `전송된 전주번호찰(전봇대 식별 표지판) 이미지에서 '선로명', '전산화번호'(8자리 격자번호/전산전주번호), '선로번호'(또는 전주번호)를 정확하게 추출해 주세요.
한글 및 숫자, 영문 구성을 주의 깊게 읽어야 합니다. 
예: '덕포지선', '고잔선', '신안선', '서해분기' 같은 선로명, '9281L321', '4412A098', '1122H554' 같은 8자리 전산화번호, 그리고 '12', '1호', '15L2', '42R1' 같은 선로번호(또는 호수/전주순번)를 각각 찾으세요.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lineName: {
              type: Type.STRING,
              description: "전주번호찰에서 추출한 '선로명' (예: '신안선', '덕적선', '서해분기'). 찾지 못한 경우 null",
            },
            computerizedNumber: {
              type: Type.STRING,
              description: "전주번호찰에서 추출한 8자리의 '전산화번호' (예: '9281L321', '4412A098', '1122H554'). 찾지 못한 경우 null",
            },
            lineNumber: {
              type: Type.STRING,
              description: "전주번호찰에서 추출한 '선로번호' 또는 호수/순번 (예: '12', '1호', '15L2', '42R1'). 찾지 못한 경우 null",
            },
            confidence: {
              type: Type.INTEGER,
              description: "추출 정확도에 대한 신뢰도 점수 (0 ~ 100)",
            },
            extraInfo: {
              type: Type.STRING,
              description: "전주번호찰 상에 적힌 기타 정보 (예: '22.9kV', 'KEPCO', 제작년도, 좌표 등). 없으면 null",
            },
            reasoning: {
              type: Type.STRING,
              description: "추출한 선로명, 전산화번호, 선로번호를 이미지의 어느 부분에서 확인했는지 한국어로 간단히 설명",
            }
          },
          required: ["lineName", "computerizedNumber", "lineNumber", "confidence"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Gemini 응답이 비어 있습니다.");
    }

    const data = JSON.parse(resultText.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
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
