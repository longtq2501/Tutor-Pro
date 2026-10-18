'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { FEATURES, FEATURE_GROUPS, FeatureGroup } from '../../config/features';

interface FeaturesDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const GROUPS_ORDER: FeatureGroup[] = ['teaching', 'assessment', 'operations', 'academics'];

export function FeaturesDropdown({ isOpen, onClose }: FeaturesDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Keyboard navigation: Esc closes dropdown
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="lp-features-dropdown"
            role="menu"
            aria-label="Danh sách tính năng Tutor Pro"
            style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(94vw, 920px)',
                background: 'var(--tile)',
                border: '1px solid var(--line)',
                borderRadius: '24px',
                padding: '24px 28px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                zIndex: 100,
                animation: 'lpFadeIn 0.2s ease',
            }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '24px',
                }}
            >
                {GROUPS_ORDER.map((grpKey) => {
                    const groupInfo = FEATURE_GROUPS[grpKey];
                    const groupFeatures = FEATURES.filter((f) => f.group === grpKey);

                    return (
                        <div key={grpKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--brand)',
                                    marginBottom: '4px',
                                    fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                }}
                            >
                                {groupInfo.label}
                            </div>

                            {groupFeatures.map((feat) => {
                                const IconComponent = feat.icon;
                                const isAction = feat.type === 'action';
                                const typeLabel = isAction ? 'Thao tác' : feat.type === 'view' ? 'Theo dõi' : 'Tổng hợp';

                                return (
                                    <Link
                                        key={feat.slug}
                                        href={`/features/${feat.slug}`}
                                        onClick={onClose}
                                        role="menuitem"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            padding: '10px 12px',
                                            borderRadius: '14px',
                                            textDecoration: 'none',
                                            transition: 'background 0.15s ease',
                                        }}
                                        className="hover:bg-[var(--tile2)] group"
                                    >
                                        <div
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: 'var(--tile2)',
                                                border: '1px solid var(--line)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--brand)',
                                                flexShrink: 0,
                                                marginTop: '2px',
                                            }}
                                            className="group-hover:border-[var(--brand)] transition-colors"
                                        >
                                            <IconComponent className="h-4 w-4" />
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                <span
                                                    style={{
                                                        fontSize: '14.5px',
                                                        fontWeight: 700,
                                                        color: 'var(--ink)',
                                                    }}
                                                    className="group-hover:text-[var(--brand)] transition-colors"
                                                >
                                                    {feat.name}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '10px',
                                                        padding: '1px 6px',
                                                        borderRadius: '999px',
                                                        background: 'var(--tile2)',
                                                        color: 'var(--mut)',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {typeLabel}
                                                </span>
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: '12.5px',
                                                    color: 'var(--mut)',
                                                    lineHeight: 1.35,
                                                    margin: 0,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {feat.desc}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Dropdown footer banner */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--line)',
                    fontSize: '13.5px',
                }}
            >
                <span style={{ color: 'var(--mut)' }}>
                    Khám phá toàn bộ hệ thống tính năng chuyên sâu cho gia sư.
                </span>
                <Link
                    href="/features"
                    onClick={onClose}
                    style={{
                        color: 'var(--brand)',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    className="hover:underline"
                >
                    <span>Xem trang tổng hợp tính năng</span>
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
    );
}
