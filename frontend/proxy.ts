import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get cookies
    const userRole = request.cookies.get('userRole')?.value;
    const accessToken = request.cookies.get('accessToken')?.value;

    // Define route types
    const isAdminRoute = pathname.startsWith('/overview') ||
        pathname.startsWith('/tutors') ||
        pathname.startsWith('/students') ||
        pathname.startsWith('/sessions') ||
        pathname.startsWith('/documents') ||
        pathname.startsWith('/system');

    const isTutorRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/exercises') ||
        pathname.startsWith('/learning') ||
        pathname.startsWith('/live-teaching') ||
        pathname.startsWith('/profile');

    // Logic: 
    // 1. If hitting admin route and not ADMIN -> redirect to dashboard
    if (isAdminRoute && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 2. If hitting tutor/admin route and not logged in -> redirect to login
    if ((isAdminRoute || isTutorRoute) && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const proxyConfig = {
    matcher: [
        '/dashboard/:path*',
        '/exercises/:path*',
        '/learning/:path*',
        '/live-teaching/:path*',
        '/profile/:path*',
        '/overview/:path*',
        '/tutors/:path*',
        '/students/:path*',
        '/sessions/:path*',
        '/documents/:path*',
        '/system/:path*'
    ],
};
