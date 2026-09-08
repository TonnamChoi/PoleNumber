# 멀티 프로바이더 BYOK + UI 미니멀 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사용자가 Gemini/Claude/OpenAI 중 원하는 AI의 API 키를 직접 입력해서 쓰는 BYOK(Bring Your Own Key) 구조로 전환하고, 화면을 미니멀하게 재설계한다.

**Architecture:** `server.ts`의 `/api/extract`를 provider-agnostic한 라우트로 바꾸고, 프로바이더별 호출 로직은 신규 `providers/` 디렉터리(gemini.ts/claude.ts/openai.ts + 공통 types/prompt)에 분리한다. 프론트는 `localStorage`에 선택된 프로바이더와 키를 저장하고, 분석 요청마다 그 값을 서버로 보낸다(서버는 저장하지 않음).

**Tech Stack:** Vite, React 19, TypeScript, Express(dev/serve), `@google/genai`(기존), `@anthropic-ai/sdk`(신규), `openai`(신규), Tailwind CSS.

**Spec:** [docs/superpowers/specs/2026-09-08-multi-provider-byok-design.md](../specs/2026-09-08-multi-provider-byok-design.md)

## Global Constraints

- 테스트 프레임워크 없음 — 각 태스크의 검증은 `npm run lint`(`tsc --noEmit`)로 타입 체크하고, 마지막 태스크에서 브라우저로 수동 E2E 검증한다.
- 키는 서버 어디에도 저장·로그하지 않는다 (요청마다 받아서 즉시 사용만 한다).
- 세 프로바이더 모두 동일한 JSON 응답 모양(`lineName`, `computerizedNumber`, `lineNumber`, `confidence`, `extraInfo`, `reasoning`)으로 정규화한다.
- 백엔드 프로바이더 유니언 타입은 `providers/types.ts`의 `Provider`, 프론트 쪽은 `src/lib/settings.ts`의 `ProviderId` — 이름이 다르지만 의도적으로 분리된 것이니(서버/클라이언트 번들 경계) 통합하지 않는다.
- Vercel 서버리스 전환, PWA(manifest/service worker), 커스텀 엔드포인트 입력, 인증/DB는 이 계획의 범위 밖이다.

---

### Task 1: Gemini 프로바이더 모듈 분리

**Files:**
- Create: `providers/types.ts`
- Create: `providers/prompt.ts`
- Create: `providers/gemini.ts`

**Interfaces:**
- Produces: `Provider` (`"gemini" | "claude" | "openai"`), `ExtractionResult { lineName: string | null; computerizedNumber: string | null; lineNumber: string | null; confidence: number | null; extraInfo: string | null; reasoning: string | null; }`, `ExtractParams { apiKey: string; base64Data: string; mimeType: string; }` — 모두 `providers/types.ts`에서 export
- Produces: `EXTRACTION_INSTRUCTION: string` — `providers/prompt.ts`에서 export
- Produces: `extractWithGemini(params: ExtractParams): Promise<ExtractionResult>` — `providers/gemini.ts`에서 export

- [ ] **Step 1: `providers/types.ts` 작성**

```ts
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
```

- [ ] **Step 2: `providers/prompt.ts` 작성** (기존 `server.ts`의 프롬프트 텍스트를 그대로 이관 + 세 프로바이더가 공유할 JSON 형식 지시문 추가)

```ts
export const EXTRACTION_INSTRUCTION = `전송된 전주번호찰(전봇대 식별 표지판) 이미지에서 '선로명', '전산화번호'(8자리 격자번호/전산전주번호), '선로번호'(또는 전주번호)를 정확하게 추출해 주세요.
한글 및 숫자, 영문 구성을 주의 깊게 읽어야 합니다.
예: '덕포지선', '고잔선', '신안선', '서해분기' 같은 선로명, '9281L321', '4412A098', '1122H554' 같은 8자리 전산화번호, 그리고 '12', '1호', '15L2', '42R1' 같은 선로번호(또는 호수/전주순번)를 각각 찾으세요.

다음 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON 객체만):
{
  "lineName": string | null,
  "computerizedNumber": string | null,
  "lineNumber": string | null,
  "confidence": number,
  "extraInfo": string | null,
  "reasoning": string | null
}
- lineName: 선로명, 찾지 못한 경우 null
- computerizedNumber: 8자리 전산화번호, 찾지 못한 경우 null
- lineNumber: 선로번호 또는 호수/순번, 찾지 못한 경우 null
- confidence: 추출 정확도 신뢰도 점수 (0~100 정수)
- extraInfo: 기타 정보 (전압, 제작사, 좌표 등), 없으면 null
- reasoning: 어느 부분에서 확인했는지 한국어로 간단히 설명, 없으면 null`;
```

