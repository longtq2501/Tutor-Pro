"use client";

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component for the live room.
 * Catches runtime errors and displays a fallback UI with recovery options.
 */
export class RoomErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Room Error Boundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    resetError = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        this.props.onReset?.();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <RoomErrorFallback
                    error={this.state.error}
                    resetError={this.resetError}
                />
            );
        }

        return this.props.children;
    }
}

interface FallbackProps {
    error: Error | null;
    resetError: () => void;
}

const RoomErrorFallback: React.FC<FallbackProps> = ({ error, resetError }) => {
    const handleLeaveRoom = () => {
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 text-center">
                <div className="mb-6">
                    <div className="inline-flex p-4 bg-red-500/20 rounded-full">
                        <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">
                    Đã xảy ra lỗi
                </h2>

                <p className="text-white/70 text-sm mb-6">
                    Phòng học gặp sự cố không mong muốn. Bạn có thể thử lại hoặc rời phòng để quay lại sau.
                </p>

                {error && (
                    <details className="mb-6 text-left">
                        <summary className="text-white/50 text-xs cursor-pointer hover:text-white/70">
                            Chi tiết lỗi
                        </summary>
                        <pre className="mt-2 text-xs text-red-400 bg-black/20 p-3 rounded-lg overflow-auto max-h-32">
                            {error.message}
                        </pre>
                    </details>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={resetError}
                        className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all active:scale-95"
                    >
                        Thử lại
                    </button>

                    <button
                        onClick={handleLeaveRoom}
                        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all active:scale-95"
                    >
                        Rời phòng
                    </button>
                </div>
            </div>
        </div>
    );
};
