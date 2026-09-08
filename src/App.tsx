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

export default function App() {
  const [poles, setPoles] = useState<PoleImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Add uploaded or sample pole images
  const handleImagesAdded = (newImages: PoleImage[]) => {
    setPoles((prev) => [...prev, ...newImages]);
    if (!selectedId && newImages.length > 0) {
      setSelectedId(newImages[0].id);
    }
  };

  // Remove a single pole image from list
  const handleRemovePole = (id: string) => {
    setPoles((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) {
      setSelectedId((prev) => {
        const remaining = poles.filter((p) => p.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    }
  };

  // Clear all poles
  const handleClearAll = () => {
    setPoles([]);
    setSelectedId(null);
  };

  // Update details of a pole (e.g. manual edits)
  const handleUpdatePoleInfo = (id: string, updatedFields: Partial<PoleImage>) => {
    setPoles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  // Analyze a single pole image using server endpoint
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "서버 응답 오류가 발생했습니다.");
      }

      const data = await response.json();

      // Update with extracted data
      setPoles((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "completed",
                lineName: data.lineName,
                computerizedNumber: data.computerizedNumber,
                lineNumber: data.lineNumber,
                confidence: data.confidence,
                extraInfo: data.extraInfo,
                reasoning: data.reasoning,
              }
            : p
        )
      );
    } catch (err: any) {
      console.error("Analysis failed for pole id", id, err);
      setPoles((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: "failed",
                error: err.message || "분석 오류가 발생했습니다.",
              }
            : p
        )
      );
    }
  };

  // Analyze all poles that are currently in 'idle' or 'failed' status
  const handleAnalyzeAll = async () => {
    const pendingPoles = poles.filter(
      (p) => p.status === "idle" || p.status === "failed"
    );
    if (pendingPoles.length === 0) return;

    setIsBulkProcessing(true);

    // Run parallel analysis
    await Promise.all(pendingPoles.map((p) => handleAnalyzePole(p.id)));

    setIsBulkProcessing(false);
  };

  const selectedPole = poles.find((p) => p.id === selectedId) || null;

  // Stat calculations
  const totalCount = poles.length;
  const completedCount = poles.filter((p) => p.status === "completed").length;
  const processingCount = poles.filter((p) => p.status === "processing").length;
  const failedCount = poles.filter((p) => p.status === "failed").length;
  const idleCount = poles.filter((p) => p.status === "idle").length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1C1E] flex flex-col font-sans">
      {/* High Density Header Section */}
      <header className="h-16 bg-[#1A1C1E] text-white flex items-center justify-between px-6 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-inner">
            <Cpu className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold tracking-tight uppercase flex items-center gap-2">
              Utility Pole ID Extraction System v2.4
              <span className="text-[9px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.2 rounded border border-blue-500/40">
                AI PRO
              </span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">전주번호찰 선로 정보 추출 및 검증 통합 관리 플랫폼</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold opacity-90">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-gray-200">System Online (Gemini 3.5 Flash)</span>
          </div>
          <div className="hidden md:block border-l border-gray-700 h-4"></div>
          <span className="text-gray-300 font-mono text-[11px] bg-gray-800/60 px-2.5 py-1 rounded">Operator: KEPCO_Admin_04</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">
        
        {/* Step 1: Upload and Sample selection (Two Grid columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* File Upload Zone */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div className="mb-3">
              <h2 className="font-extrabold text-gray-800 text-xs md:text-sm flex items-center gap-2 uppercase tracking-wide">
                <span className="flex items-center justify-center w-5 h-5 bg-[#1A1C1E] text-white text-[10px] font-black rounded">1</span>
                전주번호찰 이미지 일괄 업로드
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">촬영된 이미지 파일들을 드래그 앤 드롭하여 대기열에 추가합니다.</p>
            </div>
            <DropZone onImagesAdded={handleImagesAdded} />
          </div>

          {/* Quick interactive Samples selection */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
            <div className="mb-3">
              <h2 className="font-extrabold text-gray-800 text-xs md:text-sm flex items-center gap-2 uppercase tracking-wide">
                <span className="flex items-center justify-center w-5 h-5 bg-[#1A1C1E] text-white text-[10px] font-black rounded">2</span>
                신속 검증용 고해상도 샘플 번호판
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">서버 통신 테스트를 위한 표준 한전 규격의 전주번호찰 가상 플레이트입니다.</p>
            </div>
            <SampleSelector onSampleSelected={(image) => handleImagesAdded([image])} />
          </div>

        </div>

        {/* Dashboard Controller / Action bar */}
        {totalCount > 0 && (
          <div className="bg-[#1A1C1E] text-white px-5 py-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-gray-800">
            {/* Status Statistics */}
            <div className="flex flex-wrap items-center gap-3.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
                <span className="font-semibold text-gray-400">TOTAL:</span>
                <span className="font-bold text-white">{totalCount}</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded">
                <span className="font-semibold">EXTRACTED:</span>
                <span className="font-bold">{completedCount}</span>
              </div>

              {processingCount > 0 && (
                <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="font-semibold">RUNNING:</span>
                  <span className="font-bold">{processingCount}</span>
                </div>
              )}

              {failedCount > 0 && (
                <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded">
                  <span className="font-semibold">FAILED:</span>
                  <span className="font-bold">{failedCount}</span>
                </div>
              )}

              {idleCount > 0 && (
                <div className="flex items-center gap-1.5 bg-gray-800 text-gray-300 border border-gray-700/60 px-3 py-1.5 rounded">
                  <span className="font-semibold">WAITING:</span>
                  <span className="font-bold">{idleCount}</span>
                </div>
              )}
            </div>

            {/* Bulk Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                disabled={isBulkProcessing}
                className="px-3.5 py-2 text-xs font-bold bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-700 rounded transition-all cursor-pointer disabled:opacity-40"
              >
                전체 대기열 삭제
              </button>

              <button
                onClick={handleAnalyzeAll}
                disabled={isBulkProcessing || idleCount === 0}
                className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  idleCount === 0
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isBulkProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    일괄 판독 중...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    대기중 {idleCount}건 일괄 분석 실행
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Main Side-by-Side Area (Left: Pole List, Right: Selected Pole Detail) */}
        {totalCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Queue List */}
            <div className="lg:col-span-5">
              <PoleList
                poles={poles}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRemove={handleRemovePole}
                onAnalyze={handleAnalyzePole}
              />
            </div>

            {/* Right Detailed Analysis & Correction Form */}
            <div className="lg:col-span-7">
              <PoleDetail
                pole={selectedPole}
                onAnalyze={handleAnalyzePole}
                onUpdateInfo={handleUpdatePoleInfo}
              />
            </div>

          </div>
        )}

        {/* Step 3: Complete Summary Table (Searchable & Copyable/Exportable) */}
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

      {/* High Density Footer Status Bar */}
      <footer className="h-9 bg-[#1A1C1E] border-t border-gray-800 text-white flex items-center px-6 text-[10px] font-mono shrink-0 justify-between">
        <div className="flex gap-6 text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            GPU-ACCELERATION: ACTIVE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            OCR-ENGINE: V3-PRO
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            MEMORY: 1.4GB / 4.0GB
          </span>
        </div>
        <div className="opacity-70 font-semibold tracking-wider text-gray-400">
          COPYRIGHT © 2026 KEPCO ASSET MANAGEMENT SYSTEM
        </div>
      </footer>
    </div>
  );
}