- [ ] **Step 3: `providers/gemini.ts` 작성** (기존 `server.ts`의 Gemini 호출 로직을 그대로 옮기되 `apiKey`를 매개변수로 받도록 변경)

```ts
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult, ExtractParams } from "./types";
import { EXTRACTION_INSTRUCTION } from "./prompt";

export async function extractWithGemini({
  apiKey,
  base64Data,
  mimeType,
}: ExtractParams): Promise<ExtractionResult> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

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
        },
        required: ["lineName", "computerizedNumber", "lineNumber", "confidence"],
      },
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Gemini 응답이 비어 있습니다.");
  }

  return JSON.parse(resultText.trim()) as ExtractionResult;
}
```

- [ ] **Step 4: 타입 체크**

Run: `npm run lint`
Expected: `providers/*.ts` 관련 에러 없음 (기존 `server.ts`가 아직 옛 로직을 쓰고 있어도 무관 — Task 4에서 교체함)

- [ ] **Step 5: Commit**

```bash
git add providers/types.ts providers/prompt.ts providers/gemini.ts
git commit -m "refactor: extract Gemini call into providers/gemini.ts"
```

---

### Task 2: Claude 프로바이더 구현

**Files:**
- Create: `providers/claude.ts`
- Modify: `package.json` (의존성 추가, `npm install`로 자동 반영)

**Interfaces:**
- Consumes: `ExtractionResult`, `ExtractParams`, `EXTRACTION_INSTRUCTION` (Task 1)
- Produces: `extractWithClaude(params: ExtractParams): Promise<ExtractionResult>`

- [ ] **Step 1: 패키지 설치**

Run: `npm install @anthropic-ai/sdk`
Expected: `package.json`의 `dependencies`에 `@anthropic-ai/sdk` 추가됨

- [ ] **Step 2: `providers/claude.ts` 작성**

```ts
import Anthropic from "@anthropic-ai/sdk";
import { ExtractionResult, ExtractParams } from "./types";
import { EXTRACTION_INSTRUCTION } from "./prompt";

export async function extractWithClaude({
  apiKey,
  base64Data,
  mimeType,
}: ExtractParams): Promise<ExtractionResult> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    output_config: { effort: "low" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: base64Data,
            },
          },
          {
            type: "text",
            text: EXTRACTION_INSTRUCTION,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  if (!textBlock) {
    throw new Error("Claude 응답이 비어 있습니다.");
  }

  const jsonText = textBlock.text.trim().replace(/^```json\s*|```\s*$/g, "");
  return JSON.parse(jsonText) as ExtractionResult;
}
```

- [ ] **Step 3: 타입 체크**

Run: `npm run lint`
Expected: `providers/claude.ts` 관련 에러 없음

- [ ] **Step 4: Commit**

```bash
git add providers/claude.ts package.json package-lock.json
git commit -m "feat: add Claude provider for pole plate extraction"
```

---

### Task 3: OpenAI 프로바이더 구현

