import React, { useState } from "react";
import { SAMPLE_PLATES } from "../data/samples";
import { convertSvgToPngBase64, getNowString } from "../lib/utils";
import { PoleImage } from "../types";
import { Loader2, Play } from "lucide-react";

interface SampleSelectorProps {
  onSampleSelected: (image: PoleImage) => void;
}

export default function SampleSelector({ onSampleSelected }: SampleSelectorProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSelectSample = async (sampleId: string, title: string, svgMarkup: string) => {
    try {
      setLoadingId(sampleId);
      // Convert SVG to PNG base64 representation
      const base64Png = await convertSvgToPngBase64(svgMarkup);
      
      const newPole: PoleImage = {
        id: `sample-${Date.now()}-${sampleId}`,
        name: `${title.split(": ")[1]}.png`,
        url: base64Png,
        mimeType: "image/png",
        status: "idle",
        error: null,
        lineName: null,
        computerizedNumber: null,
        lineNumber: null,
        confidence: null,
        extraInfo: null,
        reasoning: null,
        isSample: true,
        uploadedAt: getNowString(),
      };

      onSampleSelected(newPole);
    } catch (err) {
      console.error("Failed to load sample image:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_PLATES.map((plate) => {
          const isLoading = loadingId === plate.id;
          return (
            <div
              key={plate.id}
              onClick={() => !isLoading && handleSelectSample(plate.id, plate.title, plate.svgMarkup)}
              className={`group flex flex-col justify-between border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-500 hover:shadow-xs cursor-pointer transition-all duration-200 relative ${
                isLoading ? "opacity-75 cursor-wait" : ""
              }`}
            >
              <div className="flex flex-col items-center gap-2 mb-2">
                {/* Embedded SVG thumbnail preview */}
                <div 
                  className="w-20 h-28 bg-gray-50 border border-gray-200 rounded overflow-hidden flex items-center justify-center p-1 group-hover:scale-102 transition-transform duration-200 shadow-2xs"
                  dangerouslySetInnerHTML={{ __html: plate.svgMarkup }}
                />
                
                <div className="text-center">
                  <h4 className="font-extrabold text-gray-900 text-xs">{plate.title.replace("샘플 ", "샘플 ")}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 h-7 leading-normal">{plate.description}</p>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full mt-1.5 py-1.5 px-3 text-[11px] font-bold bg-gray-50 group-hover:bg-[#1A1C1E] group-hover:text-white border border-gray-200 group-hover:border-[#1A1C1E] rounded flex items-center justify-center gap-1.5 transition-colors duration-150"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    대기중...
                  </>
                ) : (
                  <>
                    <Play className="w-2.5 h-2.5 fill-current" />
                    플레이트 로드
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
