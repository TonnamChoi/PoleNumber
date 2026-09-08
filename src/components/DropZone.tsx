import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import { PoleImage } from "../types";

interface DropZoneProps {
  onImagesAdded: (images: PoleImage[]) => void;
}

export default function DropZone({ onImagesAdded }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList) => {
    setErrorMsg(null);
    const validImages: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        validImages.push(file);
      }
    }

    if (validImages.length === 0) {
      setErrorMsg("올바른 이미지 파일을 업로드해 주세요. (PNG, JPG, JPEG 등)");
      return;
    }

    const newPoleImages: PoleImage[] = [];
    let loadedCount = 0;

    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          newPoleImages.push({
            id: `pole-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: result,
            mimeType: file.type,
            status: "idle",
            error: null,
            lineName: null,
            computerizedNumber: null,
            lineNumber: null,
            confidence: null,
            extraInfo: null,
            reasoning: null,
            isSample: false,
            uploadedAt: new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
        }

        loadedCount++;
        if (loadedCount === validImages.length) {
          onImagesAdded(newPoleImages);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === validImages.length) {
          onImagesAdded(newPoleImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        id="dropzone-container"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-gray-300 hover:border-blue-400 bg-gray-50/60 hover:bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <div className="p-2.5 bg-white rounded border border-gray-200 shadow-xs mb-2 text-blue-600">
          <Upload className="w-5 h-5" />
        </div>
        
        <p className="text-gray-800 font-bold text-xs md:text-sm mb-0.5">
          여기에 전주번호찰 이미지들을 드래그하여 드롭하거나 클릭하여 업로드
        </p>
        <p className="text-gray-400 text-[11px]">
          여러 장의 이미지를 동시에 업로드할 수 있습니다. (PNG, JPG, JPEG 지원)
        </p>
      </div>

      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
