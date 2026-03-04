type ResizeOptions = {
  width: number;
  height: number;
  quality?: number;
  backgroundColor?: string;
};

export async function resizeImageToCover(file: File, options: ResizeOptions): Promise<File> {
  const { width, height, quality = 0.9, backgroundColor = "#f5f3eb" } = options;
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(width / bitmap.width, height / bitmap.height);
  const drawWidth = Math.round(bitmap.width * scale);
  const drawHeight = Math.round(bitmap.height * scale);
  const dx = Math.round((width - drawWidth) / 2);
  const dy = Math.round((height - drawHeight) / 2);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  // Keep full image visible and add background fields instead of cropping.
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy, drawWidth, drawHeight);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });

  if (!blob) {
    return file;
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
