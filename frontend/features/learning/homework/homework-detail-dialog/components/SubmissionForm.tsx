// 📁 homework-detail-dialog/components/SubmissionForm.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import { FileUploader } from './FileUploader';

interface SubmissionFormProps {
  notes: string;
  files: { url: string; filename: string }[];
  uploading: boolean;
  submitting: boolean;
  showMarkInProgress: boolean;
  onNotesChange: (notes: string) => void;
  onUpload: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
  onMarkInProgress: () => void;
  onSubmit: () => void;
}

export function SubmissionForm({
  notes, files, uploading, submitting, showMarkInProgress,
  onNotesChange, onUpload, onRemoveFile, onMarkInProgress, onSubmit
}: SubmissionFormProps) {
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h3 className="font-semibold">📤 Nộp bài</h3>

        <div>
          <label className="text-sm font-medium mb-2 block">Ghi chú (tùy chọn)</label>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Nhập ghi chú về bài làm của bạn..."
            rows={4}
          />
        </div>

        <FileUploader
          files={files}
          uploading={uploading}
          onUpload={onUpload}
          onRemove={onRemoveFile}
        />

        <div className="flex gap-2">
          {showMarkInProgress && (
            <Button variant="outline" onClick={onMarkInProgress}>
              Đánh dấu đang làm
            </Button>
          )}
          <Button
            onClick={onSubmit}
            disabled={submitting || uploading || files.length === 0}
            className="flex-1"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
          </Button>
        </div>
      </div>
    </>
  );
}