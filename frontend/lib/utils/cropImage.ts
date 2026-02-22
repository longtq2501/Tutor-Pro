/**
 * Creates a cropped image blob from source image URL and crop area in pixels.
 * Used by AvatarUpload for react-easy-crop output.
 */
export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2d context not available');

  const maxSize = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = 800 / maxSize;
  canvas.width = image.naturalWidth * scale;
  canvas.height = image.naturalHeight * scale;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const cropX = pixelCrop.x * scale;
  const cropY = pixelCrop.y * scale;
  const cropW = pixelCrop.width * scale;
  const cropH = pixelCrop.height * scale;

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = cropW;
  croppedCanvas.height = cropH;
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) throw new Error('Cropped canvas 2d context not available');
  croppedCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.9);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', () => reject(new Error('Failed to load image')));
    img.src = url;
  });
}
