type ResizeOptions = {
  width: number;
  height: number;
  quality?: number;
};

export async function resizeImageToCover(file: File, options: ResizeOptions): Promise<File> {
  const { width, height, quality = 0.9 } = options;
  const bitmap = await createImageBitmap(file);

  const srcRatio = bitmap.width / bitmap.height;
  const targetRatio = width / height;

  let sx = 0;
  let sy = 0;
  let sw = bitmap.width;
  let sh = bitmap.height;

  // Crop from center so every uploaded image fills the same card ratio.
  if (srcRatio > targetRatio) {
    sw = Math.round(bitmap.height * targetRatio);
    sx = Math.round((bitmap.width - sw) / 2);
  } else if (srcRatio < targetRatio) {
    sh = Math.round(bitmap.width / targetRatio);
    sy = Math.round((bitmap.height - sh) / 2);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height);
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
