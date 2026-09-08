import React from "react";
import { MapPin, Ruler, Siren, Network } from "lucide-react";

export default function AboutPlate() {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-base mb-1">번호찰이란?</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          전주(電柱, 흔히 "전봇대")에 부착된 <strong>전주번호찰</strong>은 전주를 구분·관리하기
          위한 표시찰로, "전주의 주민등록증"에 비유됩니다. 이 앱이 사진에서 읽어내는
          <strong> 선로명 · 전산화번호 · 선로번호</strong>가 모두 이 번호찰에 적혀 있습니다.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          전산화번호 8자리, 어떻게 구성될까
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="font-bold text-gray-700 mb-1">앞 4자리</p>
            <p className="text-gray-500 leading-relaxed">
              위도·경도를 기준으로 전국을 2km 격자로 나눈 구역 정보
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="font-bold text-gray-700 mb-1">영문 1자리 + 숫자 3자리</p>
            <p className="text-gray-500 leading-relaxed">
              해당 구역을 500m, 50m 단위로 세분화한 세부 위치 + 전주 설치 순서
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          예: <span className="font-mono font-bold text-blue-700">4827A318</span> 처럼 4자리 숫자
          + 영문 1자리 + 3자리 숫자로 이루어진 8자리 코드. GPS 위도/경도 값 자체는 아니지만,
          한전 내부 격자 시스템에서 위치를 식별하는 일종의 "좌표값" 역할을 합니다.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-blue-600" />
          GPS보다 정확한 위치 정보
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-3 text-gray-500">전주번호찰(전산화번호)</td>
                <td className="py-2 font-bold text-blue-700">약 25~50m 오차</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-gray-500">휴대폰 GPS — 도심</td>
                <td className="py-2 font-bold text-gray-700">약 500m 오차</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-gray-500">휴대폰 GPS — 농촌·외곽</td>
                <td className="py-2 font-bold text-gray-700">약 2~3km 오차</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <Siren className="w-4 h-4 text-blue-600" />
          이럴 때 활용됩니다
        </h3>
        <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
          <li>
            <strong className="text-gray-700">긴급상황 시 위치 확인</strong> — 계곡·산길·농촌·
            해안도로처럼 주소를 알기 어려운 곳에서 사고·조난이 발생했을 때, 주변 전주의 8자리
            전산화번호를 112 또는 119에 전달하면 위치 파악에 도움이 됩니다.
          </li>
          <li>
            <strong className="text-gray-700">고장 신고 시 현장 특정</strong> — 전선·전주 등
            전력설비에 이상이 생겼을 때, 전산화번호를 확인하면 어느 전주에서 문제가 발생했는지
            구분하는 데 도움이 됩니다.
          </li>
          <li>
            <strong className="text-gray-700">GIS(지리정보시스템) 연동</strong> — 한전은
            전산화번호와 전산화된 위치 정보를 함께 활용해 지도 위에서 전력설비를 관리합니다.
          </li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          더 알아보기
        </h3>
        <a
          href="https://online.kepco.co.kr/EWM090D00"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          한전 공식 전산화번호검색 바로가기 →
        </a>
        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
          이 페이지는 한전 공식 카드뉴스 인포그래픽, 특허 KR101515811B1, 언론 보도 등을
          조사해 정리한 자료를 요약한 것입니다. 자세한 출처는 프로젝트 저장소의{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded">docs/kepco-pole-number-plate.md</code>
          에 있습니다.
        </p>
      </div>
    </div>
  );
}
