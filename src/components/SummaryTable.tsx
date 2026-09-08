import React, { useState } from "react";
import { PoleImage } from "../types";
import { Search, Download, Clipboard, Trash2, CheckCircle2, ShieldAlert, Clock } from "lucide-react";

interface SummaryTableProps {
  poles: PoleImage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function SummaryTable({ poles, selectedId, onSelect, onRemove, onClearAll }: SummaryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Filter completed or active poles matching the search term
  const filteredPoles = poles.filter((pole) => {
    const term = searchTerm.toLowerCase();
    const matchesLineName = pole.lineName?.toLowerCase().includes(term);
    const matchesComputerizedNumber = pole.computerizedNumber?.toLowerCase().includes(term);
    const matchesLineNumber = pole.lineNumber?.toLowerCase().includes(term);
    const matchesFileName = pole.name.toLowerCase().includes(term);
    return matchesLineName || matchesComputerizedNumber || matchesLineNumber || matchesFileName;
  });

  // Export to CSV
  const handleDownloadCSV = () => {
    if (poles.length === 0) return;

    // Header with UTF-8 BOM so Excel opens Korean characters correctly
    let csvContent = "\uFEFF";
    csvContent += "No,파일명,선로명,전산화번호,선로번호,신뢰도(%),기타 정보,분석상태,등록시간\n";

    poles.forEach((pole, index) => {
      const row = [
        index + 1,
        `"${pole.name.replace(/"/g, '""')}"`,
        `"${(pole.lineName || "미검출").replace(/"/g, '""')}"`,
        `"${(pole.computerizedNumber || "미검출").replace(/"/g, '""')}"`,
        `"${(pole.lineNumber || "미검출").replace(/"/g, '""')}"`,
        pole.confidence || 0,
        `"${(pole.extraInfo || "").replace(/"/g, '""')}"`,
        pole.status === "completed" ? "성공" : pole.status === "failed" ? "실패" : "대기중",
        pole.uploadedAt,
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `전주번호찰_선로추출_결과_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to Clipboard (TSV format for Excel pasting)
  const handleCopyToClipboard = () => {
    if (poles.length === 0) return;

    let tsvText = "No\t파일명\t선로명\t전산화번호\t선로번호\t신뢰도(%)\t기타 정보\t등록시간\n";
    poles.forEach((pole, index) => {
      tsvText += `${index + 1}\t${pole.name}\t${pole.lineName || "미검출"}\t${pole.computerizedNumber || "미검출"}\t${pole.lineNumber || "미검출"}\t${pole.confidence || 0}\t${pole.extraInfo || ""}\t${pole.uploadedAt}\n`;
    });

    navigator.clipboard.writeText(tsvText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
      {/* Table Action Controls */}
      <div className="p-3.5 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-gray-700 text-xs uppercase tracking-wider">추출 결과 종합 데이터 테이블</h3>
          <span className="text-[11px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded font-mono">
            {poles.length}건 로드됨
          </span>
        </div>

        {/* Filter / Search & Download Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="선로명, 번호, 파일명 실시간 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2.5 py-1 w-full text-xs border border-gray-300 rounded outline-none hover:border-gray-400 focus:border-blue-500 transition-all bg-white font-medium"
            />
          </div>

          {poles.length > 0 && (
            <>
              {/* Copy Button */}
              <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    클립보드 복사됨!
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5 text-gray-500" />
                    엑셀용 복사 (TSV)
                  </>
                )}
              </button>

              {/* CSV Button */}
              <button
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#1A1C1E] hover:bg-black text-white rounded transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                엑셀 다운로드 (.csv)
              </button>

              {/* Clear All */}
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold hover:bg-red-50 text-red-600 border border-transparent rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                목록 비우기
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table Render */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold text-[10px] uppercase tracking-wider">
              <th className="py-2 px-3 text-center w-12 border-r border-gray-200">번호</th>
              <th className="py-2 px-3 w-14 text-center border-r border-gray-200">미리보기</th>
              <th className="py-2 px-3 border-r border-gray-200">파일명</th>
              <th className="py-2 px-3 border-r border-gray-200">선로명</th>
              <th className="py-2 px-3 border-r border-gray-200">전산화번호</th>
              <th className="py-2 px-3 border-r border-gray-200">선로번호</th>
              <th className="py-2 px-3 text-center border-r border-gray-200 w-24">정확도</th>
              <th className="py-2 px-3 border-r border-gray-200">기타 세부 정보</th>
              <th className="py-2 px-3 text-center border-r border-gray-200 w-24">판독 상태</th>
              <th className="py-2 px-3 text-center w-16">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredPoles.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-gray-400 text-[11px]">
                  {searchTerm ? "검색 결과와 일치하는 선로 정보가 없습니다." : "표시할 추출 결과 데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              filteredPoles.map((pole, index) => {
                const isSelected = pole.id === selectedId;
                return (
                  <tr
                    key={pole.id}
                    onClick={() => onSelect(pole.id)}
                    className={`text-[12px] hover:bg-blue-50/50 transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-50/30 font-bold" : ""
                    }`}
                  >
                    <td className="py-2 px-3 text-center text-gray-400 font-mono border-r border-gray-100">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="py-1 px-3 text-center border-r border-gray-100">
                      <div className="w-8 h-11 rounded bg-gray-100 border border-gray-200 overflow-hidden inline-flex items-center justify-center">
                        <img
                          src={pole.url}
                          alt="preview"
                          className="object-cover w-full h-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-700 font-mono truncate max-w-[140px] border-r border-gray-100" title={pole.name}>
                      {pole.name}
                    </td>
                    <td className="py-2 px-3 border-r border-gray-100">
                      {pole.status === "completed" ? (
                        <span className="font-extrabold text-blue-700 font-sans">
                          {pole.lineName || "-"}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic font-mono">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-gray-100">
                      {pole.status === "completed" ? (
                        <span className="font-extrabold font-mono text-blue-800 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[11px]">
                          {pole.computerizedNumber || "-"}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic font-mono">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-gray-100">
                      {pole.status === "completed" ? (
                        <span className="font-extrabold font-mono text-gray-900">
                          {pole.lineNumber || "-"}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic font-mono">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center border-r border-gray-100">
                      {pole.status === "completed" && pole.confidence ? (
                        <div className="flex items-center gap-1.5 justify-center">
                          <div className="w-12 bg-gray-200 h-1 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full ${
                                pole.confidence >= 90 ? "bg-green-500" : pole.confidence >= 70 ? "bg-blue-500" : "bg-red-500"
                              }`}
                              style={{ width: `${pole.confidence}%` }}
                            />
                          </div>
                          <span className={`inline-block text-[10px] font-extrabold font-mono px-1 py-0.2 rounded ${
                            pole.confidence >= 90 
                              ? "bg-green-50 text-green-700" 
                              : pole.confidence >= 70 
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {pole.confidence}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic font-mono">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-gray-500 truncate max-w-[150px] border-r border-gray-100" title={pole.extraInfo || ""}>
                      {pole.status === "completed" ? pole.extraInfo || "-" : "-"}
                    </td>
                    <td className="py-2 px-3 text-center border-r border-gray-100">
                      {pole.status === "completed" && (
                        <span className="inline-block text-[10px] bg-green-50 text-green-700 rounded px-1.5 py-0.5 font-extrabold tracking-wider">
                          추출완료
                        </span>
                      )}
                      {pole.status === "failed" && (
                        <span className="inline-block text-[10px] bg-red-50 text-red-700 rounded px-1.5 py-0.5 font-extrabold tracking-wider">
                          실패
                        </span>
                      )}
                      {pole.status === "processing" && (
                        <span className="inline-block text-[10px] bg-blue-50 text-blue-700 rounded px-1.5 py-0.5 font-extrabold tracking-wider animate-pulse">
                          분석중
                        </span>
                      )}
                      {pole.status === "idle" && (
                        <span className="inline-block text-[10px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 font-bold tracking-wider">
                          대기중
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onRemove(pole.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
