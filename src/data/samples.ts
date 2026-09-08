import { SamplePlate } from "../types";

export const SAMPLE_PLATES: SamplePlate[] = [
  {
    id: "sample-deokpo",
    title: "샘플 A: 덕포지선 9534H212 / 15L2",
    description: "실제 한전 전주번호찰 규격(노란 바탕)을 재현한 표찰 (전산화번호 9534H212 및 호수 15L2 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect x="8" y="6" width="284" height="388" rx="14" fill="#F5C518" stroke="#111827" stroke-width="5"/>

  <text x="95" y="54" font-family="sans-serif" font-size="36" font-weight="900" fill="#DC2626" text-anchor="middle">위</text>
  <circle cx="150" cy="40" r="6" fill="#F5C518" stroke="#111827" stroke-width="2"/>
  <text x="205" y="54" font-family="sans-serif" font-size="36" font-weight="900" fill="#DC2626" text-anchor="middle">험</text>
  <line x1="8" y1="60" x2="292" y2="60" stroke="#111827" stroke-width="5"/>

  <!-- 전산화번호: 5칸 + 3칸 -->
  <rect x="8" y="60" width="56.8" height="58" fill="none" stroke="#9B2242" stroke-width="3"/>
  <rect x="64.8" y="60" width="56.8" height="58" fill="none" stroke="#9B2242" stroke-width="3"/>
  <rect x="121.6" y="60" width="56.8" height="58" fill="none" stroke="#9B2242" stroke-width="3"/>
  <rect x="178.4" y="60" width="56.8" height="58" fill="none" stroke="#9B2242" stroke-width="3"/>
  <rect x="235.2" y="60" width="56.8" height="58" fill="none" stroke="#9B2242" stroke-width="3"/>
  <text x="36.4" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">9</text>
  <text x="93.2" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">5</text>
  <text x="150" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">3</text>
  <text x="206.8" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">4</text>
  <text x="263.6" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">H</text>

  <rect x="8" y="118" width="56.8" height="50" fill="none" stroke="#9B2242" stroke-width="3"/>
  <rect x="64.8" y="118" width="56.8" height="50" fill="none" stroke="#9B2242" stroke-width="3"/>
  <rect x="121.6" y="118" width="56.8" height="50" fill="none" stroke="#9B2242" stroke-width="3"/>
  <text x="36.4" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#111827" text-anchor="middle">2</text>
  <text x="93.2" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#111827" text-anchor="middle">1</text>
  <text x="150" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#111827" text-anchor="middle">2</text>

  <line x1="8" y1="168" x2="292" y2="168" stroke="#111827" stroke-width="5"/>

  <!-- 선로명(세로 글자) + 선로번호(큰 숫자) 박스 -->
  <rect x="8" y="173" width="284" height="136" fill="none" stroke="#9B2242" stroke-width="3"/>
  <line x1="63" y1="173" x2="63" y2="309" stroke="#9B2242" stroke-width="3"/>
  <line x1="8" y1="207" x2="63" y2="207" stroke="#9B2242" stroke-width="2"/>
  <line x1="8" y1="241" x2="63" y2="241" stroke="#9B2242" stroke-width="2"/>
  <line x1="8" y1="275" x2="63" y2="275" stroke="#9B2242" stroke-width="2"/>
  <text x="35.5" y="199" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#111827" text-anchor="middle">덕</text>
  <text x="35.5" y="233" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#111827" text-anchor="middle">포</text>
  <text x="35.5" y="267" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#111827" text-anchor="middle">지</text>
  <text x="35.5" y="301" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#111827" text-anchor="middle">선</text>
  <text x="177.5" y="259" font-family="monospace" font-size="50" font-weight="900" fill="#111827" text-anchor="middle">15L2</text>

  <line x1="8" y1="309" x2="292" y2="309" stroke="#111827" stroke-width="5"/>

  <!-- 기타 정보 -->
  <rect x="8" y="314" width="284" height="30" fill="none" stroke="#9B2242" stroke-width="2"/>
  <text x="16" y="334" font-family="'Inter', sans-serif" font-size="14" font-weight="bold" fill="#111827" text-anchor="start">특고압 22.9kV</text>

  <line x1="8" y1="344" x2="292" y2="344" stroke="#111827" stroke-width="4"/>

  <!-- 시공회사 + 한전 마크 -->
  <text x="16" y="374" font-family="'Inter', sans-serif" font-size="13" font-weight="bold" fill="#111827" text-anchor="start">대한전기(주)</text>
  <circle cx="222" cy="369" r="15" fill="#DC2626"/>
  <text x="222" y="374" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">한전</text>
  <text x="260" y="360" font-family="'Inter', sans-serif" font-size="9" fill="#1E3A8A" text-anchor="middle">문의전화</text>
  <text x="264" y="380" font-family="'Inter', sans-serif" font-size="18" font-weight="900" fill="#DC2626" text-anchor="middle">123</text>
</svg>`
  },
  {
    id: "sample-shinan",
    title: "샘플 B: 신안선 4412A098 / 42-5",
    description: "새로 설치된 노란 바탕 표찰 (전산화번호 4412A098 및 호수 42-5 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect x="8" y="6" width="284" height="388" rx="14" fill="#FBBF24" stroke="#111827" stroke-width="5"/>

  <text x="95" y="54" font-family="sans-serif" font-size="36" font-weight="900" fill="#DC2626" text-anchor="middle">위</text>
  <circle cx="150" cy="40" r="6" fill="#FBBF24" stroke="#111827" stroke-width="2"/>
  <text x="205" y="54" font-family="sans-serif" font-size="36" font-weight="900" fill="#DC2626" text-anchor="middle">험</text>
  <line x1="8" y1="60" x2="292" y2="60" stroke="#111827" stroke-width="5"/>

  <!-- 전산화번호: 5칸 + 3칸 -->
  <rect x="8" y="60" width="56.8" height="58" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <rect x="64.8" y="60" width="56.8" height="58" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <rect x="121.6" y="60" width="56.8" height="58" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <rect x="178.4" y="60" width="56.8" height="58" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <rect x="235.2" y="60" width="56.8" height="58" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <text x="36.4" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">4</text>
  <text x="93.2" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">4</text>
  <text x="150" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">1</text>
  <text x="206.8" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">2</text>
  <text x="263.6" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#111827" text-anchor="middle">A</text>

  <rect x="8" y="118" width="56.8" height="50" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <rect x="64.8" y="118" width="56.8" height="50" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <rect x="121.6" y="118" width="56.8" height="50" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <text x="36.4" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#111827" text-anchor="middle">0</text>
  <text x="93.2" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#111827" text-anchor="middle">9</text>
  <text x="150" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#111827" text-anchor="middle">8</text>

  <line x1="8" y1="168" x2="292" y2="168" stroke="#111827" stroke-width="5"/>

  <!-- 선로명(세로 글자, 3자) + 선로번호(큰 숫자) 박스 -->
  <rect x="8" y="173" width="284" height="135" fill="none" stroke="#B33A3A" stroke-width="3"/>
  <line x1="63" y1="173" x2="63" y2="308" stroke="#B33A3A" stroke-width="3"/>
  <line x1="8" y1="218" x2="63" y2="218" stroke="#B33A3A" stroke-width="2"/>
  <line x1="8" y1="263" x2="63" y2="263" stroke="#B33A3A" stroke-width="2"/>
  <text x="35.5" y="207" font-family="'Inter', sans-serif" font-size="32" font-weight="900" fill="#111827" text-anchor="middle">신</text>
  <text x="35.5" y="252" font-family="'Inter', sans-serif" font-size="32" font-weight="900" fill="#111827" text-anchor="middle">안</text>
  <text x="35.5" y="297" font-family="'Inter', sans-serif" font-size="32" font-weight="900" fill="#111827" text-anchor="middle">선</text>
  <text x="177.5" y="258" font-family="monospace" font-size="50" font-weight="900" fill="#111827" text-anchor="middle">42-5</text>

  <line x1="8" y1="308" x2="292" y2="308" stroke="#111827" stroke-width="5"/>

  <!-- 기타 정보 -->
  <rect x="8" y="313" width="284" height="30" fill="none" stroke="#B33A3A" stroke-width="2"/>
  <text x="16" y="333" font-family="'Inter', sans-serif" font-size="14" font-weight="bold" fill="#111827" text-anchor="start">2024.03 설치</text>

  <line x1="8" y1="343" x2="292" y2="343" stroke="#111827" stroke-width="4"/>

  <!-- 시공회사 + 한전 마크 -->
  <text x="16" y="373" font-family="'Inter', sans-serif" font-size="13" font-weight="bold" fill="#111827" text-anchor="start">우진전기(주)</text>
  <circle cx="222" cy="368" r="15" fill="#DC2626"/>
  <text x="222" y="373" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">한전</text>
  <text x="260" y="359" font-family="'Inter', sans-serif" font-size="9" fill="#1E3A8A" text-anchor="middle">문의전화</text>
  <text x="264" y="379" font-family="'Inter', sans-serif" font-size="18" font-weight="900" fill="#DC2626" text-anchor="middle">123</text>
</svg>`
  },
  {
    id: "sample-seohae",
    title: "샘플 C: 서해분기 1122H554 / 102R3",
    description: "오래되어 색이 바랜 표찰 (전산화번호 1122H554 및 호수 102R3 수록)",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect x="8" y="6" width="284" height="388" rx="14" fill="#D4C483" stroke="#4B3F2A" stroke-width="5"/>

  <text x="95" y="54" font-family="sans-serif" font-size="36" font-weight="900" fill="#A13030" text-anchor="middle">위</text>
  <circle cx="150" cy="40" r="6" fill="#D4C483" stroke="#4B3F2A" stroke-width="2"/>
  <text x="205" y="54" font-family="sans-serif" font-size="36" font-weight="900" fill="#A13030" text-anchor="middle">험</text>
  <line x1="8" y1="60" x2="292" y2="60" stroke="#4B3F2A" stroke-width="5"/>

  <!-- 전산화번호: 5칸 + 3칸 -->
  <rect x="8" y="60" width="56.8" height="58" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <rect x="64.8" y="60" width="56.8" height="58" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <rect x="121.6" y="60" width="56.8" height="58" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <rect x="178.4" y="60" width="56.8" height="58" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <rect x="235.2" y="60" width="56.8" height="58" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <text x="36.4" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#2D2A1F" text-anchor="middle">1</text>
  <text x="93.2" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#2D2A1F" text-anchor="middle">1</text>
  <text x="150" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#2D2A1F" text-anchor="middle">2</text>
  <text x="206.8" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#2D2A1F" text-anchor="middle">2</text>
  <text x="263.6" y="102" font-family="monospace" font-size="34" font-weight="900" fill="#2D2A1F" text-anchor="middle">H</text>

  <rect x="8" y="118" width="56.8" height="50" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <rect x="64.8" y="118" width="56.8" height="50" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <rect x="121.6" y="118" width="56.8" height="50" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <text x="36.4" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#2D2A1F" text-anchor="middle">5</text>
  <text x="93.2" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#2D2A1F" text-anchor="middle">5</text>
  <text x="150" y="154" font-family="monospace" font-size="30" font-weight="900" fill="#2D2A1F" text-anchor="middle">4</text>

  <line x1="8" y1="168" x2="292" y2="168" stroke="#4B3F2A" stroke-width="5"/>

  <!-- 선로명(세로 글자) + 선로번호(큰 숫자) 박스 -->
  <rect x="8" y="173" width="284" height="136" fill="none" stroke="#7A6A4F" stroke-width="3"/>
  <line x1="63" y1="173" x2="63" y2="309" stroke="#7A6A4F" stroke-width="3"/>
  <line x1="8" y1="207" x2="63" y2="207" stroke="#7A6A4F" stroke-width="2"/>
  <line x1="8" y1="241" x2="63" y2="241" stroke="#7A6A4F" stroke-width="2"/>
  <line x1="8" y1="275" x2="63" y2="275" stroke="#7A6A4F" stroke-width="2"/>
  <text x="35.5" y="199" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#2D2A1F" text-anchor="middle">서</text>
  <text x="35.5" y="233" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#2D2A1F" text-anchor="middle">해</text>
  <text x="35.5" y="267" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#2D2A1F" text-anchor="middle">분</text>
  <text x="35.5" y="301" font-family="'Inter', sans-serif" font-size="26" font-weight="900" fill="#2D2A1F" text-anchor="middle">기</text>
  <text x="177.5" y="256" font-family="monospace" font-size="42" font-weight="900" fill="#2D2A1F" text-anchor="middle">102R3</text>

  <line x1="8" y1="309" x2="292" y2="309" stroke="#4B3F2A" stroke-width="5"/>

  <!-- 기타 정보 -->
  <rect x="8" y="314" width="284" height="30" fill="none" stroke="#7A6A4F" stroke-width="2"/>
  <text x="16" y="334" font-family="'Inter', sans-serif" font-size="14" font-weight="bold" fill="#2D2A1F" text-anchor="start">접촉금지</text>

  <line x1="8" y1="344" x2="292" y2="344" stroke="#4B3F2A" stroke-width="4"/>

  <!-- 시공회사 + 한전 마크 -->
  <text x="16" y="374" font-family="'Inter', sans-serif" font-size="13" font-weight="bold" fill="#2D2A1F" text-anchor="start">동서전기(주)</text>
  <circle cx="222" cy="369" r="15" fill="#A13030"/>
  <text x="222" y="374" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">한전</text>
  <text x="260" y="360" font-family="'Inter', sans-serif" font-size="9" fill="#4B3F2A" text-anchor="middle">문의전화</text>
  <text x="264" y="380" font-family="'Inter', sans-serif" font-size="18" font-weight="900" fill="#A13030" text-anchor="middle">123</text>
</svg>`
  }
];
