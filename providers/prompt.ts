export const EXTRACTION_INSTRUCTION = `전송된 전주번호찰(전봇대 식별 표지판) 이미지에서 '선로명', '전산화번호'(8자리 격자번호/전산전주번호), '선로번호'(또는 전주번호)를 정확하게 추출해 주세요.
한글 및 숫자, 영문 구성을 주의 깊게 읽어야 합니다.
예: '덕포지선', '고잔선', '신안선', '서해분기' 같은 선로명, '9281L321', '4412A098', '1122H554' 같은 8자리 전산화번호, 그리고 '12', '1호', '15L2', '42R1' 같은 선로번호(또는 호수/전주순번)를 각각 찾으세요.

또한 이미지 전체에서 번호판(전주번호찰)이 차지하는 사각형 영역을 boundingBox로 알려주세요.
x, y는 번호판 좌상단 모서리의 위치, width, height는 번호판의 가로/세로 크기이며, 모두 이미지
전체 크기에 대한 비율(0~1 사이 소수)로 표현합니다. 예를 들어 번호판이 이미지 왼쪽에서 20%,
위에서 10% 지점부터 시작하고 폭이 이미지의 30%, 높이가 이미지의 40%를 차지한다면
{"x": 0.2, "y": 0.1, "width": 0.3, "height": 0.4} 입니다. 번호판을 찾지 못한 경우 null.

다음 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON 객체만):
{
  "lineName": string | null,
  "computerizedNumber": string | null,
  "lineNumber": string | null,
  "confidence": number,
  "extraInfo": string | null,
  "reasoning": string | null,
  "boundingBox": { "x": number, "y": number, "width": number, "height": number } | null
}
- lineName: 선로명, 찾지 못한 경우 null
- computerizedNumber: 8자리 전산화번호, 찾지 못한 경우 null
- lineNumber: 선로번호 또는 호수/순번, 찾지 못한 경우 null
- confidence: 추출 정확도 신뢰도 점수 (0~100 정수)
- extraInfo: 기타 정보 (전압, 제작사, 좌표 등), 없으면 null
- reasoning: 어느 부분에서 확인했는지 한국어로 간단히 설명, 없으면 null
- boundingBox: 번호판이 이미지에서 차지하는 영역 (0~1 비율), 찾지 못한 경우 null`;
