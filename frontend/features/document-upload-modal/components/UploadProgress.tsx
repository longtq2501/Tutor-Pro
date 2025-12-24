// 📁 document-upload-modal/components/UploadProgress.tsx
interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div>
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Đang tải lên...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}