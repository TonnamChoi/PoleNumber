export const convertSvgToPngBase64 = (svgMarkup: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        try {
          const pngUrl = canvas.toDataURL("image/png");
          URL.revokeObjectURL(url);
          resolve(pngUrl);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error("Canvas context is not available"));
      }
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = url;
  });
};

/**
 * Format date/time to local strings
 */
export const getNowString = (): string => {
  return new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
