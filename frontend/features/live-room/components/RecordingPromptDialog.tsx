import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, Mic, MessageSquare, PenTool, AlertCircle } from 'lucide-react';

interface RecordingPromptDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onDecline: () => void;
}

/**
 * Dialog prompting tutor to choose whether to record the session.
 * Appears in lobby before joining the live room.
 * 
 * @param {RecordingPromptDialogProps} props - Component props
 */
export const RecordingPromptDialog: React.FC<RecordingPromptDialogProps> = ({
    isOpen,
    onConfirm,
    onDecline
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onDecline()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">Ghi hình buổi học?</DialogTitle>
                    <DialogDescription>
                        Bạn có muốn ghi lại buổi học này không? Video sẽ được lưu trực tiếp vào máy tính của bạn.
                    </DialogDescription>
                </DialogHeader>

                <RecordingExplanation />

                <DialogFooter className="flex gap-2 sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={onDecline}
                        className="flex-1 sm:flex-none rounded-xl font-bold"
                    >
                        Không ghi
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 sm:flex-none rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 gap-2"
                    >
                        <Video className="w-4 h-4" />
                        Ghi hình
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/**
 * Displays explanation of what will be recorded.
 */
const RecordingExplanation: React.FC = () => (
    <div className="space-y-4 py-2">
        <div className="bg-muted/30 rounded-xl p-4 border border-border/40 space-y-3">
            <p className="text-sm font-bold text-foreground mb-2">📹 Nội dung được ghi lại:</p>
            <RecordingItem icon={Video} text="Video từ camera của bạn và học viên" />
            <RecordingItem icon={Mic} text="Âm thanh từ microphone" />
            <RecordingItem icon={PenTool} text="Nội dung trên bảng trắng (whiteboard)" />
            <RecordingItem icon={MessageSquare} text="Tin nhắn chat trong buổi học" />
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-200">
                <p className="font-bold mb-1">Lưu ý quan trọng:</p>
                <p>Bạn có thể bật/tắt ghi hình bất cứ lúc nào trong buổi học. Video sẽ tự động dừng sau 2 giờ.</p>
            </div>
        </div>
    </div>
);

/**
 * Individual recording item with icon and text.
 */
const RecordingItem: React.FC<{ icon: React.ElementType; text: string }> = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-muted-foreground">{text}</span>
    </div>
);
