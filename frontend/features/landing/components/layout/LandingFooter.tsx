import React from 'react';
import Link from 'next/link';
import { TutorProLogo } from '@/components/shared/TutorProLogo';
import { FEATURES } from '../../config/features';

export function LandingFooter() {
    const year = typeof Date !== 'undefined' ? new Date().getFullYear() : 2026;

    return (
        <footer className="lp-footer" aria-label="Chân trang">
            <div className="landing-container">
                <div className="lp-footer-inner" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px', paddingBottom: '32px' }}>
                    {/* Brand column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '320px' }}>
                        <Link href="/" aria-label="Trang chủ Tutor Pro" style={{ display: 'inline-flex' }}>
                            <TutorProLogo iconClassName="h-8 w-8" />
                        </Link>
                        <p style={{ fontSize: '14px', color: 'var(--mut)', lineHeight: '1.6', margin: 0 }}>
                            Kiến tạo tương lai giáo dục 1-1 tại Việt Nam bằng công nghệ và trí tuệ nhân tạo.
                        </p>
                    </div>

                    {/* Features column 1: Giảng dạy & Đánh giá */}
                    <div>
                        <div
                            style={{
                                fontWeight: 800,
                                fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                color: 'var(--ink)',
                                marginBottom: '14px',
                                fontSize: '15px',
                            }}
                        >
                            Giảng dạy &amp; Đánh giá
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                            {FEATURES.filter((f) => f.group === 'teaching' || f.group === 'assessment').map((feat) => (
                                <li key={feat.slug}>
                                    <Link href={`/features/${feat.slug}`} style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:text-[var(--brand)] transition-colors">
                                        {feat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Features column 2: Vận hành & Học vụ */}
                    <div>
                        <div
                            style={{
                                fontWeight: 800,
                                fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                color: 'var(--ink)',
                                marginBottom: '14px',
                                fontSize: '15px',
                            }}
                        >
                            Vận hành &amp; Học vụ
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                            {FEATURES.filter((f) => f.group === 'operations' || f.group === 'academics').map((feat) => (
                                <li key={feat.slug}>
                                    <Link href={`/features/${feat.slug}`} style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:text-[var(--brand)] transition-colors">
                                        {feat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation column */}
                    <div>
                        <div
                            style={{
                                fontWeight: 800,
                                fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                color: 'var(--ink)',
                                marginBottom: '14px',
                                fontSize: '15px',
                            }}
                        >
                            Nền tảng
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                            <li>
                                <Link href="/features" style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:text-[var(--brand)] transition-colors">
                                    Tất cả tính năng
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:text-[var(--brand)] transition-colors">
                                    Bảng giá
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/longtq2501/Tutor-Pro"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: 'var(--mut)', textDecoration: 'none' }}
                                    className="hover:text-[var(--brand)] transition-colors"
                                >
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Subfooter */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: '12px',
                        alignItems: 'center',
                        paddingTop: '24px',
                        marginTop: '20px',
                        borderTop: '1px solid var(--line)',
                        fontSize: '12.5px',
                        letterSpacing: '0.04em',
                        color: 'var(--mut)',
                    }}
                >
                    <p style={{ margin: 0 }}>© {year} TUTOR PRO VIETNAM. ALL RIGHTS RESERVED.</p>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <Link href="/pricing" style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:underline">
                            Chính sách
                        </Link>
                        <Link href="/pricing" style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:underline">
                            Điều khoản dịch vụ
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
