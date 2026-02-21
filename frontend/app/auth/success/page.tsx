'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function AuthSuccessHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            loginWithToken(token).catch(() => {
                router.push('/login?error=oauth_failed');
            });
        } else {
            router.push('/login');
        }
    }, [searchParams, loginWithToken, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h1 className="text-xl font-medium">Đang xác thực...</h1>
            <p className="text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
        </div>
    );
}

export default function AuthSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <AuthSuccessHandler />
        </Suspense>
    );
}
