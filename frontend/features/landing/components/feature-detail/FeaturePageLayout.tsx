import React from 'react';
import Link from 'next/link';
import { FeatureConfig, FEATURE_GROUPS, getRelatedFeatures } from '../../config/features';
import Script from 'next/script';

interface FeaturePageLayoutProps {
    feature: FeatureConfig;
    children?: React.ReactNode;
}

export function FeaturePageLayout({ feature, children }: FeaturePageLayoutProps) {
    const groupInfo = FEATURE_GROUPS[feature.group];
    const relatedFeatures = getRelatedFeatures(feature.slug);
    const IconComponent = feature.icon;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Trang chủ',
                item: 'https://tutorpro.id.vn',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Tính năng',
                item: 'https://tutorpro.id.vn/features',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: feature.name,
                item: `https://tutorpro.id.vn/features/${feature.slug}`,
            },
        ],
    };

    return (
        <article className="landing-container" style={{ padding: '36px 22px 80px' }}>
            <Script
                id={`breadcrumb-jsonld-${feature.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
                <ol
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
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
                    <li>
                        <Link href="/features" style={{ color: 'var(--mut)', textDecoration: 'none' }} className="hover:text-[var(--brand)] transition-colors">
                            Tính năng
                        </Link>
                    </li>
                    <li aria-hidden="true" style={{ opacity: 0.6 }}>/</li>
                    <li style={{ color: 'var(--ink)', fontWeight: 700 }}>
                        {feature.name}
                    </li>
                </ol>
            </nav>

            {/* Feature Hero Header */}
            <header style={{ marginBottom: '56px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '40px',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 12px',
                                    borderRadius: '999px',
                                    background: 'rgba(45, 212, 191, 0.12)',
                                    color: 'var(--brand)',
                                    fontSize: '12.5px',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                    border: '1px solid rgba(45, 212, 191, 0.25)',
                                }}
                            >
                                {groupInfo.label}
                            </span>
                            <span
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--mut)',
                                    background: 'var(--tile)',
                                    border: '1px solid var(--line)',
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    fontWeight: 600,
                                }}
                            >
                                {feature.type === 'action' ? 'Thao tác nghiệp vụ' : feature.type === 'view' ? 'Theo dõi tổng quan' : 'Thao tác & Tổng hợp'}
                            </span>
                        </div>

                        <h1
                            style={{
                                fontSize: 'clamp(32px, 5vw, 48px)',
                                fontWeight: 800,
                                color: 'var(--ink)',
                                lineHeight: 1.15,
                                marginBottom: '16px',
                            }}
                        >
                            {feature.name}
                        </h1>

                        <p
                            style={{
                                fontSize: 'clamp(17px, 2.5vw, 20px)',
                                color: 'var(--ink)',
                                fontWeight: 700,
                                lineHeight: 1.45,
                                marginBottom: '14px',
                            }}
                        >
                            {feature.tagline}
                        </p>

                        <p
                            style={{
                                fontSize: '16px',
                                color: 'var(--mut)',
                                lineHeight: 1.6,
                                marginBottom: '28px',
                                maxWidth: '540px',
                            }}
                        >
                            {feature.desc}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                            <Link
                                href="/register"
                                className="lp-btn lp-btn-primary"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span>Trải nghiệm ngay</span>
                                <span aria-hidden="true">→</span>
                            </Link>
                            <Link
                                href="/features"
                                className="lp-btn lp-btn-ghost"
                            >
                                Tất cả tính năng
                            </Link>
                        </div>
                    </div>

                    {/* Static Visual Representation */}
                    <div
                        style={{
                            background: 'var(--tile)',
                            border: '1px solid var(--line)',
                            borderRadius: '26px',
                            padding: '36px 32px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '20px',
                                background: 'var(--tile2)',
                                border: '1px solid var(--line)',
                                display: 'flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                                justifyContent: 'center',
                                color: 'var(--brand)',
                                marginBottom: '20px',
                            }}
                        >
                            <IconComponent className="h-9 w-9" />
                        </div>

                        <h3
                            style={{
                                fontSize: '20px',
                                fontWeight: 800,
                                color: 'var(--ink)',
                                marginBottom: '10px',
                                fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                            }}
                        >
                            {feature.name} trong quy trình dạy học
                        </h3>

                        <p style={{ color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5, maxWidth: '340px', marginBottom: '24px' }}>
                            {feature.tagline}
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                width: '100%',
                                maxWidth: '360px',
                                textAlign: 'left',
                            }}
                        >
                            {feature.keyBenefits.map((benefit, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        background: 'var(--tile2)',
                                        padding: '10px 14px',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        color: 'var(--ink)',
                                        border: '1px solid var(--line)',
                                    }}
                                >
                                    <span style={{ color: 'var(--brand)', fontWeight: 800 }}>✓</span>
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <p className="lp-visual-caption" style={{ marginTop: '20px', marginBottom: 0 }}>
                            Hình minh họa
                        </p>
                    </div>
                </div>
            </header>

            {/* System Meaning Block */}
            <section
                style={{
                    background: 'var(--tile)',
                    border: '1px solid var(--line)',
                    borderRadius: '26px',
                    padding: '36px 32px',
                    marginBottom: '40px',
                }}
                aria-labelledby="meaning-heading"
            >
                <div style={{ maxWidth: '800px' }}>
                    <h2
                        id="meaning-heading"
                        style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            color: 'var(--ink)',
                            marginBottom: '12px',
                            fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                        }}
                    >
                        Ý nghĩa của {feature.name} trong hệ thống
                    </h2>
                    <p style={{ color: 'var(--mut)', fontSize: '16.5px', lineHeight: 1.65, marginBottom: '24px' }}>
                        {feature.systemMeaning}
                    </p>

                    <h3
                        style={{
                            fontSize: '17px',
                            fontWeight: 700,
                            color: 'var(--ink)',
                            marginBottom: '12px',
                        }}
                    >
                        Lợi ích then chốt:
                    </h3>
                    <ul className="lp-ticks" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {feature.keyBenefits.map((b, i) => (
                            <li key={i} style={{ marginBottom: '8px' }}>
                                <span className="lp-tick-mark" aria-hidden="true">✓</span>
                                <span style={{ color: 'var(--ink)', fontSize: '15px' }}>{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Action Guide Slot (if type is action or mixed) */}
            {(feature.type === 'action' || feature.type === 'mixed') && feature.actionGuideSteps && (
                <section
                    style={{
                        background: 'var(--tile)',
                        border: '1px solid var(--line)',
                        borderRadius: '26px',
                        padding: '36px 32px',
                        marginBottom: '40px',
                    }}
                    aria-labelledby="guide-heading"
                >
                    <h2
                        id="guide-heading"
                        style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            color: 'var(--ink)',
                            marginBottom: '20px',
                            fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                        }}
                    >
                        {feature.actionGuideTitle || 'Hướng dẫn thao tác nhanh'}
                    </h2>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '18px',
                        }}
                    >
                        {feature.actionGuideSteps.map((step, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: 'var(--tile2)',
                                    border: '1px solid var(--line)',
                                    borderRadius: '18px',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '999px',
                                        background: 'var(--acc)',
                                        color: 'var(--bi)',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                    }}
                                >
                                    {idx + 1}
                                </div>
                                <p style={{ margin: 0, color: 'var(--ink)', fontSize: '15px', lineHeight: 1.5, fontWeight: 600 }}>
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Custom Content Slot */}
            {children && (
                <section style={{ marginBottom: '48px' }}>
                    {children}
                </section>
            )}

            {/* Related Features */}
            {relatedFeatures.length > 0 && (
                <section style={{ marginBottom: '56px' }} aria-labelledby="related-heading">
                    <h2
                        id="related-heading"
                        style={{
                            fontSize: '22px',
                            fontWeight: 800,
                            color: 'var(--ink)',
                            marginBottom: '20px',
                            fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                        }}
                    >
                        Tính năng liên kết trong luồng dạy học
                    </h2>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        {relatedFeatures.map((rel) => {
                            const RelIcon = rel.icon;
                            return (
                                <Link
                                    key={rel.slug}
                                    href={`/features/${rel.slug}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        background: 'var(--tile)',
                                        border: '1px solid var(--line)',
                                        borderRadius: '18px',
                                        padding: '16px 20px',
                                        textDecoration: 'none',
                                    }}
                                    className="hover:border-[var(--brand)] transition-colors group"
                                >
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'var(--tile2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--brand)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <RelIcon className="h-5 w-5" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '15px' }} className="group-hover:text-[var(--brand)] transition-colors">
                                            {rel.name}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--mut)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {rel.tagline}
                                        </div>
                                    </div>
                                    <span style={{ color: 'var(--brand)', fontSize: '16px' }}>→</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Bottom Final CTA */}
            <section className="lp-cta-block" style={{ marginTop: '32px' }}>
                <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '10px' }}>
                    Bắt đầu với {feature.name} ngay hôm nay
                </h2>
                <p style={{ color: 'var(--mut)', fontSize: '16px', marginBottom: '24px' }}>
                    Tutor Pro miễn phí trải nghiệm với đầy đủ tính năng.
                </p>
                <Link
                    href="/register"
                    className="lp-btn lp-btn-primary"
                >
                    Dùng thử miễn phí
                </Link>
            </section>
        </article>
    );
}
