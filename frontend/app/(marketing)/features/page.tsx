import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FEATURES, FEATURE_GROUPS, FeatureGroup } from '@/features/landing/config/features';

export const metadata: Metadata = {
    title: 'Tất cả tính năng — Tutor Pro',
    description: 'Khám phá trọn bộ 10 tính năng của Tutor Pro: Lịch dạy, Lớp học, Học phí, Báo cáo học tập, Khảo thí và Quản lý học sinh.',
    openGraph: {
        title: 'Tất cả tính năng — Tutor Pro',
        description: 'Khám phá trọn bộ 10 tính năng của Tutor Pro: Lịch dạy, Lớp học, Học phí, Báo cáo học tập, Khảo thí và Quản lý học sinh.',
    },
};

const GROUPS_ORDER: FeatureGroup[] = ['teaching', 'assessment', 'operations', 'academics'];

export default function FeaturesHubPage() {
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
                        Tính năng
                    </li>
                </ol>
            </nav>

            {/* Hub Header */}
            <header style={{ maxWidth: '780px', marginBottom: '56px' }}>
                <span
                    style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        borderRadius: '999px',
                        background: 'rgba(45, 212, 191, 0.12)',
                        color: 'var(--brand)',
                        fontSize: '13px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                        marginBottom: '16px',
                        border: '1px solid rgba(45, 212, 191, 0.25)',
                    }}
                >
                    Hệ sinh thái Tutor Pro
                </span>
                <h1
                    style={{
                        fontSize: 'clamp(32px, 5vw, 54px)',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        lineHeight: 1.15,
                        marginBottom: '18px',
                    }}
                >
                    Tính năng được thiết kế cho từng phút đứng lớp
                </h1>
                <p style={{ color: 'var(--mut)', fontSize: '18px', lineHeight: 1.6 }}>
                    Tổng hợp 10 module nghiệp vụ cốt lõi giúp gia sư 1-1 và lớp nhóm tinh gọn quy trình, nâng cao chất lượng sư phạm và tạo uy tín vững chắc với phụ huynh.
                </p>
            </header>

            {/* Feature Groups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                {GROUPS_ORDER.map((grpKey) => {
                    const groupInfo = FEATURE_GROUPS[grpKey];
                    const groupFeatures = FEATURES.filter((f) => f.group === grpKey);

                    return (
                        <section key={grpKey} aria-labelledby={`group-${grpKey}`}>
                            <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '28px' }}>
                                <h2
                                    id={`group-${grpKey}`}
                                    style={{
                                        fontSize: '26px',
                                        fontWeight: 800,
                                        color: 'var(--ink)',
                                        marginBottom: '6px',
                                        fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                    }}
                                >
                                    {groupInfo.label}
                                </h2>
                                <p style={{ color: 'var(--mut)', fontSize: '15px', margin: 0 }}>
                                    {groupInfo.description}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: '24px',
                                }}
                            >
                                {groupFeatures.map((feat) => {
                                    const IconComponent = feat.icon;

                                    return (
                                        <article
                                            key={feat.slug}
                                            style={{
                                                background: 'var(--tile)',
                                                border: '1px solid var(--line)',
                                                borderRadius: '24px',
                                                padding: '28px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'all 0.2s ease',
                                                position: 'relative',
                                            }}
                                            className="hover:border-[var(--brand)] hover:shadow-xl transition-all"
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                                                <div
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '14px',
                                                        background: 'var(--tile2)',
                                                        border: '1px solid var(--line)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--brand)',
                                                    }}
                                                >
                                                    <IconComponent className="h-6 w-6" />
                                                </div>

                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: 'var(--mut)',
                                                        background: 'var(--tile2)',
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                    }}
                                                >
                                                    {feat.type === 'action' ? 'Thao tác' : feat.type === 'view' ? 'Theo dõi' : 'Hỗn hợp'}
                                                </span>
                                            </div>

                                            <h3
                                                style={{
                                                    fontSize: '22px',
                                                    fontWeight: 800,
                                                    color: 'var(--ink)',
                                                    marginBottom: '8px',
                                                    fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                                }}
                                            >
                                                {feat.name}
                                            </h3>

                                            <p
                                                style={{
                                                    fontSize: '14.5px',
                                                    fontWeight: 600,
                                                    color: 'var(--ink)',
                                                    marginBottom: '10px',
                                                    opacity: 0.9,
                                                }}
                                            >
                                                {feat.tagline}
                                            </p>

                                            <p
                                                style={{
                                                    fontSize: '14px',
                                                    color: 'var(--mut)',
                                                    lineHeight: 1.55,
                                                    marginBottom: '20px',
                                                    flex: 1,
                                                }}
                                            >
                                                {feat.desc}
                                            </p>

                                            <div style={{ marginBottom: '24px' }}>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {feat.keyBenefits.slice(0, 2).map((benefit, bIdx) => (
                                                        <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--mut)' }}>
                                                            <span style={{ color: 'var(--brand)', fontWeight: 800 }}>✓</span>
                                                            <span>{benefit}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <Link
                                                href={`/features/${feat.slug}`}
                                                className="lp-btn lp-btn-ghost"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    fontSize: '14px',
                                                    padding: '10px 18px',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>Xem chi tiết tính năng</span>
                                                <span aria-hidden="true">→</span>
                                            </Link>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Bottom CTA */}
            <div className="lp-cta-block" style={{ marginTop: '80px' }}>
                <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '10px' }}>
                    Sẵn sàng trải nghiệm trọn bộ tính năng?
                </h2>
                <p style={{ color: 'var(--mut)', fontSize: '16px', marginBottom: '24px' }}>
                    Tạo tài khoản gia sư trong 30 giây, hoàn toàn miễn phí.
                </p>
                <Link href="/register" className="lp-btn lp-btn-primary">
                    Dùng thử miễn phí
                </Link>
            </div>
        </main>
    );
}
