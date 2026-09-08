import React from "react";
import { PoleImage } from "../types";
import { Loader2, CheckCircle, AlertTriangle, Play, Trash2, HelpCircle } from "lucide-react";

interface PoleListProps {
  poles: PoleImage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAnalyze: (id: string) => void;
}

export default function PoleList({ poles, selectedId, onSelect, onRemove, onAnalyze }: PoleListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <h3 className="font-extrabold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
          분석 대상 목록
          <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold font-mono">
            {poles.length} Files
          </span>
        </h3>
        {poles.length > 0 && (
          <p className="text-[10px] text-gray-400 font-medium">클릭하여 상세 검증</p>
        )}
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1 bg-gray-50/40">
        {poles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <HelpCircle className="w-9 h-9 mb-2 stroke-1 text-gray-300" />
            <p className="text-xs font-bold text-gray-500">대기 중인 이미지가 없습니다</p>
            <p className="text-[10px] mt-1 text-gray-400 max-w-[200px] leading-normal">
              상단 업로드 대기열에 파일을 올리거나 빠른 샘플을 로드하십시오.
            </p>
          </div>
        ) : (
          poles.map((pole) => {
            const isSelected = pole.id === selectedId;
            
            // Generate status badge
            let badgeStyle = "bg-gray-100 text-gray-600 border-gray-200";
            let badgeText = "분석 대기";
            let badgeIcon = <HelpCircle className="w-3 h-3" />;
 
            if (pole.status === "processing") {
              badgeStyle = "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
              badgeText = "분석 중...";
              badgeIcon = <Loader2 className="w-3 h-3 animate-spin text-blue-600" />;
            } else if (pole.status === "completed") {
              badgeStyle = "bg-green-50 text-green-700 border-green-200";
              badgeText = "추출 완료";
              badgeIcon = <CheckCircle className="w-3 h-3 text-green-600" />;
            } else if (pole.status === "failed") {
              badgeStyle = "bg-red-50 text-red-700 border-red-200";
              badgeText = "추출 실패";
              badgeIcon = <AlertTriangle className="w-3 h-3 text-red-600" />;
            }
 
            return (
              <div
                key={pole.id}
                onClick={() => onSelect(pole.id)}
                className={`flex items-center gap-2.5 p-2 rounded border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/65 border-blue-500 ring-1 ring-blue-100"
                    : "border-transparent bg-white hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="w-10 h-14 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center relative">
                  <img
                    src={pole.url}
                    alt={pole.name}
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                  {pole.isSample && (
                    <span className="absolute top-0 left-0 bg-blue-600 text-white text-[7px] px-1 rounded-br font-bold uppercase tracking-wider scale-95 origin-top-left">
                      Sample
                    </span>
                  )}
                </div>
 
                {/* Information */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-[12px] truncate" title={pole.name}>
                    {pole.name}
                  </p>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5">{pole.uploadedAt}</p>
                  
                  {/* Extracted preview text or status */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold border px-1.5 py-0.2 rounded ${badgeStyle}`}>
                      {badgeIcon}
                      {badgeText}
                    </span>
                    
                    {pole.status === "completed" && pole.lineName && (
                      <span className="inline-block bg-gray-100 text-gray-700 border border-gray-200 text-[9px] font-bold px-1.5 py-0.2 rounded truncate max-w-[110px] font-mono">
                        {pole.lineName}
                      </span>
                    )}
                    {pole.status === "completed" && pole.computerizedNumber && (
                      <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold px-1.5 py-0.2 rounded truncate max-w-[110px] font-mono">
                        {pole.computerizedNumber}
                      </span>
                    )}
                  </div>
                </div>
 
                {/* Action Buttons */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {pole.status !== "processing" && (
                    <button
                      onClick={() => onAnalyze(pole.id)}
                      title="추출 분석 시작"
                      className="p-1 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded border border-transparent hover:border-blue-200"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={() => onRemove(pole.id)}
                    title="목록에서 삭제"
                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
