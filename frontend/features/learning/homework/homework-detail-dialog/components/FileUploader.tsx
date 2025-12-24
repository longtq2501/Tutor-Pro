// 📁 homework-detail-dialog/components/FileUploader.tsx
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploaderProps {
  files: { url: string; filename: string }[];
  uploading: boolean;
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
}

export function FileUploader({ files, uploading, onUpload, onRemove }: FileUploaderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onUpload(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Upload file bài làm</label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Đang upload...' : 'Chọn file'}
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
          onChange={handleChange}
          className="hidden"
        />
        <span className="text-xs text-muted-foreground">
          PDF, Word, Image, ZIP (Max 50MB)
        </span>
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-sm font-medium">File đã upload ({files.length}):</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">{file.filename}</span>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}