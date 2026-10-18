import React from 'react';
import Link from 'next/link';

export default function MarketingNotFound() {
    return (
        <main className="landing-container" style={{ padding: '80px 22px 100px', textAlign: 'center' }}>
            <div
                style={{
                    maxWidth: '560px',
                    margin: '0 auto',
                    background: 'var(--tile)',
                    border: '1px solid var(--line)',
                    borderRadius: '28px',
                    padding: '48px 32px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
            >
                <span
                    style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        borderRadius: '999px',
                        background: 'rgba(251, 113, 133, 0.15)',
                        color: 'var(--red)',
                        fontSize: '13px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                        marginBottom: '16px',
                        border: '1px solid rgba(251, 113, 133, 0.3)',
                    }}
                >
                    404 — Không tìm thấy
                </span>

                <h1
                    style={{
                        fontSize: 'clamp(28px, 4vw, 38px)',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        lineHeight: 1.2,
                        marginBottom: '14px',
                        fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                    }}
                >
                    Trang bạn tìm không tồn tại
                </h1>

                <p style={{ color: 'var(--mut)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                    Đường dẫn có thể đã thay đổi hoặc không còn khả dụng. Bạn có thể quay lại trang chủ hoặc khám phá danh mục tính năng của Tutor Pro.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <Link href="/" className="lp-btn lp-btn-primary">
                        Về trang chủ
                    </Link>
                    <Link href="/features" className="lp-btn lp-btn-ghost">
                        Khám phá tính năng
                    </Link>
                </div>
            </div>
        </main>
    );
}
