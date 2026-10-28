'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { TutorProLogo } from '@/components/shared/TutorProLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/services';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register({ email, password, fullName, role: 'TUTOR' });

            // If there is an existing session, clear it so login page does not auto-redirect
            // back to the previously authenticated account.
            if (isAuthenticated) {
                await logout();
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }

            router.replace('/login?registered=true');
        } catch (err: unknown) {
            const errorResponse = err as { response?: { data?: { message?: string; data?: Record<string, string> } } };
            console.error('Registration error details:', errorResponse.response?.data);
            const errorData = errorResponse.response?.data;
            let message = errorData?.message || 'Đăng ký thất bại. Vui lòng thử lại.';

            // Handle validation errors (Map of field -> message)
            if (errorData?.data && typeof errorData.data === 'object') {
                const validationErrors = Object.values(errorData.data).join(', ');
                if (validationErrors) message = `${message}: ${validationErrors}`;
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        window.location.href = `${apiUrl.replace(/\/$/, '')}/oauth2/authorization/google?role=TUTOR`;
    };

    return (
        <div className="landing-page min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--ink)] lp-grid-bg p-4 relative overflow-hidden transition-colors duration-300">
            {/* Ambient background glow accents matching brand */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[var(--acc)]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--brand)]/15 rounded-full blur-3xl pointer-events-none" />
            </div>

            <Card className="w-full max-w-md relative z-10 shadow-2xl border border-[var(--line)] bg-[var(--tile)] rounded-2xl overflow-hidden backdrop-blur-md">
                <CardHeader className="space-y-3 text-center pb-2 pt-8">
                    <div className="mx-auto w-14 h-14 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-2xl flex items-center justify-center shadow-xs">
                        <TutorProLogo collapsed iconClassName="h-10 w-10" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight font-[family-name:var(--font-baloo-2)] text-[var(--ink)]">
                            Trở thành Gia sư
                        </CardTitle>
                        <CardDescription className="text-sm mt-1.5 text-[var(--mut)]">
                            Quản lý lớp học và học sinh hiệu quả hơn với Tutor Pro
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 px-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="animate-in fade-in-50">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-semibold text-[var(--ink)]">Họ và tên</Label>
                            <Input
                                id="fullName"
                                placeholder="Nguyễn Văn A"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                disabled={loading}
                                className="h-11 rounded-xl bg-[var(--tile)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--mut)]/60 focus-visible:ring-[var(--brand)] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-[var(--ink)]">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="h-11 rounded-xl bg-[var(--tile)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--mut)]/60 focus-visible:ring-[var(--brand)] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-[var(--ink)]">Mật khẩu</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="h-11 pr-10 rounded-xl bg-[var(--tile)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--mut)]/60 focus-visible:ring-[var(--brand)] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mut)] hover:text-[var(--ink)] transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-extrabold rounded-xl bg-[var(--acc)] text-[var(--bi)] hover:brightness-105 active:translate-y-0.5 shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                <>
                                    <span>Đăng ký ngay</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[var(--line)]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[var(--tile)] px-3 text-[var(--mut)] font-semibold tracking-wider">Hoặc</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl border border-[var(--line)] bg-[var(--tile)] text-[var(--ink)] hover:bg-[var(--tile2)] font-semibold shadow-xs transition-all flex items-center justify-center gap-3"
                        disabled={loading}
                        onClick={handleGoogleSignUp}
                    >
                        <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        <span>Đăng ký Gia sư với Google</span>
                    </Button>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-[var(--mut)]">Đã có tài khoản? </span>
                        <Link href="/login" className="text-[var(--brand)] font-bold hover:underline transition-all">
                            Đăng nhập
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