**Files:**
- Create: `providers/openai.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `ExtractionResult`, `ExtractParams`, `EXTRACTION_INSTRUCTION` (Task 1)
- Produces: `extractWithOpenAI(params: ExtractParams): Promise<ExtractionResult>`

- [ ] **Step 1: 패키지 설치**

Run: `npm install openai`
Expected: `package.json`의 `dependencies`에 `openai` 추가됨

- [ ] **Step 2: `providers/openai.ts` 작성** (OpenAI Responses API, `text.format`의 `json_schema` strict 모드로 구조화된 출력을 강제한다 — strict 모드에서는 모든 필드를 `required`에 넣고, null 허용 필드는 타입을 `["string", "null"]`처럼 유니언으로 표현해야 한다)

```ts
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
```

- [ ] **Step 3: 타입 체크**

Run: `npm run lint`
Expected: `providers/openai.ts` 관련 에러 없음

- [ ] **Step 4: Commit**

```bash
git add providers/openai.ts package.json package-lock.json
git commit -m "feat: add OpenAI provider for pole plate extraction"
```

---

### Task 4: 프로바이더 디스패처 + server.ts provider-agnostic화

**Files:**
- Create: `providers/index.ts`
- Modify: `server.ts` (전체 재작성)
- Modify: `.env.example` (GEMINI_API_KEY 안내 제거)
- Modify: `package.json` (`dotenv` 의존성 제거 — 이 태스크로 완전히 미사용됨)

**Interfaces:**
- Consumes: `extractWithGemini`(Task 1), `extractWithClaude`(Task 2), `extractWithOpenAI`(Task 3), `Provider`/`ExtractionResult`/`ExtractParams`(Task 1)
- Produces: `extract(provider: Provider, params: ExtractParams): Promise<ExtractionResult>` — `providers/index.ts`에서 export. 이후 프론트(Task 6)가 보내는 `/api/extract` 요청 바디 모양: `{ provider: Provider, apiKey: string, image: string, mimeType: string }`

- [ ] **Step 1: `providers/index.ts` 작성**

```ts
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
```

- [ ] **Step 2: `server.ts` 전체 교체**

```ts
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

    if (error.status === 401 || error.status === 403) {
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
```

- [ ] **Step 3: `.env.example`에서 `GEMINI_API_KEY` 블록 제거** — 파일을 다음 내용으로 교체 (`APP_URL` 블록은 그대로 유지):

```
# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
```

- [ ] **Step 4: `package.json`에서 `dotenv` 의존성 제거**

`dependencies`의 `"dotenv": "^17.2.3",` 줄을 삭제한다.

- [ ] **Step 5: 타입 체크**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 6: Commit**

```bash
git add providers/index.ts server.ts .env.example package.json
git commit -m "feat: make /api/extract provider-agnostic (BYOK)"
```

---

### Task 5: 프론트 설정 저장 유틸

**Files:**
- Create: `src/lib/settings.ts`

**Interfaces:**
- Produces: `ProviderId` (`"gemini" | "claude" | "openai"`), `AppSettings { selectedProvider: ProviderId; keys: Record<ProviderId, string>; }`, `loadSettings(): AppSettings`, `saveSettings(settings: AppSettings): void`

- [ ] **Step 1: `src/lib/settings.ts` 작성**

```ts
export type ProviderId = "gemini" | "claude" | "openai";

export interface AppSettings {
  selectedProvider: ProviderId;
  keys: Record<ProviderId, string>;
}

const STORAGE_KEY = "pole-extractor:settings";

const DEFAULT_SETTINGS: AppSettings = {
  selectedProvider: "gemini",
  keys: { gemini: "", claude: "", openai: "" },
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      selectedProvider: parsed.selectedProvider ?? DEFAULT_SETTINGS.selectedProvider,
      keys: { ...DEFAULT_SETTINGS.keys, ...parsed.keys },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
```

- [ ] **Step 2: 타입 체크**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/lib/settings.ts
git commit -m "feat: add localStorage-backed settings for BYOK"
```

---

### Task 6: SettingsPanel 컴포넌트 + App.tsx BYOK 연동

**Files:**
- Create: `src/components/SettingsPanel.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `AppSettings`, `ProviderId`, `loadSettings`, `saveSettings` (Task 5)
- Produces: `SettingsPanel` 컴포넌트 props `{ isOpen: boolean; settings: AppSettings; onSave: (settings: AppSettings) => void; onClose: () => void; }`

- [ ] **Step 1: `src/components/SettingsPanel.tsx` 작성**

```tsx
import React, { useEffect, useState } from "react";
import { X, KeyRound } from "lucide-react";
import { AppSettings, ProviderId } from "../lib/settings";

interface SettingsPanelProps {
  isOpen: boolean;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const PROVIDER_LABELS: Record<ProviderId, string> = {
  gemini: "Gemini",
  claude: "Claude",
  openai: "OpenAI",
};

export default function SettingsPanel({ isOpen, settings, onSave, onClose }: SettingsPanelProps) {
  const [provider, setProvider] = useState<ProviderId>(settings.selectedProvider);
  const [keyValue, setKeyValue] = useState(settings.keys[settings.selectedProvider]);

  useEffect(() => {
    if (isOpen) {
      setProvider(settings.selectedProvider);
      setKeyValue(settings.keys[settings.selectedProvider]);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleProviderChange = (next: ProviderId) => {
    setProvider(next);
    setKeyValue(settings.keys[next]);
  };

  const handleSave = () => {
    onSave({
      selectedProvider: provider,
      keys: { ...settings.keys, [provider]: keyValue },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            AI 설정
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {(Object.keys(PROVIDER_LABELS) as ProviderId[]).map((id) => (
            <label key={id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="provider"
                checked={provider === id}
                onChange={() => handleProviderChange(id)}
              />
              {PROVIDER_LABELS[id]}
            </label>
          ))}
        </div>

        <label className="block text-xs font-semibold text-gray-500 mb-1">
          {PROVIDER_LABELS[provider]} API 키
        </label>
        <input
          type="password"
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          placeholder="API 키를 입력하세요"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
          입력한 키는 이 브라우저에만 저장되고, 분석할 때만 서버로 전달되며 서버에는 저장되지 않습니다.
        </p>

        <button
          onClick={handleSave}
          className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold text-sm py-2 rounded-lg transition-colors"
        >
          저장
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `src/App.tsx` 상단 import에 설정 관련 모듈 추가**

`src/App.tsx`의 기존 import 블록:

```tsx
import React, { useState } from "react";
import DropZone from "./components/DropZone";
import SampleSelector from "./components/SampleSelector";
import PoleList from "./components/PoleList";
import PoleDetail from "./components/PoleDetail";
import SummaryTable from "./components/SummaryTable";
import { PoleImage } from "./types";
import { 
  Sparkles, ShieldCheck, Zap, Server, 
  Play, Trash2, Layers, Cpu, Loader2
} from "lucide-react";
```

다음으로 교체:

```tsx
import React, { useState } from "react";
import DropZone from "./components/DropZone";
import SampleSelector from "./components/SampleSelector";
import PoleList from "./components/PoleList";
import PoleDetail from "./components/PoleDetail";
import SummaryTable from "./components/SummaryTable";
import SettingsPanel from "./components/SettingsPanel";
import { PoleImage } from "./types";
import { AppSettings, loadSettings, saveSettings } from "./lib/settings";
import { 
  Sparkles, ShieldCheck, Zap, Server, 
  Play, Trash2, Layers, Cpu, Loader2, Settings
} from "lucide-react";
```

- [ ] **Step 3: 설정 state 추가**

`export default function App() {` 바로 다음 줄인 기존:

```tsx
  const [poles, setPoles] = useState<PoleImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
```

다음으로 교체:

```tsx
  const [poles, setPoles] = useState<PoleImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSaveSettings = (next: AppSettings) => {
    setSettings(next);
    saveSettings(next);
  };
```

- [ ] **Step 4: `handleAnalyzePole`에 키 검증 + provider/apiKey 전송 추가**

기존:

```tsx
  const handleAnalyzePole = async (id: string) => {
    // Locate the pole
    const targetPole = poles.find((p) => p.id === id);
    if (!targetPole) return;

    // Set processing state
    setPoles((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "processing", error: null }
          : p
      )
    );

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: targetPole.url,
          mimeType: targetPole.mimeType,
        }),
      });
```

다음으로 교체:

```tsx
  const handleAnalyzePole = async (id: string) => {
    // Locate the pole
    const targetPole = poles.find((p) => p.id === id);
    if (!targetPole) return;

    const apiKey = settings.keys[settings.selectedProvider];
    if (!apiKey) {
      setPoles((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: "failed", error: "설정에서 API 키를 먼저 입력하세요." }
            : p
        )
      );
      setIsSettingsOpen(true);
      return;
    }

    // Set processing state
    setPoles((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "processing", error: null }
          : p
      )
    );

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: settings.selectedProvider,
          apiKey,
          image: targetPole.url,
          mimeType: targetPole.mimeType,
        }),
      });
```

- [ ] **Step 5: 헤더에 설정 버튼 추가**

기존 헤더의 `<header ...>` 블록 안, `<div className="flex items-center gap-6 text-xs font-semibold opacity-90">` 여는 태그 바로 앞에 다음을 추가:

```tsx
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="AI 설정"
        >
          <Settings className="w-5 h-5" />
        </button>
```

- [ ] **Step 6: `SettingsPanel` 렌더링 추가**

`App.tsx`의 최상위 반환 JSX 맨 마지막, `</footer>` 바로 다음 (root `<div>`가 닫히기 전)에 추가:

```tsx
      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
```

- [ ] **Step 7: 타입 체크**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 8: Commit**

```bash
git add src/components/SettingsPanel.tsx src/App.tsx
git commit -m "feat: wire BYOK settings panel into App"
```

---

### Task 7: App.tsx 메인 화면 미니멀 재설계

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Task 6에서 만든 state/handler (`settings`, `isSettingsOpen`, `handleSaveSettings`, `setIsSettingsOpen`), 기존 `poles`/`selectedId`/`isBulkProcessing`과 그 핸들러들, `SettingsPanel`
- Produces: 없음 (시각적 변경만, 로직/인터페이스 변경 없음)

- [ ] **Step 1: `return (` 부터 함수 끝의 `);`까지 전체를 아래 JSX로 교체** (기존 다크 헤더/통계바/가짜 시스템 정보 푸터를 걷어내고, 업로드→목록/상세→요약의 단순한 흐름으로 재구성. `Cpu`, `Play`, `Loader2`, `Settings` 아이콘만 사용하고 나머지 기존 import는 그대로 둔다)

```tsx
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Simple Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-bold text-gray-900">전주번호찰 선로 정보 추출기</h1>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="AI 설정"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">

        {/* Step 1: Upload and Sample selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
            <div className="mb-3">
              <h2 className="font-bold text-gray-800 text-sm">1. 이미지 업로드</h2>
              <p className="text-xs text-gray-400 mt-0.5">촬영된 전주번호찰 이미지를 드래그 앤 드롭하거나 선택하세요.</p>
            </div>
            <DropZone onImagesAdded={handleImagesAdded} />
          </div>

          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-4">
            <div className="mb-3">
              <h2 className="font-bold text-gray-800 text-sm">2. 샘플로 빠르게 테스트</h2>
              <p className="text-xs text-gray-400 mt-0.5">직접 촬영한 이미지가 없다면 샘플 번호판으로 먼저 체험해보세요.</p>
            </div>
            <SampleSelector onSampleSelected={(image) => handleImagesAdded([image])} />
          </div>
        </div>

        {/* Action bar */}
        {totalCount > 0 && (
          <div className="bg-white border border-gray-200 px-4 py-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">전체 {totalCount}</span>
              <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-semibold">완료 {completedCount}</span>
              {processingCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> 분석 중 {processingCount}
                </span>
              )}
              {failedCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-semibold">실패 {failedCount}</span>
              )}
              {idleCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold">대기 {idleCount}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                disabled={isBulkProcessing}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
              >
                전체 삭제
              </button>
              <button
                onClick={handleAnalyzeAll}
                disabled={isBulkProcessing || idleCount === 0}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  idleCount === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isBulkProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    대기중 {idleCount}건 일괄 분석
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: List + Detail */}
        {totalCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5">
              <PoleList
                poles={poles}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRemove={handleRemovePole}
                onAnalyze={handleAnalyzePole}
              />
            </div>
            <div className="lg:col-span-7">
              <PoleDetail
                pole={selectedPole}
                onAnalyze={handleAnalyzePole}
                onUpdateInfo={handleUpdatePoleInfo}
              />
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {totalCount > 0 && (
          <div className="w-full">
            <SummaryTable
              poles={poles}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onRemove={handleRemovePole}
              onClearAll={handleClearAll}
            />
          </div>
        )}
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
```

- [ ] **Step 2: 타입 체크**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "style: redesign main screen with a minimal look"
```

---

### Task 8: 수동 E2E 검증 (3개 프로바이더)

**Files:** 없음 (검증 전용 태스크)

**Interfaces:** 없음

- [ ] **Step 1: dev 서버 실행**

Run: `npm run dev`
Expected: `http://localhost:3000`에서 새 미니멀 화면이 뜨고, 콘솔에 에러 없음

- [ ] **Step 2: 키 없이 분석 시도**

브라우저에서 샘플 이미지를 하나 로드하고 "AI 분석 시작하기"를 누른다.
Expected: "설정에서 API 키를 먼저 입력하세요." 오류가 뜨고 설정 패널이 자동으로 열림

- [ ] **Step 3: Gemini 키로 검증**

설정 패널에서 Gemini 선택(기본값) 후 실제 Gemini API 키 입력 → 저장 → 샘플 이미지 분석 실행.
Expected: 분석이 성공하고 선로명/전산화번호/선로번호가 채워짐

- [ ] **Step 4: Claude 키로 검증**

설정 패널에서 Claude로 전환, Claude API 키 입력 → 저장 → 다른 샘플 이미지 분석 실행.
Expected: 분석 성공, 동일한 필드 구성으로 결과 표시

- [ ] **Step 5: OpenAI 키로 검증**

설정 패널에서 OpenAI로 전환, OpenAI API 키 입력 → 저장 → 다른 샘플 이미지 분석 실행.
Expected: 분석 성공, 동일한 필드 구성으로 결과 표시

- [ ] **Step 6: 잘못된 키로 오류 메시지 확인**

아무 프로바이더에나 임의의 잘못된 문자열을 키로 넣고 분석 실행.
Expected: "API 키가 올바르지 않습니다. 설정을 확인하세요." 오류 표시

- [ ] **Step 7: 새로고침 후 설정 유지 확인**

브라우저를 새로고침(F5)한다.
Expected: 마지막으로 저장한 프로바이더/키가 설정 패널에 그대로 남아 있음 (localStorage 영속 확인)
