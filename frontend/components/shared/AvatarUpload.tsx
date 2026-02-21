'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh hợp lệ');
            return;
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File ảnh không được vượt quá 5MB');
            return;
        }

        // Show local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        try {
            setIsUploading(true);
            await updateAvatar(file);
            toast.success('Cập nhật ảnh đại diện thành công');
        } catch (error: unknown) {
            const message = (error as { message?: string })?.message || 'Cập nhật ảnh đại diện thất bại';
            toast.error(message);
            setPreviewUrl(null); // Revert preview on failure
        } finally {
            setIsUploading(false);
            // Clean up object URL
            URL.revokeObjectURL(objectUrl);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`relative group ${sizeClasses[size]} ${className || ''}`}>
            <Avatar className={`h-full w-full border-2 border-background shadow-md`}>
                <AvatarImage
                    src={previewUrl || user?.avatarUrl}
                    alt={user?.fullName || 'Avatar'}
                    className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>

            {/* Overlay on hover */}
            <button
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

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Upload button icon below for accessibility if needed (optional) */}
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg border-2 border-background cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={handleClick}
            >
                {isUploading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Upload className="h-3 w-3" />
                )}
            </div>
        </div>
    );
}
