import { SamplePlate } from "../types";

export const SAMPLE_PLATES: SamplePlate[] = [
  {
    id: "sample-deokpo",
    title: "샘플 A: 덕포지선 9534H212 / 15L2",
    description: "전형적인 노란색 한전 전주번호찰 (전산화번호 9534H212 및 호수 15L2 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect width="300" height="400" rx="15" fill="#FBBF24" stroke="#1F2937" stroke-width="8"/>
  <rect x="15" y="15" width="270" height="370" rx="10" fill="none" stroke="#4B5563" stroke-width="2" stroke-dasharray="6 4"/>
  
  <!-- KEPCO logo symbol -->
  <circle cx="150" cy="45" r="14" fill="#1E3A8A"/>
  <text x="150" y="49" font-family="sans-serif" font-size="8" font-weight="black" fill="#FFFFFF" text-anchor="middle">KEPCO</text>
  
  <!-- Computerized Number (전산화번호) -->
  <text x="150" y="95" font-family="monospace" font-size="22" font-weight="900" fill="#1E3A8A" letter-spacing="2" text-anchor="middle">9534H212</text>
  
  <!-- Line Name -->
  <text x="150" y="145" font-family="'Inter', sans-serif" font-size="34" font-weight="bold" fill="#111827" text-anchor="middle">덕포지선</text>
  
  <!-- Divider -->
  <line x1="30" y1="180" x2="270" y2="180" stroke="#111827" stroke-width="5"/>
  
  <!-- Pole Number -->
  <text x="150" y="270" font-family="monospace" font-size="64" font-weight="900" fill="#111827" text-anchor="middle">15L2</text>
  
  <!-- Voltage Label -->
  <rect x="50" y="315" width="200" height="42" rx="6" fill="#1F2937"/>
  <text x="150" y="342" font-family="'Inter', sans-serif" font-size="16" font-weight="bold" fill="#FBBF24" text-anchor="middle">특고압 22.9 kV</text>
</svg>`
  },
  {
    id: "sample-shinan",
    title: "샘플 B: 신안선 4412A098 / 42-5",
    description: "현대식 흰색 전주번호찰 (전산화번호 4412A098 및 호수 42-5 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect width="300" height="400" rx="15" fill="#F9FAFB" stroke="#2563EB" stroke-width="8"/>
  <rect x="15" y="15" width="270" height="370" rx="10" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="4 4"/>
  
  <!-- Blue Symbol -->
  <rect x="135" y="30" width="30" height="30" rx="4" fill="#2563EB"/>
  <circle cx="150" cy="45" r="8" fill="#FFFFFF"/>
  <text x="150" y="80" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" fill="#2563EB" text-anchor="middle">한국전력공사</text>
  
  <!-- Computerized Number (전산화번호) -->
  <text x="150" y="115" font-family="monospace" font-size="22" font-weight="900" fill="#2563EB" letter-spacing="2" text-anchor="middle">4412A098</text>
  
  <!-- Line Name -->
  <text x="150" y="170" font-family="'Inter', sans-serif" font-size="38" font-weight="bold" fill="#1E3A8A" text-anchor="middle">신안선</text>
  
  <!-- Divider -->
  <line x1="40" y1="210" x2="260" y2="210" stroke="#2563EB" stroke-width="4"/>
  
  <!-- Pole Number -->
  <text x="150" y="295" font-family="monospace" font-size="64" font-weight="bold" fill="#1E3A8A" text-anchor="middle">42-5</text>
  
  <!-- Danger warning -->
  <text x="150" y="355" font-family="'Inter', sans-serif" font-size="13" font-weight="bold" fill="#EF4444" text-anchor="middle">▲ 위험: 특고압 22,900V</text>
</svg>`
  },
  {
    id: "sample-seohae",
    title: "샘플 C: 서해분기 1122H554 / 102R3",
    description: "진한 오렌지색 분기선로 번호찰 (전산화번호 1122H554 및 호수 102R3 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect width="300" height="400" rx="15" fill="#F59E0B" stroke="#1F2937" stroke-width="10"/>
  
  <!-- Symbol -->
  <polygon points="150,20 165,50 135,50" fill="#DC2626"/>
  <text x="150" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">!</text>
  
  <!-- Computerized Number (전산화번호) -->
  <text x="150" y="85" font-family="monospace" font-size="22" font-weight="900" fill="#111827" letter-spacing="2" text-anchor="middle">1122H554</text>
  
  <!-- Line Name -->
  <text x="150" y="135" font-family="'Inter', sans-serif" font-size="36" font-weight="bold" fill="#111827" text-anchor="middle">서해분기</text>
  
  <!-- Divider -->
  <line x1="30" y1="170" x2="270" y2="170" stroke="#1F2937" stroke-width="6"/>
  
  <!-- Pole Number -->
  <text x="150" y="260" font-family="monospace" font-size="52" font-weight="900" fill="#111827" text-anchor="middle">102R3</text>
  
  <!-- Alert -->
  <text x="150" y="320" font-family="'Inter', sans-serif" font-size="16" font-weight="bold" fill="#111827" text-anchor="middle">경고 : 접촉금지</text>
  <rect x="100" y="340" width="100" height="24" rx="4" fill="#DC2626"/>
  <text x="150" y="356" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">DANGER</text>
</svg>`
  }
];
