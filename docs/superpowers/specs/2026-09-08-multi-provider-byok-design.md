# 멀티 프로바이더 BYOK 설정 + UI 미니멀 재설계

날짜: 2026-09-08

## 배경

현재 프로젝트는 전주번호찰(전봇대 식별 표지판) 이미지에서 '선로명', '전산화번호', '선로번호'를
Gemini API로 추출하는 Vite+React+Express 앱이다. 서버(`server.ts`)가 환경변수
`GEMINI_API_KEY` 하나로 Gemini를 호출하는 구조라, 이 앱을 공개 배포해 "아무나" 쓰게 하려면
소유자가 API 비용/사용량 한도를 전부 떠안아야 한다.

## 목표

- 사용자가 직접 자신의 AI API 키(Gemini/Claude/OpenAI 중 선택)를 입력해서 쓰도록 바꾼다 (BYOK).
- DB나 서버 측 키 저장 없이, 키는 브라우저(localStorage)에만 둔다.
- 화면을 지금의 진한 "관제센터" 스타일에서 미니멀한 톤으로 재설계한다.

## 범위

**포함**
- `/api/extract`를 provider-agnostic하게 변경 (Gemini/Claude/OpenAI 3종 지원)
- 설정(⚙) 화면: 프로바이더 선택 + 키 입력, localStorage 저장
- 메인 화면 미니멀 재설계 (기존 컴포넌트 로직 재사용, 스타일만 교체)
- 에러 처리 (키 누락/오류, 프로바이더 오류)

**제외 (다음 단계로 미룸)**
- Vercel 서버리스 함수 전환, PWA(manifest/service worker) 설정
- 커스텀 OpenAI-호환 엔드포인트 입력 지원
- 인증, 사용량 제한, DB

## 아키텍처

### 1. 백엔드 — 프로바이더 추상화

`/api/extract` 요청 바디를 다음으로 변경한다:

```ts
{ provider: "gemini" | "claude" | "openai", apiKey: string, image: string, mimeType: string }
```

서버는 요청마다 받은 `apiKey`로 그때그때 클라이언트를 생성해 호출하고, **어디에도 저장하거나
로그로 남기지 않는다**. 기존 서버 환경변수 `GEMINI_API_KEY` 의존은 제거한다 (BYOK 취지와 상충).

신규 디렉터리 `providers/` (repo 루트, `server.ts`와 같은 레벨)를 만들어 프로바이더별 로직을 분리한다:

- `providers/types.ts` — 공통 타입 `ExtractionResult`, `Provider`
- `providers/prompt.ts` — 세 프로바이더가 공유하는 한국어 추출 프롬프트 상수 (기존 `server.ts`의
  프롬프트 텍스트를 그대로 이관)
- `providers/gemini.ts` — 기존 `@google/genai` 호출 로직 이관
- `providers/claude.ts` — `@anthropic-ai/sdk` 신규 구현 (`claude-opus-5`, 이미지 content block +
  structured output)
- `providers/openai.ts` — `openai` SDK 신규 구현 (vision 지원 모델 + JSON 스키마 응답 강제; 정확한
  최신 모델명은 구현 시점에 확인)
- `providers/index.ts` — `provider` 문자열로 위 셋 중 하나를 골라 호출하는 디스패처
  `extract(provider, apiKey, base64Data, mimeType): Promise<ExtractionResult>`

각 구현은 동일한 JSON 스키마(`lineName`, `computerizedNumber`, `lineNumber`, `confidence`,
`extraInfo`, `reasoning`)로 정규화된 결과를 반환하므로, 프론트는 프로바이더가 무엇이든 동일한
모양의 응답을 받는다.

`server.ts`의 `/api/extract` 핸들러는 `providers/index.ts`의 `extract()`만 호출하도록 얇아진다.
`apiKey`나 `provider`가 없으면 400을 반환한다.

### 2. 프론트 — 설정 저장

신규 파일 `src/lib/settings.ts`:

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

export function loadSettings(): AppSettings { /* localStorage 읽기, 실패 시 DEFAULT_SETTINGS */ }
export function saveSettings(settings: AppSettings): void { /* localStorage 쓰기 */ }
```

`App.tsx`는 마운트 시 `loadSettings()`로 초기 상태를 채우고, 설정 변경 시 `saveSettings()`를
호출한다. 분석 요청(`handleAnalyzePole`)은 현재 `selectedProvider`와 해당 키를 함께 전송한다.
키가 비어 있으면 API를 호출하지 않고 즉시 "설정에서 API 키를 먼저 입력하세요" 오류로 처리하며
설정 패널을 연다.

### 3. 설정 화면

신규 컴포넌트 `src/components/SettingsPanel.tsx`: 헤더의 ⚙ 버튼으로 여는 모달/패널.

- 프로바이더 선택 라디오 3개 (기본값 Gemini)
- 현재 선택된 프로바이더의 키 입력창 1개만 노출 (마스킹된 input, 값 토글 가능)
- 저장 버튼 → `saveSettings()` + 부모 상태 갱신
- 안내 문구: "입력한 키는 이 브라우저에만 저장되고, 분석할 때만 서버로 전달되며 서버에는
  저장되지 않습니다."

### 4. 메인 화면 미니멀 재설계

`App.tsx` 및 기존 컴포넌트(`DropZone`, `SampleSelector`, `PoleList`, `PoleDetail`,
`SummaryTable`)의 **로직은 그대로 재사용**하고 스타일만 교체한다.

- 제거: 진한 다크 헤더의 통계 배지, "KEPCO"/"Operator" 가짜 운영 정보, 모노스페이스 상태바
  ("GPU-ACCELERATION", "MEMORY: 1.4GB/4.0GB" 등 장식용 가짜 시스템 정보)
- 유지/단순화: 업로드 → 목록/상세 → 요약 표의 3단계 흐름, lg 그리드 반응형 레이아웃
- 헤더: 앱 이름 + ⚙ 버튼만 남긴 밝은 톤
- 모바일 1단 / 데스크톱 2단 컬럼 유지

## 에러 처리

| 상황 | 메시지 |
|---|---|
| 키 미입력 | "설정에서 API 키를 먼저 입력하세요." |
| 인증 실패 (401 등) | "API 키가 올바르지 않습니다. 설정을 확인하세요." |
| 요청 한도 초과 (429) | "요청 한도를 초과했습니다. 잠시 후 다시 시도하세요." |
| 기타 서버/네트워크 오류 | 기존 방식대로 오류 메시지 표시 |

## 데이터/타입 변경 요약

- `src/types.ts`: `PoleImage`는 변경 없음. `providers/types.ts`에 `ExtractionResult`, `Provider` 신규.
- `package.json`: `@anthropic-ai/sdk`, `openai` 의존성 추가.
- `.env.example`: `GEMINI_API_KEY` 관련 안내 제거 (더 이상 서버가 요구하지 않음).

## 테스트/검증 계획

이 프로젝트에는 테스트 프레임워크가 없다. 기존과 동일하게:
- `npm run lint` (`tsc --noEmit`)로 타입 체크
- dev 서버(`npm run dev`)를 띄우고 브라우저에서 Gemini/Claude/OpenAI 키를 각각 넣어
  업로드 → 분석 → 결과 확인까지 수동 검증
