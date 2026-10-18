import React from 'react';
import Link from 'next/link';
import { FEATURES, FEATURE_GROUPS } from '../../config/features';

export function FeatureGrid() {
    return (
        <section className="landing-container" style={{ padding: '60px 22px 40px' }} aria-labelledby="all-features-heading">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
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
                        marginBottom: '12px',
                        border: '1px solid rgba(45, 212, 191, 0.25)',
                    }}
                >
                    Tất cả tính năng
                </span>
                <h2
                    id="all-features-heading"
                    style={{
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        lineHeight: 1.2,
                        marginBottom: '14px',
                    }}
                >
                    Hệ sinh thái 10 tính năng hoàn chỉnh
                </h2>
                <p style={{ color: 'var(--mut)', fontSize: '17px', lineHeight: 1.6 }}>
                    Được thiết kế tỉ mỉ xoay quanh công việc thực tế của gia sư, từ lúc nhận lớp đến khi gửi báo cáo học phí.
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                }}
            >
                {FEATURES.map((feat) => {
                    const IconComponent = feat.icon;
                    const groupInfo = FEATURE_GROUPS[feat.group];

                    return (
                        <Link
                            key={feat.slug}
                            href={`/features/${feat.slug}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                textDecoration: 'none',
                                background: 'var(--tile)',
                                border: '1px solid var(--line)',
                                borderRadius: '20px',
                                padding: '24px',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            className="group hover:border-[var(--brand)] hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'var(--tile2)',
                                        border: '1px solid var(--line)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--brand)',
                                    }}
                                >
                                    <IconComponent className="h-5 w-5" />
                                </div>
                                <span
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'var(--mut)',
                                        background: 'var(--tile2)',
                                        padding: '3px 10px',
                                        borderRadius: '999px',
                                    }}
                                >
                                    {groupInfo.label}
                                </span>
                            </div>

                            <h3
                                style={{
                                    fontSize: '19px',
                                    fontWeight: 800,
                                    color: 'var(--ink)',
                                    marginBottom: '8px',
                                    fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                }}
                                className="group-hover:text-[var(--brand)] transition-colors"
                            >
                                {feat.name}
                            </h3>

                            <p
                                style={{
                                    fontSize: '14.5px',
                                    color: 'var(--mut)',
                                    lineHeight: 1.5,
                                    marginBottom: '16px',
                                    flex: 1,
                                }}
                            >
                                {feat.desc}
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '13.5px',
                                    fontWeight: 700,
                                    color: 'var(--brand)',
                                    marginTop: 'auto',
                                }}
                            >
                                <span>Xem chi tiết</span>
                                <span aria-hidden="true" style={{ transition: 'transform 0.2s ease' }} className="group-hover:translate-x-1">→</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
