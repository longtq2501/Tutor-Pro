'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CloudinaryUploaderProps {
  type: 'image' | 'video';
  value?: string;
  onUploadSuccess: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CloudinaryUploader({
  type,
  value,
  onUploadSuccess,
  disabled = false,
  className,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

    if (type === 'image' && !validImageTypes.includes(file.type)) {
      setUploadError('Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      setUploadError('Vui lòng chọn file video hợp lệ (MP4, WebM, OGG, MOV)');
      return;
    }

    // Validate file size (10MB for images, 100MB for videos)
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(
        `File quá lớn. Kích thước tối đa: ${type === 'image' ? '10MB' : '100MB'}`
      );
      return;
    }

    // Check environment variables
    if (!cloudName || !uploadPreset) {
      setUploadError('Thiếu cấu hình Cloudinary. Vui lòng kiểm tra file .env.local');
      console.error('Missing Cloudinary configuration:', { cloudName, uploadPreset });
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      // Optional: Add folder organization
      if (type === 'image') {
        formData.append('folder', 'lessons/thumbnails');
      } else {
        formData.append('folder', 'lessons/videos');
      }

      const resourceType = type === 'image' ? 'image' : 'video';
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload thất bại');
      }

      const data = await response.json();
      onUploadSuccess(data.secure_url);
      setUploadError(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload file'
      );
    } finally {
      setIsUploading(false);
      // Reset input để có thể chọn lại cùng file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUploadSuccess('');
    setUploadError(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const Icon = type === 'image' ? ImageIcon : Video;
  const acceptTypes = type === 'image'
    ? 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
    : 'video/mp4,video/webm,video/ogg,video/quicktime';

  return (
    <div className={cn("relative w-full h-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Preview hoặc Upload Button */}
      {value ? (
        <div className="relative w-full h-full overflow-hidden bg-black group">
          {type === 'image' ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={value}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 pointer-events-auto"
              onClick={handleButtonClick}
              disabled={disabled || isUploading}
            >
              Thay đổi
            </Button>
          </div>

          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full h-full rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer",
            (disabled || isUploading) && "opacity-50 cursor-not-allowed"
          )}
          onClick={!disabled && !isUploading ? handleButtonClick : undefined}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-16 w-16">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
              <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-widest">
                Đang tải...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center p-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                Tải lên {type === 'image' ? 'ảnh bìa' : 'video'}
              </p>
              <p className="text-sm text-muted-foreground">
                Định dạng {type === 'image' ? 'IMG' : 'Video'} tối đa {type === 'image' ? '10MB' : '100MB'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="absolute top-2 left-2 right-2 z-10 text-[10px] font-bold text-white bg-destructive px-3 py-1.5 rounded shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <X className="h-3 w-3" />
          {uploadError}
          <button onClick={() => setUploadError(null)} className="ml-auto underline">Đóng</button>
        </div>
      )}
    </div>
  );
}
