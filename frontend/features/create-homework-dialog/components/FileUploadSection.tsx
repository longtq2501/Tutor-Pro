// ============================================================================
// FILE: create-homework-dialog/components/FileUploadSection.tsx
// ============================================================================
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import type { UploadedFile } from '../types';

interface Props {
  uploadedFiles: UploadedFile[];
  uploading: boolean;
  onUpload: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}

export const FileUploadSection = ({ uploadedFiles, uploading, onUpload, onRemove }: Props) => (
  <div className="space-y-2">
    <Label>Tài liệu đính kèm</Label>
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => document.getElementById('tutor-file-upload')?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Đang upload...' : 'Chọn file'}
      </Button>
      <input
        id="tutor-file-upload"
        type="file"
        multiple
        onChange={(e) => onUpload(e.target.files)}
        className="hidden"
      />
    </div>

    {uploadedFiles.length > 0 && (
      <div className="space-y-2 mt-2">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
            <span className="text-sm truncate flex-1">{file.filename}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);