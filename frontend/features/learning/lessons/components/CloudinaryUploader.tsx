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
}

export function CloudinaryUploader({
  type,
  value,
  onUploadSuccess,
  disabled = false,
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

  const handleRemove = () => {
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
    <div className="space-y-4">
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
        <div className="relative rounded-lg border border-border overflow-hidden">
          {type === 'image' ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="relative w-full h-48 bg-muted flex items-center justify-center">
              <Video className="h-16 w-16 text-muted-foreground" />
              <video
                src={value}
                className="absolute inset-0 w-full h-full object-cover"
                controls
              />
            </div>
          )}
          
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-primary/50 transition-colors cursor-pointer",
            (disabled || isUploading) && "opacity-50 cursor-not-allowed"
          )}
          onClick={!disabled && !isUploading ? handleButtonClick : undefined}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">
                Đang upload {type === 'image' ? 'ảnh' : 'video'}...
              </p>
            </>
          ) : (
            <>
              <Icon className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                Click để chọn {type === 'image' ? 'ảnh' : 'video'}
              </p>
              <p className="text-xs text-muted-foreground">
                {type === 'image'
                  ? 'PNG, JPG, GIF, WebP (tối đa 10MB)'
                  : 'MP4, WebM, OGG, MOV (tối đa 100MB)'}
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {uploadError}
        </div>
      )}

      {/* Current URL Display (for debugging) */}
      {value && (
        <div className="text-xs text-muted-foreground break-all">
          <span className="font-medium">URL:</span> {value}
        </div>
      )}
    </div>
  );
}