import React, { useState } from "react";
import DropZone from "./components/DropZone";
import SampleSelector from "./components/SampleSelector";
import PoleList from "./components/PoleList";
import PoleDetail from "./components/PoleDetail";
import SummaryTable from "./components/SummaryTable";
import SettingsPanel from "./components/SettingsPanel";
import { PoleImage } from "./types";
import { AppSettings, loadSettings, saveSettings } from "./lib/settings";
import {
  Sparkles, ShieldCheck, Zap, Server,
  Play, Trash2, Layers, Cpu, Loader2, Settings
} from "lucide-react";

export default function App() {
  const [poles, setPoles] = useState<PoleImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSaveSettings = (next: AppSettings) => {
    setSettings(next);
    saveSettings(next);
  };

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

    const apiKey = settings.keys[settings.selectedProvider];
    if (!apiKey) {
      setPoles((prev) =>
        prev.map((p) =>
          p.id === id
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
  const pendingCount = idleCount + failedCount;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Simple Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-bold text-gray-900">AI 전주번호찰 선로 정보 추출기</h1>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="AI 설정"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">

        {/* Step 1: Upload and Sample selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
            <div className="mb-3">
              <h2 className="font-bold text-gray-800 text-sm">1. 이미지 업로드</h2>
              <p className="text-xs text-gray-400 mt-0.5">촬영된 전주번호찰 이미지를 드래그 앤 드롭하거나 선택하세요.</p>
            </div>
            <DropZone onImagesAdded={handleImagesAdded} />
          </div>

          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-4">
            <div className="mb-3">
              <h2 className="font-bold text-gray-800 text-sm">2. 샘플로 빠르게 테스트</h2>
              <p className="text-xs text-gray-400 mt-0.5">직접 촬영한 이미지가 없다면 샘플 번호판으로 먼저 체험해보세요.</p>
            </div>
            <SampleSelector onSampleSelected={(image) => handleImagesAdded([image])} />
          </div>
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

        {/* Step 2: List + Detail */}
        {totalCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5">
              <PoleList
                poles={poles}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRemove={handleRemovePole}
                onAnalyze={handleAnalyzePole}
              />
            </div>
            <div className="lg:col-span-7">
              <PoleDetail
                pole={selectedPole}
                onAnalyze={handleAnalyzePole}
                onUpdateInfo={handleUpdatePoleInfo}
              />
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
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

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
