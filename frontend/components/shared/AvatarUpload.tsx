'use client';

import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Camera, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImg } from '@/lib/utils/cropImage';

interface AvatarUploadProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40',
};

export function AvatarUpload({ size = 'md', className }: AvatarUploadProps) {
    const { user, updateAvatar } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPx: Area) => {
        setCroppedAreaPixels(croppedAreaPx);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh hợp lệ');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File ảnh không được vượt quá 5MB');
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setCropImageUrl(objectUrl);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setCropModalOpen(true);
        event.target.value = '';
    };

    const handleCropSave = async () => {
        if (!cropImageUrl || !croppedAreaPixels) return;
        setIsUploading(true);
        try {
            const blob = await getCroppedImg(cropImageUrl, croppedAreaPixels);
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
            await updateAvatar(file);
            setPreviewUrl(URL.createObjectURL(blob));
            toast.success('Cập nhật ảnh đại diện thành công');
            setCropModalOpen(false);
            URL.revokeObjectURL(cropImageUrl);
            setCropImageUrl(null);
        } catch (error: unknown) {
            const message = (error as { message?: string })?.message || 'Cập nhật ảnh đại diện thất bại';
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCropCancel = () => {
        if (cropImageUrl) URL.revokeObjectURL(cropImageUrl);
        setCropImageUrl(null);
        setCropModalOpen(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`relative group ${sizeClasses[size]} ${className || ''}`}>
            <Avatar className="h-full w-full border-2 border-background shadow-md">
                <AvatarImage
                    src={previewUrl || user?.avatarUrl}
                    alt={user?.fullName || 'Avatar'}
                    className="object-cover object-center"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>

            <button
                type="button"
                onClick={handleClick}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
                {isUploading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                    <Camera className="h-6 w-6 text-white" />
                )}
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div
                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg border-2 border-background cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            >
                {isUploading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Upload className="h-3 w-3" />
                )}
            </div>

            <Dialog open={cropModalOpen} onOpenChange={(open) => !open && handleCropCancel()}>
                <DialogContent className="w-full max-w-[520px] md:max-w-[640px] lg:max-w-[720px] p-0 gap-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="px-5 pt-4 pb-0">
                        <DialogTitle>Chỉnh ảnh đại diện</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full bg-background flex items-center justify-center px-6 pt-4 pb-6">
                        <div className="relative w-full max-w-[360px] md:max-w-[420px] aspect-square rounded-xl overflow-hidden bg-muted">
                        {cropImageUrl && (
                                <Cropper
                                    image={cropImageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            )}
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-4 border-t bg-background">
                        <Button variant="outline" onClick={handleCropCancel} disabled={isUploading}>
                            Hủy
                        </Button>
                        <Button onClick={handleCropSave} disabled={isUploading || !croppedAreaPixels}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
