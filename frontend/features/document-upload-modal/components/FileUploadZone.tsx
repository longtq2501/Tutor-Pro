// 📁 document-upload-modal/components/FileUploadZone.tsx
import { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { formatFileSize } from '../utils';

interface FileUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export function FileUploadZone({ file, onFileSelect }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-card-foreground mb-2">
        Chọn file *
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          file ? 'border-primary bg-primary/10' : 'border-border hover:border-primary hover:bg-muted'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          className="hidden"
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="text-primary" size={32} />
            <div className="text-left">
              <p className="font-medium text-card-foreground text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="mx-auto text-muted-foreground mb-2" size={32} />
            <p className="text-muted-foreground text-sm mb-1">
              Click để chọn file hoặc kéo thả file vào đây
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX, PPT, PPTX, TXT (Max 50MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
}