"use client";

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary component for the live teaching lobby.
 */
export class LobbyErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Lobby Error Boundary caught an error:', error, errorInfo);
    }

    resetError = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
        this.props.onReset?.();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="p-8 max-w-2xl mx-auto space-y-6">
                    <Alert variant="destructive" className="border-2">
                        <AlertTitle className="text-lg font-bold">Lỗi sảnh chờ</AlertTitle>
                        <AlertDescription className="mt-2">
                            Đã xảy ra lỗi không mong muốn khi tải sảnh chờ. Dữ liệu có thể không đồng bộ hoặc thành phần giao diện bị lỗi.
                        </AlertDescription>
                    </Alert>

                    {this.state.error && (
                        <div className="bg-muted p-4 rounded-lg overflow-auto max-h-40 text-xs">
                            <pre>{this.state.error.stack || this.state.error.message}</pre>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={this.resetError} className="flex-1 gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Thử lại
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/dashboard'} className="flex-1 gap-2">
                            <Home className="w-4 h-4" />
                            Quay về Dashboard
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
