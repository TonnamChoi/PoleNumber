import { SamplePlate } from "../types";

export const SAMPLE_PLATES: SamplePlate[] = [
  {
    id: "sample-deokpo",
    title: "샘플 A: 덕포지선 9534H212 / 15L2",
    description: "실제 한전 전주번호찰 규격의 흰색 표찰 (전산화번호 9534H212 및 호수 15L2 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <!-- Plate body: white/off-white with black border, matching real KEPCO pole tags -->
  <rect x="10" y="10" width="280" height="380" rx="8" fill="#FAFAF7" stroke="#1F2937" stroke-width="4"/>

  <!-- Header: small red logo dot + 위험 -->
  <circle cx="35" cy="32" r="9" fill="#DC2626"/>
  <text x="115" y="40" font-family="sans-serif" font-size="24" font-weight="900" fill="#DC2626" text-anchor="middle">위</text>
  <text x="185" y="40" font-family="sans-serif" font-size="24" font-weight="900" fill="#DC2626" text-anchor="middle">험</text>
  <line x1="10" y1="55" x2="290" y2="55" stroke="#1F2937" stroke-width="3"/>

  <!-- 전산화번호 -->
  <text x="150" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" letter-spacing="1" text-anchor="middle">9534H212</text>
  <line x1="10" y1="125" x2="290" y2="125" stroke="#1F2937" stroke-width="2"/>

  <!-- 선로명 -->
  <text x="150" y="180" font-family="'Inter', sans-serif" font-size="38" font-weight="bold" fill="#111827" text-anchor="middle">덕포지선</text>
  <line x1="10" y1="205" x2="290" y2="205" stroke="#1F2937" stroke-width="2"/>

  <!-- 선로번호 -->
  <text x="150" y="285" font-family="monospace" font-size="58" font-weight="900" fill="#111827" text-anchor="middle">15L2</text>
  <line x1="10" y1="320" x2="290" y2="320" stroke="#1F2937" stroke-width="2"/>

  <!-- Bottom row: extra info + KEPCO mark -->
  <text x="25" y="358" font-family="'Inter', sans-serif" font-size="13" fill="#374151" text-anchor="start">특고압 22.9kV</text>
  <path d="M 215 345 Q 245 335 275 350 Q 245 360 215 345 Z" fill="#DC2626"/>
  <text x="245" y="373" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" fill="#1E3A8A" text-anchor="middle">한국전력</text>
</svg>`
  },
  {
    id: "sample-shinan",
    title: "샘플 B: 신안선 4412A098 / 42-5",
    description: "새로 설치된 표찰 (전산화번호 4412A098 및 호수 42-5 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <!-- Plate body: white/off-white with black border, matching real KEPCO pole tags -->
  <rect x="10" y="10" width="280" height="380" rx="8" fill="#FCFCFA" stroke="#1F2937" stroke-width="4"/>

  <!-- Header: small red logo dot + 위험 -->
  <circle cx="35" cy="32" r="9" fill="#DC2626"/>
  <text x="115" y="40" font-family="sans-serif" font-size="24" font-weight="900" fill="#DC2626" text-anchor="middle">위</text>
  <text x="185" y="40" font-family="sans-serif" font-size="24" font-weight="900" fill="#DC2626" text-anchor="middle">험</text>
  <line x1="10" y1="55" x2="290" y2="55" stroke="#1F2937" stroke-width="3"/>

  <!-- 전산화번호 -->
  <text x="150" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" letter-spacing="1" text-anchor="middle">4412A098</text>
  <line x1="10" y1="125" x2="290" y2="125" stroke="#1F2937" stroke-width="2"/>

  <!-- 선로명 -->
  <text x="150" y="180" font-family="'Inter', sans-serif" font-size="38" font-weight="bold" fill="#111827" text-anchor="middle">신안선</text>
  <line x1="10" y1="205" x2="290" y2="205" stroke="#1F2937" stroke-width="2"/>

  <!-- 선로번호 -->
  <text x="150" y="285" font-family="monospace" font-size="58" font-weight="900" fill="#111827" text-anchor="middle">42-5</text>
  <line x1="10" y1="320" x2="290" y2="320" stroke="#1F2937" stroke-width="2"/>

  <!-- Bottom row: extra info + KEPCO mark -->
  <text x="25" y="358" font-family="'Inter', sans-serif" font-size="13" fill="#374151" text-anchor="start">2024.03 설치</text>
  <path d="M 215 345 Q 245 335 275 350 Q 245 360 215 345 Z" fill="#DC2626"/>
  <text x="245" y="373" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" fill="#1E3A8A" text-anchor="middle">한국전력</text>
</svg>`
  },
  {
    id: "sample-seohae",
    title: "샘플 C: 서해분기 1122H554 / 102R3",
    description: "오래되어 색이 바랜 표찰 (전산화번호 1122H554 및 호수 102R3 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <!-- Plate body: weathered off-white with black border, matching real KEPCO pole tags -->
  <rect x="10" y="10" width="280" height="380" rx="8" fill="#F0EEE6" stroke="#374151" stroke-width="4"/>

  <!-- Header: small red logo dot + 위험 (slightly faded) -->
  <circle cx="35" cy="32" r="9" fill="#B91C1C"/>
  <text x="115" y="40" font-family="sans-serif" font-size="24" font-weight="900" fill="#B91C1C" text-anchor="middle">위</text>
  <text x="185" y="40" font-family="sans-serif" font-size="24" font-weight="900" fill="#B91C1C" text-anchor="middle">험</text>
  <line x1="10" y1="55" x2="290" y2="55" stroke="#374151" stroke-width="3"/>

  <!-- 전산화번호 -->
  <text x="150" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#1F2937" letter-spacing="1" text-anchor="middle">1122H554</text>
  <line x1="10" y1="125" x2="290" y2="125" stroke="#374151" stroke-width="2"/>

  <!-- 선로명 -->
  <text x="150" y="180" font-family="'Inter', sans-serif" font-size="38" font-weight="bold" fill="#1F2937" text-anchor="middle">서해분기</text>
  <line x1="10" y1="205" x2="290" y2="205" stroke="#374151" stroke-width="2"/>

  <!-- 선로번호 -->
  <text x="150" y="285" font-family="monospace" font-size="58" font-weight="900" fill="#1F2937" text-anchor="middle">102R3</text>
  <line x1="10" y1="320" x2="290" y2="320" stroke="#374151" stroke-width="2"/>

  <!-- Bottom row: extra info + KEPCO mark -->
  <text x="25" y="358" font-family="'Inter', sans-serif" font-size="13" fill="#4B5563" text-anchor="start">접촉금지</text>
  <path d="M 215 345 Q 245 335 275 350 Q 245 360 215 345 Z" fill="#B91C1C"/>
  <text x="245" y="373" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" fill="#374151" text-anchor="middle">한국전력</text>
</svg>`
  }
];
