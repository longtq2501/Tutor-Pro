import React from 'react';
import { NavBar } from '@/features/landing/components/layout/NavBar';
import { LandingFooter } from '@/features/landing/components/layout/LandingFooter';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            <div style={{ flex: 1 }}>
                {children}
            </div>
            <LandingFooter />
        </div>
    );
}
