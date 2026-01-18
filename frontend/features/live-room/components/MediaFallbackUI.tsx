"use client";

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    CameraOff,
    MicOff,
    RefreshCw,
    AlertCircle,
    Settings,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MediaErrorType } from '../hooks/useMediaStream';

interface MediaFallbackUIProps {
    error: MediaErrorType | null;
    isLoading: boolean;
    onRetry: () => void;
    devices?: MediaDeviceInfo[];
}

/**
 * Refined Fallback UI for media access errors.
 * Includes loading state and support for multi-device environments.
 * Uses glassmorphism design consistent with project standards.
 */
export const MediaFallbackUI: React.FC<MediaFallbackUIProps> = ({
    error,
    isLoading,
    onRetry,
    devices = []
}) => {
    if (isLoading) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <h3 className="text-xl font-medium text-white">Đang kết nối...</h3>
                    <p className="text-white/60 text-sm">Vui lòng chờ trong khi hệ thống thiết lập thiết bị của bạn.</p>
                </div>
            </motion.div>
        );
    }

    if (!error) return null;

    const getErrorInfo = () => {
        switch (error) {
            case 'NotAllowedError':
                return {
                    title: 'Quyền truy cập bị từ chối',
                    description: 'Trình duyệt không có quyền truy cập Camera/Micro. Vui lòng kiểm tra cài đặt quyền ở thanh địa chỉ.',
                    icon: <ShieldAlert className="h-6 w-6 text-red-500" />
                };
            case 'NotFoundError':
                return {
                    title: 'Không tìm thấy thiết bị',
                    description: 'Không tìm thấy Camera hoặc Micro nào. Hãy đảm bảo chúng đã được cắm vào máy tính.',
                    icon: <CameraOff className="h-6 w-6 text-yellow-500" />
                };
            case 'NotReadableError':
                return {
                    title: 'Thiết bị đang bận',
                    description: 'Thiết bị đang được sử dụng bởi ứng dụng khác (vd: Zoom, Teams). Vui lòng đóng chúng.',
                    icon: <MicOff className="h-6 w-6 text-orange-500" />
                };
            case 'TypeError':
                return {
                    title: 'Trình duyệt không hỗ trợ',
                    description: 'Trình duyệt của bạn không hỗ trợ WebRTC. Hãy sử dụng Chrome, Firefox hoặc Edge mới nhất.',
                    icon: <AlertCircle className="h-6 w-6 text-red-500" />
                };
            default:
                return {
                    title: 'Lỗi thiết bị',
                    description: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại hoặc tải lại trang.',
                    icon: <AlertCircle className="h-6 w-6 text-gray-500" />
                };
        }
    };

    const info = getErrorInfo();

    return (
        <motion.div
            className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Alert className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl rounded-2xl p-6 overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                        {info.icon}
                    </div>
                    <div className="flex-1">
                        <AlertTitle className="text-xl font-semibold text-white mb-2">
                            {info.title}
                        </AlertTitle>
                        <AlertDescription className="text-white/70 text-sm leading-relaxed mb-6">
                            {info.description}
                        </AlertDescription>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={onRetry}
                                className="bg-primary hover:bg-primary/90 text-white font-medium px-6 rounded-lg transition-all active:scale-95"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Thử lại ngay
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 rounded-lg"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Cài đặt
                            </Button>
                        </div>
                    </div>
                </div>
            </Alert>
        </motion.div>
    );
};
