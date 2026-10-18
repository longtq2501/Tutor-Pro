import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Bảng giá — Tutor Pro',
    description: 'Chính sách giá và gói dịch vụ của nền tảng quản lý gia sư Tutor Pro. Miễn phí trải nghiệm trong giai đoạn phát triển.',
    openGraph: {
        title: 'Bảng giá — Tutor Pro',
        description: 'Chính sách giá và gói dịch vụ của nền tảng quản lý gia sư Tutor Pro. Miễn phí trải nghiệm trong giai đoạn phát triển.',
    },
};

export default function PricingPage() {
    return (
        <main className="landing-container" style={{ padding: '40px 22px 80px' }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
                <ol
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        fontSize: '14px',
                        color: 'var(--mut)',
                    }}
                >
                    <li>
                        <Link href="/" style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:text-[var(--brand)] transition-colors">
                            Trang chủ
                        </Link>
                    </li>
                    <li aria-hidden="true" style={{ opacity: 0.6 }}>/</li>
                    <li style={{ color: 'var(--ink)', fontWeight: 700 }}>
                        Bảng giá
                    </li>
                </ol>
            </nav>

            <div
                style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    background: 'var(--tile)',
                    border: '1px solid var(--line)',
                    borderRadius: '32px',
                    padding: 'clamp(28px, 5vw, 56px)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                }}
            >
                <span
                    style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        borderRadius: '999px',
                        background: 'rgba(251, 191, 36, 0.15)',
                        color: 'var(--acc)',
                        fontSize: '13px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                        marginBottom: '16px',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                >
                    Giai đoạn phát triển
                </span>

                <h1
                    style={{
                        fontSize: 'clamp(32px, 5vw, 46px)',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        lineHeight: 1.15,
                        marginBottom: '16px',
                    }}
                >
                    Bảng giá đang cập nhật
                </h1>

                <p
                    style={{
                        color: 'var(--mut)',
                        fontSize: '16.5px',
                        lineHeight: 1.6,
                        marginBottom: '36px',
                    }}
                >
                    Tutor Pro hiện tại đang hoạt động theo mô hình <strong style={{ color: 'var(--ink)' }}>hoàn toàn miễn phí</strong>. Mọi gia sư đều có thể đăng ký và sử dụng toàn bộ tính năng mà không bị giới hạn số lượng học sinh hay buổi dạy. Bảng giá chi tiết cho các gói mở rộng sẽ được công bố sớm.
                </p>

                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        background: 'var(--tile2)',
                        border: '1px solid var(--line)',
                        borderRadius: '20px',
                        padding: '24px',
                    }}
                    action="#"
                    method="post"
                >
                    <label
                        htmlFor="pricing-email"
                        style={{
                            fontSize: '14.5px',
                            fontWeight: 700,
                            color: 'var(--ink)',
                        }}
                    >
                        Đăng ký nhận thông báo khi có biểu phí chính thức
                    </label>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <input
                            id="pricing-email"
                            name="email"
                            type="email"
                            required
                            placeholder="email@example.com"
                            style={{
                                flex: 1,
                                minWidth: '220px',
                                background: 'var(--tile)',
                                border: '1px solid var(--line)',
                                borderRadius: '999px',
                                padding: '12px 20px',
                                color: 'var(--ink)',
                                fontSize: '15px',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            className="lp-btn lp-btn-primary"
                            style={{ cursor: 'pointer' }}
                        >
                            Nhận thông báo
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--mut)' }}>
                        Đã sẵn sàng dùng thử miễn phí ngay?
                    </span>
                    <Link
                        href="/register"
                        style={{
                            color: 'var(--brand)',
                            fontWeight: 700,
                            fontSize: '15px',
                            textDecoration: 'none',
                        }}
                        className="hover:underline"
                    >
                        Tạo tài khoản gia sư →
                    </Link>
                </div>
            </div>
        </main>
    );
}
