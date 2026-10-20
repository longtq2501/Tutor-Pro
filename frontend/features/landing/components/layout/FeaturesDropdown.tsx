'use client';

import React from 'react';
import Link from 'next/link';
import { FEATURES, FEATURE_GROUPS, FEATURE_GROUP_ORDER, FeatureType } from '../../config/features';

export const FEATURES_DROPDOWN_ID = 'lp-features-panel';

const TYPE_LABELS: Record<FeatureType, string> = {
    action: 'Thao tác',
    view: 'Theo dõi',
    mixed: 'Tổng hợp',
};

interface FeaturesDropdownProps {
    /** id để trigger gắn với panel qua aria-controls */
    id?: string;
    isOpen: boolean;
    onClose: () => void;
    /** Giữ menu mở khi rê chuột vào panel (chống tắt nháy) */
    onPanelPointerEnter?: (event: React.PointerEvent) => void;
    onPanelPointerLeave?: (event: React.PointerEvent) => void;
}

/**
 * Mega menu "Tính năng".
 * Luôn nằm trong DOM, trạng thái mở/đóng điều khiển bằng `data-open`
 * để có chuyển động mượt (không dùng render có điều kiện hay display: none).
 */
export function FeaturesDropdown({
    id = FEATURES_DROPDOWN_ID,
    isOpen,
    onClose,
    onPanelPointerEnter,
    onPanelPointerLeave,
}: FeaturesDropdownProps) {
    return (
        <div
            id={id}
            className="lp-mega"
            data-open={isOpen ? 'true' : 'false'}
            onPointerEnter={onPanelPointerEnter}
            onPointerLeave={onPanelPointerLeave}
        >
            <div className="lp-mega-grid">
                {FEATURE_GROUP_ORDER.map((groupKey) => {
                    const groupInfo = FEATURE_GROUPS[groupKey];
                    const groupFeatures = FEATURES.filter((feature) => feature.group === groupKey);

                    return (
                        <div key={groupKey} className="lp-mega-group" role="group" aria-label={groupInfo.label}>
                            <div className="lp-mega-group-label">{groupInfo.label}</div>

                            {groupFeatures.map((feature) => {
                                const IconComponent = feature.icon;

                                return (
                                    <Link
                                        key={feature.slug}
                                        href={`/features/${feature.slug}`}
                                        className="lp-mega-item"
                                        onClick={onClose}
                                    >
                                        <span className="lp-mega-item-head">
                                            <span className="lp-mega-item-icon" aria-hidden="true">
                                                <IconComponent className="h-4 w-4" />
                                            </span>
                                            <span className="lp-mega-item-name">{feature.name}</span>
                                            <span className="lp-mega-item-type">{TYPE_LABELS[feature.type]}</span>
                                        </span>
                                        <p className="lp-mega-item-desc">{feature.desc}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="lp-mega-footer">
                <span className="lp-mega-footer-text">
                    Khám phá toàn bộ hệ thống tính năng chuyên sâu cho gia sư.
                </span>
                <Link href="/features" className="lp-mega-footer-link" onClick={onClose}>
                    <span>Xem trang tổng hợp tính năng</span>
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
    );
}
