/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { TutorProLogo } from '@/components/shared/TutorProLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';

  useEffect(() => {
    // After registration we intentionally keep users on login screen,
    // even if a previous session still exists in memory/state.
    if (isRegistered) {
      return;
    }

    if (isAuthenticated && user) {
      router.push(user.role === 'ADMIN' ? '/overview' : '/dashboard');
    }
  }, [isAuthenticated, user, router, isRegistered]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect is handled in AuthContext
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistered && (
          <Alert className="bg-green-500/10 text-green-600 border-green-500/20 animate-in fade-in-50">
            <AlertDescription>Đăng ký thành công! Vui lòng đăng nhập.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="animate-in fade-in-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-[var(--ink)]">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-extrabold rounded-xl bg-[var(--acc)] text-[var(--bi)] hover:brightness-105 active:translate-y-0.5 shadow-md transition-all cursor-pointer border-none"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--line)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--tile)] px-3 text-[var(--mut)] font-semibold tracking-wider">Hoặc tiếp tục với</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 rounded-xl border border-[var(--line)] bg-[var(--tile)] text-[var(--ink)] hover:bg-[var(--tile2)] font-semibold shadow-xs transition-all"
        disabled={loading}
        onClick={() => {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          window.location.href = `${apiUrl.replace(/\/$/, '')}/oauth2/authorization/google`;
        }}
      >
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        </svg>
        Google
      </Button>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="landing-page min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--ink)] lp-grid-bg p-4 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background glow accents matching brand */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[var(--acc)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--brand)]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border border-[var(--line)] bg-[var(--tile)] rounded-2xl overflow-hidden backdrop-blur-md">
        <CardHeader className="space-y-3 text-center pb-4 pt-8">
          <div className="mx-auto w-14 h-14 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-2xl flex items-center justify-center shadow-xs">
            <TutorProLogo collapsed iconClassName="h-10 w-10" />
          </div>
          <div>
            <CardTitle className="text-3xl font-extrabold tracking-tight font-[family-name:var(--font-baloo-2)] text-[var(--ink)]">
              Tutor Pro
            </CardTitle>
            <CardDescription className="text-sm mt-1.5 text-[var(--mut)]">
              Đăng nhập vào hệ thống quản lý
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
              <p className="text-sm text-[var(--mut)] italic">Vui lòng chờ...</p>
            </div>
          }>
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <span className="text-[var(--mut)]">Chưa có tài khoản? </span>
            <Link href="/register" className="text-[var(--brand)] font-bold hover:underline transition-all">
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}