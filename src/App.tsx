import React, { useState } from "react";
import DropZone from "./components/DropZone";
import PoleList from "./components/PoleList";
import PoleDetail from "./components/PoleDetail";
import SummaryTable from "./components/SummaryTable";
import SettingsPanel from "./components/SettingsPanel";
import AboutPlate from "./components/AboutPlate";
import { PoleImage } from "./types";
import { AppSettings, loadSettings, saveSettings } from "./lib/settings";
import {
  Sparkles, ShieldCheck, Zap, Server,
  Play, Trash2, Layers, Cpu, Loader2, Settings, ExternalLink, Menu
} from "lucide-react";

export default function App() {
  const [poles, setPoles] = useState<PoleImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<"main" | "about">("main");

  const handleSaveSettings = (next: AppSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  // Add uploaded pole images and immediately start analyzing each one
  const handleImagesAdded = (newImages: PoleImage[]) => {
    setPoles((prev) => [...prev, ...newImages]);
    if (newImages.length > 0) {
      setSelectedId(newImages[newImages.length - 1].id);
    }
    newImages.forEach((image) => {
      analyzePole(image);
    });
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
  const analyzePole = async (targetPole: PoleImage) => {
    const apiKey = settings.keys[settings.selectedProvider];
    if (!apiKey) {
      setPoles((prev) =>
        prev.map((p) =>
          p.id === targetPole.id
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
        p.id === targetPole.id
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "서버 응답 오류가 발생했습니다.");
      }

      const data = await response.json();

      // Update with extracted data
      setPoles((prev) =>
        prev.map((p) =>
          p.id === targetPole.id
            ? {
                ...p,
                status: "completed",
                lineName: data.lineName,
                computerizedNumber: data.computerizedNumber,
                lineNumber: data.lineNumber,
                confidence: data.confidence,
                extraInfo: data.extraInfo,
                reasoning: data.reasoning,
                boundingBox: data.boundingBox ?? null,
              }
            : p
        )
      );
    } catch (err: any) {
      console.error("Analysis failed for pole id", targetPole.id, err);
      setPoles((prev) =>
        prev.map((p) =>
          p.id === targetPole.id
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

  // Look up a pole by id and analyze it (used by retry buttons)
  const handleAnalyzePole = async (id: string) => {
    const targetPole = poles.find((p) => p.id === id);
    if (!targetPole) return;
    await analyzePole(targetPole);
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
  const pendingCount = idleCount + failedCount;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Simple Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
        <button
          onClick={() => setView("main")}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-bold text-gray-900">AI 전주번호찰 선로 정보 추출기</h1>
        </button>
        <div className="flex items-center gap-1 relative">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="AI 설정"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="메뉴"
          >
            <Menu className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5">
                <button
                  onClick={() => {
                    setView("main");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  AI 전주번호찰 선로 정보 추출
                </button>
                <a
                  href="https://online.kepco.co.kr/EWM090D00"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  한전 전산화번호 검색
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
                <button
                  onClick={() => {
                    setView("about");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  번호찰이란?
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">
        {view === "about" ? (
          <AboutPlate />
        ) : (
        <>
        {/* Upload */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="mb-3">
            <h2 className="font-bold text-gray-800 text-sm">이미지 업로드</h2>
            <p className="text-xs text-gray-400 mt-0.5">전주번호찰 이미지를 선택하거나 드롭 하세요</p>
          </div>
          <DropZone onImagesAdded={handleImagesAdded} previewImage={selectedPole} />
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
                disabled={isBulkProcessing || pendingCount === 0}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  pendingCount === 0
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
                    대기중 {pendingCount}건 일괄 분석
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Detail: right below upload */}
        {totalCount > 0 && (
          <div className="w-full">
            <PoleDetail
              pole={selectedPole}
              onAnalyze={handleAnalyzePole}
              onUpdateInfo={handleUpdatePoleInfo}
            />
          </div>
        )}

        {/* Summary */}
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

        {/* List: pushed to the very bottom */}
        {totalCount > 0 && (
          <div className="w-full">
            <PoleList
              poles={poles}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onRemove={handleRemovePole}
              onAnalyze={handleAnalyzePole}
            />
          </div>
        )}
        </>
        )}
      </main>

      <footer className="py-4 text-center text-[11px] text-gray-400 shrink-0">
        제작 : therianchoi@gmail.com
      </footer>

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
