'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TutorProLogo } from '@/components/shared/TutorProLogo';
import { FeaturesDropdown, FEATURES_DROPDOWN_ID } from './FeaturesDropdown';
import { FEATURES, FEATURE_GROUPS, FEATURE_GROUP_ORDER } from '../../config/features';
import { Menu, X, ChevronDown } from 'lucide-react';

export function NavBar() {
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    }

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Keyboard: Esc đóng dropdown và trả focus về nút "Tính năng"
    useEffect(() => {
        if (!dropdownOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;

            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
            }
            setDropdownOpen(false);
            triggerRef.current?.focus();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [dropdownOpen]);

    const clearCloseTimeout = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    // Chống tắt nháy: rời chuột thì chờ 150ms mới đóng, quay lại kịp thì hủy
    const scheduleCloseDropdown = () => {
        clearCloseTimeout();
        closeTimeoutRef.current = setTimeout(() => {
            setDropdownOpen(false);
        }, 150);
    };

    // Chỉ mở/đóng bằng rê chuột với chuột thật; cảm ứng dùng bấm để bật tắt
    const handlePointerEnter = (event: React.PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        clearCloseTimeout();
        setDropdownOpen(true);
    };

    const handlePointerLeave = (event: React.PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        scheduleCloseDropdown();
    };

    const handleTriggerClick = () => {
        clearCloseTimeout();
        setDropdownOpen((open) => !open);
    };

    const handleDropdownClose = () => {
        clearCloseTimeout();
        setDropdownOpen(false);
    };

    return (
        <nav
            ref={navRef}
            className="lp-nav"
            role="navigation"
            aria-label="Điều hướng chính"
            style={{ position: 'sticky', top: 0, zIndex: 90 }}
        >
            <div className="landing-container lp-nav-inner" style={{ position: 'relative' }}>
                <Link
                    href="/"
                    aria-label="Về trang chủ Tutor Pro"
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                    <TutorProLogo iconClassName="h-9 w-9" />
                </Link>

                {/* Desktop Nav Links — display do CSS quyết định để ẩn được dưới 861px */}
                <div className="lp-nav-links">
                    {/* Features Dropdown Trigger */}
                    <div
                        className="lp-mega-anchor"
                        onPointerEnter={handlePointerEnter}
                        onPointerLeave={handlePointerLeave}
                    >
                        <button
                            ref={triggerRef}
                            type="button"
                            className="lp-nav-link lp-mega-trigger"
                            aria-expanded={dropdownOpen}
                            aria-controls={FEATURES_DROPDOWN_ID}
                            onClick={handleTriggerClick}
                        >
                            <span>Tính năng</span>
                            <ChevronDown
                                aria-hidden="true"
                                className="h-4 w-4 lp-mega-chevron"
                                data-open={dropdownOpen ? 'true' : 'false'}
                            />
                        </button>
                    </div>

                    <Link href="/pricing" className="lp-nav-link">
                        Bảng giá
                    </Link>
                </div>

                {/* Desktop CTA Button */}
                <div className="hidden min-[861px]:flex items-center gap-3">
                    <Link
                        href="/register"
                        className="lp-btn lp-btn-primary"
                    >
                        Dùng thử miễn phí
                    </Link>
                </div>

                {/* Mobile Menu Hamburger Button — dùng chung ngưỡng 861px với nav links */}
                <div className="flex min-[861px]:hidden items-center gap-2">
                    <Link
                        href="/register"
                        className="lp-btn lp-btn-primary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                        Dùng thử
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen);
                            setDropdownOpen(false);
                        }}
                        aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu tính năng'}
                        aria-expanded={mobileMenuOpen}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--line)',
                            color: 'var(--ink)',
                            padding: '8px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Features Mega Menu — luôn trong DOM, căn giữa theo navbar (≥ 861px) */}
                <FeaturesDropdown
                    id={FEATURES_DROPDOWN_ID}
                    isOpen={dropdownOpen}
                    onClose={handleDropdownClose}
                    onPanelPointerEnter={handlePointerEnter}
                    onPanelPointerLeave={handlePointerLeave}
                />
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div
                    className="min-[861px]:hidden"
                    style={{
                        position: 'fixed',
                        top: '64px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--bg)',
                        borderTop: '1px solid var(--line)',
                        zIndex: 85,
                        overflowY: 'auto',
                        padding: '20px 22px 60px',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <Link
                                href="/features"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'block',
                                    fontSize: '18px',
                                    fontWeight: 800,
                                    color: 'var(--brand)',
                                    marginBottom: '16px',
                                    textDecoration: 'none',
                                    fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                }}
                            >
                                Tất cả tính năng →
                            </Link>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px' }}>
                                {FEATURE_GROUP_ORDER.map((grpKey) => {
                                    const groupInfo = FEATURE_GROUPS[grpKey];
                                    const groupFeatures = FEATURES.filter((f) => f.group === grpKey);

                                    return (
                                        <div key={grpKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div
                                                style={{
                                                    fontSize: '11.5px',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    color: 'var(--mut)',
                                                    letterSpacing: '0.05em',
                                                }}
                                            >
                                                {groupInfo.label}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                                                {groupFeatures.map((feat) => {
                                                    const IconComponent = feat.icon;
                                                    return (
                                                        <Link
                                                            key={feat.slug}
                                                            href={`/features/${feat.slug}`}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                padding: '8px 10px',
                                                                borderRadius: '10px',
                                                                background: 'var(--tile)',
                                                                border: '1px solid var(--line)',
                                                                color: 'var(--ink)',
                                                                textDecoration: 'none',
                                                                fontSize: '13.5px',
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            <IconComponent className="h-4 w-4 text-[var(--brand)] shrink-0" />
                                                            <span className="truncate">{feat.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                            <Link
                                href="/pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'block',
                                    fontSize: '18px',
                                    fontWeight: 800,
                                    color: 'var(--ink)',
                                    marginBottom: '16px',
                                    textDecoration: 'none',
                                    fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                }}
                            >
                                Bảng giá
                            </Link>

                            <Link
                                href="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="lp-btn lp-btn-primary"
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    width: '100%',
                                    marginTop: '8px',
                                }}
                            >
                                Dùng thử miễn phí
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
