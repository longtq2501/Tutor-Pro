'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Mascot from './Mascot';
import { TutorProLogo } from '@/components/shared/TutorProLogo';
import Link from 'next/link';

/* =========================================================================
 *  5 Step Visuals — tĩnh, dựng bằng HTML/CSS/SVG nhẹ
 * ========================================================================= */

// ----- Step 1: Lịch tuần -----
function CalendarVisual() {
    // 3 tuần (3 hàng) x 7 ngày: T2, T3, T4, T5, T6, T7, CN
    // Mỗi ô: tile2 hoặc có màu (plum, blue, pink, amber). T4 tuần 2 viền đỏ đứt.
    const cells: ('' | 'plum' | 'blue' | 'pink' | 'amber' | 'conflict-blue' | 'conflict-pink')[] = [
        '', '', 'blue', '', 'plum', '', '',
        'pink', '', 'conflict-blue', 'amber', '', 'plum', '',
        '', 'plum', 'conflict-pink', '', '', '', 'amber',
    ];
    const hasClass = (c: string, key: string) => {
        if (c.includes(key)) return `fill-${key}`;
        return '';
    };
    return (
        <div className="lp-visual">
            <div className="lp-calendar">
                <div className="lp-cal-header">
                    <span aria-hidden="true">‹</span>
                    <span>Tuần này</span>
                    <span aria-hidden="true">›</span>
                </div>
                <div className="lp-cal-days" role="presentation">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                        <div key={d} className="lp-cal-day-label">{d}</div>
                    ))}
                    {cells.map((c, i) => {
                        const isConflict = c.startsWith('conflict');
                        const fillKey = isConflict ? c.replace('conflict-', '') : c;
                        const fillCls = fillKey ? `fill-${fillKey}` : '';
                        return (
                            <div
                                key={i}
                                className={[
                                    'lp-cal-cell',
                                    fillCls,
                                    isConflict ? 'conflict' : '',
                                ].filter(Boolean).join(' ')}
                                aria-hidden="true"
                            />
                        );
                    })}
                </div>
                <div className="lp-cal-alert" role="note">
                    <span aria-hidden="true">!</span>
                    Hai buổi trùng giờ vào thứ Tư
                </div>
            </div>
        </div>
    );
}

// ----- Step 2: Lớp học online -----
function LiveTeachingVisual() {
    return (
        <div className="lp-visual">
            <div className="lp-live">
                <div className="lp-whiteboard" aria-hidden="true">
                    <div className="lp-wb-title">Bảng trắng · Buổi 4</div>
                    <svg className="lp-wb-svg" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                        {/* Nét phấn teal */}
                        <g fill="none" stroke="#2dd4bf" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
                            {/* Gạch chân dưới chữ */}
                            <path d="M20 50 L130 50 M140 50 L180 50" />
                            {/* Đồ thị đường đơn giản */}
                            <path d="M260 30 C 280 70, 300 70, 320 100 S 360 170, 385 180" />
                            {/* Ticks trục */}
                            <path d="M250 180 L395 180 M260 25 L260 185" />
                        </g>
                        {/* Nét phấn vàng */}
                        <g fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.92">
                            {/* Chữ viết tay ngắn dạng gạch ngang */}
                            <path d="M22 76 L 44 70 M 50 78 L 82 72 M 88 80 L 118 74" />
                            <path d="M22 96 L 58 90 M 66 98 L 116 92" />
                            {/* Vòng tròn nhấn mạnh */}
                            <circle cx="330" cy="115" r="22" />
                            {/* Mũi tên */}
                            <path d="M80 140 L 200 140 L 200 130 M 200 140 L 190 150" />
                        </g>
                    </svg>
                </div>

                <div className="lp-participants" aria-hidden="true">
                    <div className="lp-avatar-tile">
                        <span className="lp-avatar-initials">MA</span>
                    </div>
                    <div className="lp-avatar-tile">
                        <span className="lp-avatar-initials">HL</span>
                    </div>
                </div>

                <div className="lp-live-controls" aria-hidden="true">
                    <button type="button" className="lp-ctrl-btn" tabIndex={-1}>🎤</button>
                    <button type="button" className="lp-ctrl-btn" tabIndex={-1}>📷</button>
                    <button type="button" className="lp-ctrl-btn" tabIndex={-1}>🖊️</button>
                    <button type="button" className="lp-ctrl-btn" tabIndex={-1}>👥</button>
                    <button type="button" className="lp-ctrl-btn danger" tabIndex={-1}>📴</button>
                </div>
            </div>
        </div>
    );
}

// ----- Step 3: Nhận xét AI -----
function AICommentVisual() {
    return (
        <div className="lp-visual">
            <div className="lp-ai-bubble-wrap">
                <span className="lp-ai-label">
                    <span aria-hidden="true">✨</span>
                    Gợi ý của AI
                </span>
                <div className="lp-ai-bubble" role="img" aria-label="Ví dụ nhận xét do AI gợi ý">
                    <p>
                        Buổi hôm nay em Minh Anh tập trung tốt, đã nắm cách dùng thì quá khứ đơn.
                    </p>
                    <p>
                        Bạn nên ôn thêm dạng câu hỏi Wh- ở nhà và kiểm tra lại bài tập phần nghe.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ----- Step 4: Học phí -----
function FinanceVisual() {
    const rows = [
        { initials: 'MA', name: 'Minh Anh', status: 'paid', statusText: 'Đã thu' },
        { initials: 'HL', name: 'Hoàng Long', status: 'paid', statusText: 'Đã thu' },
        { initials: 'TN', name: 'Thu Nga', status: 'unpaid', statusText: 'Chưa thu' },
    ];
    return (
        <div className="lp-visual">
            <div className="lp-finance">
                <div className="lp-fin-summary" aria-hidden="true">
                    <span>Học phí tháng này</span>
                    <span>Đã thu <strong>2 / 3</strong> em</span>
                </div>
                <div className="lp-fin-list">
                    {rows.map((r) => (
                        <div key={r.initials} className="lp-fin-row">
                            <div className="lp-fin-left">
                                <span className="lp-fin-avatar">{r.initials}</span>
                                <span className="lp-fin-name">{r.name}</span>
                            </div>
                            <span className={`lp-status ${r.status === 'paid' ? 'lp-status-paid' : 'lp-status-unpaid'}`}>
                                {r.statusText}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ----- Step 5: Tiến độ -----
function ProgressVisual() {
    const items = [
        { name: 'Chương 1', state: 'Hoàn thành', pct: 100 },
        { name: 'Chương 2', state: 'Đang học', pct: 60 },
        { name: 'Chương 3', state: 'Sắp tới', pct: 15 },
    ];
    return (
        <div className="lp-visual">
            <div className="lp-progress">
                {items.map((it) => (
                    <div key={it.name} className="lp-prog-item">
                        <div className="lp-prog-head">
                            <span className="lp-prog-name">{it.name}</span>
                            <span className="lp-prog-state">{it.state} · {it.pct}%</span>
                        </div>
                        <div className="lp-prog-bar" role="progressbar" aria-valuenow={it.pct} aria-valuemin={0} aria-valuemax={100} aria-label={it.name}>
                            <div className="lp-prog-fill" style={{ width: `${it.pct}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
 *  Dữ liệu 5 bước — lấy từ bảng mục 5.4 ISSUES
 * ========================================================================= */

interface Step {
    num: number;
    anchor: string;
    chipLabel: string;
    h3: string;
    desc: string;
    ticks: [string, string];
    visual: React.ReactNode;
}

const STEPS: Step[] = [
    {
        num: 1,
        anchor: 'step-1',
        chipLabel: 'Xếp lịch',
        h3: 'Lịch dạy rõ ràng cả tuần',
        desc: 'Xem lịch theo ngày hoặc tuần trong một màn hình.',
        ticks: [
            'Phát hiện lịch trùng để xử lý sớm',
            'Tạo lịch hàng loạt cho nhiều học sinh',
        ],
        visual: <CalendarVisual />,
    },
    {
        num: 2,
        anchor: 'step-2',
        chipLabel: 'Dạy học',
        h3: 'Dạy ngay trong ứng dụng',
        desc: 'Tổ chức lớp online với bảng trắng và phòng học, không cần chuyển qua nền tảng khác.',
        ticks: [
            'Bảng trắng và phòng học đồng bộ',
            'Sắp bài giảng theo chương hoặc buổi học',
        ],
        visual: <LiveTeachingVisual />,
    },
    {
        num: 3,
        anchor: 'step-3',
        chipLabel: 'Nhận xét',
        h3: 'Nhận xét buổi học nhanh hơn',
        desc: 'AI gợi ý nhận xét theo nội dung buổi học, để bạn bớt ngồi nghĩ chữ sau giờ dạy.',
        ticks: [
            'Gợi ý theo ngữ cảnh từng buổi',
            'Viết bằng tiếng Việt tự nhiên',
        ],
        visual: <AICommentVisual />,
    },
    {
        num: 4,
        anchor: 'step-4',
        chipLabel: 'Thu học phí',
        h3: 'Biết ai đã đóng, ai chưa',
        desc: 'Theo dõi học phí đã thu và chưa thu của từng học sinh, kèm doanh thu theo chu kỳ.',
        ticks: [
            'Công nợ theo từng học sinh',
            'Đối soát học phí qua VietQR',
        ],
        visual: <FinanceVisual />,
    },
    {
        num: 5,
        anchor: 'step-5',
        chipLabel: 'Theo dõi tiến độ',
        h3: 'Theo sát tiến độ từng em',
        desc: 'Tổng hợp kết quả học tập để điều chỉnh lộ trình cho phù hợp.',
        ticks: [
            'Đánh giá theo buổi học và theo giai đoạn',
            'Tài liệu lưu tập trung, tìm lại nhanh',
        ],
        visual: <ProgressVisual />,
    },
];

/* =========================================================================
 *  Navbar (sticky, 64px, nền mờ blur)
 * ========================================================================= */

interface NavBarProps {
    onNavigate: (href: string) => void;
}

function NavBar({ onNavigate }: NavBarProps) {
    return (
        <nav className="lp-nav" role="navigation" aria-label="Điều hướng chính">
            <div className="landing-container lp-nav-inner">
                <a
                    href="/"
                    aria-label="Về trang chủ Tutor Pro"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate('/');
                    }}
                    style={{ display: 'inline-flex' }}
                >
                    <TutorProLogo iconClassName="h-9 w-9" />
                </a>

                <div className="lp-nav-links">
                    <button
                        type="button"
                        className="lp-nav-link"
                        onClick={() => onNavigate('/features')}
                    >
                        Tính năng
                    </button>
                    <button
                        type="button"
                        className="lp-nav-link"
                        onClick={() => onNavigate('/pricing')}
                    >
                        Bảng giá
                    </button>
                </div>

                <button
                    type="button"
                    className="lp-btn lp-btn-primary"
                    onClick={() => onNavigate('/register')}
                >
                    Dùng thử miễn phí
                </button>
            </div>
        </nav>
    );
}

/* =========================================================================
 *  Hero — 2 cột, 3D nghiêng theo chuột, mascot trong khối cam, 2 thẻ nổi
 * ========================================================================= */

interface HeroProps {
    onNavigate: (href: string) => void;
}

function Hero({ onNavigate }: HeroProps) {
    const sceneRef = useRef<HTMLDivElement | null>(null);
    const rigRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scene = sceneRef.current;
        const rig = rigRef.current;
        if (!scene || !rig) return;

        // Tắt hiệu ứng nghiêng trên thiết bị cảm ứng
        const isTouch = typeof window !== 'undefined' && (
            'ontouchstart' in window ||
            (navigator.maxTouchPoints ?? 0) > 0
        );
        if (isTouch) return;

        let raf = 0;
        let target = { ry: 0, rx: 0 };
        let current = { ry: 0, rx: 0 };
        let running = false;

        const apply = () => {
            // Smooth nhẹ, dù đã có CSS transition
            current.ry += (target.ry - current.ry) * 0.35;
            current.rx += (target.rx - current.rx) * 0.35;
            rig.style.transform = `rotateY(${current.ry.toFixed(2)}deg) rotateX(${current.rx.toFixed(2)}deg)`;
            if (Math.abs(target.ry - current.ry) > 0.05 || Math.abs(target.rx - current.rx) > 0.05) {
                raf = requestAnimationFrame(apply);
            } else {
                running = false;
            }
        };

        const onMove = (e: MouseEvent) => {
            const rect = scene.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            target.ry = (x - 0.5) * 16;
            target.rx = -(y - 0.5) * 12;
            if (!running) {
                running = true;
                raf = requestAnimationFrame(apply);
            }
        };

        const onLeave = () => {
            cancelAnimationFrame(raf);
            target = { ry: 0, rx: 0 };
            if (!running) {
                running = true;
                raf = requestAnimationFrame(apply);
            }
        };

        scene.addEventListener('mousemove', onMove);
        scene.addEventListener('mouseleave', onLeave);
        return () => {
            scene.removeEventListener('mousemove', onMove);
            scene.removeEventListener('mouseleave', onLeave);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section className="lp-hero" aria-labelledby="hero-heading">
            <div className="landing-container lp-hero-grid">
                <div>
                    <h1 id="hero-heading">
                        <span className="lp-hero-line">Bạn lo dạy hay.</span>
                        <span className="lp-hero-line">Tutor Pro lo phần còn lại.</span>
                    </h1>
                    <p className="lp-hero-desc">
                        Lịch dạy, học phí, lớp học online và nhận xét cho phụ huynh, gọn trong một nơi.
                    </p>
                    <div className="lp-hero-buttons">
                        <button
                            type="button"
                            className="lp-btn lp-btn-primary"
                            onClick={() => onNavigate('/register')}
                        >
                            Dùng thử miễn phí
                        </button>
                        <a
                            href="#flow"
                            className="lp-btn lp-btn-ghost"
                        >
                            Xem Tutor Pro làm gì
                        </a>
                    </div>
                </div>

                <div className="lp-hero-3d" ref={sceneRef} aria-hidden="true">
                    <div className="lp-hero-rig" ref={rigRef}>
                        <div className="lp-mascot-wrap">
                            <div className="lp-mascot-square">
                                <Mascot />
                            </div>
                        </div>
                        <div className="lp-float-card lp-float-card-1">
                            Hôm nay 19:00
                            <small>Minh Anh, IELTS</small>
                        </div>
                        <div className="lp-float-card lp-float-card-2">
                            Đã thu học phí
                            <small>Cập nhật ngay trên hệ thống</small>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
 *  FlowIntro + 5 chips
 * ========================================================================= */

function FlowIntro() {
    return (
        <section className="lp-flow-intro" id="flow" aria-labelledby="flow-heading">
            <div className="landing-container">
                <h2 id="flow-heading">Một buổi dạy, từ đầu đến cuối</h2>
                <p>
                    Tutor Pro đi cùng bạn qua 5 việc quen thuộc của mỗi buổi học.
                </p>
                <div className="lp-chips-row" role="navigation" aria-label="Đi đến bước trong luồng">
                    {STEPS.map((s) => (
                        <a
                            key={s.anchor}
                            href={`#${s.anchor}`}
                            className="lp-chip"
                            aria-label={`Bước ${s.num}: ${s.chipLabel}`}
                        >
                            <span className="lp-chip-num" aria-hidden="true">{s.num}</span>
                            <span>{s.chipLabel}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
 *  5-Step Flow — đường dọc trái, active khi cuộn
 * ========================================================================= */

function StepFlow() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (typeof IntersectionObserver === 'undefined') {
            // Fallback: active hết
            document.querySelectorAll<HTMLElement>('.lp-row').forEach((r) => r.classList.add('active'));
            return;
        }
        const rows = Array.from(document.querySelectorAll<HTMLElement>('.lp-row'));
        if (rows.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Active phần tử đang giao với dải giữa màn hình (ưu tiên cái mới nhất)
                const intersecting = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (intersecting.length > 0) {
                    const activeTarget = intersecting[0].target;
                    rows.forEach((r) => {
                        if (r === activeTarget) r.classList.add('active');
                        else r.classList.remove('active');
                    });
                }
            },
            {
                rootMargin: '-35% 0px -35% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        );
        rows.forEach((r) => observer.observe(r));

        // Active bước 1 ngay lập tức để không có trạng thái mờ hết
        if (rows[0]) rows[0].classList.add('active');

        return () => observer.disconnect();
    }, []);

    return (
        <section aria-labelledby="flow-heading">
            <div className="landing-container lp-flow">
                {STEPS.map((s) => (
                    <article
                        key={s.anchor}
                        id={s.anchor}
                        className="lp-row"
                        aria-labelledby={`${s.anchor}-heading`}
                    >
                        <div className="lp-row-text">
                            <span className="lp-step-num" aria-hidden="true">{s.num}</span>
                            <h3 id={`${s.anchor}-heading`}>{s.h3}</h3>
                            <p>{s.desc}</p>
                            <ul className="lp-ticks">
                                {s.ticks.map((t) => (
                                    <li key={t}>
                                        <span className="lp-tick-mark" aria-hidden="true">✓</span>
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            {s.visual}
                            <p className="lp-visual-caption">Hình minh họa</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

/* =========================================================================
 *  CTA cuối trang
 * ========================================================================= */

function FinalCTA({ onCTA }: { onCTA: () => void }) {
    return (
        <section className="lp-cta" aria-labelledby="cta-heading">
            <div className="landing-container">
                <div className="lp-cta-block">
                    <h2 id="cta-heading">Sẵn sàng dạy nhẹ nhàng hơn?</h2>
                    <p>Dùng thử miễn phí, bắt đầu trong vài phút.</p>
                    <button
                        type="button"
                        className="lp-btn lp-btn-primary"
                        onClick={onCTA}
                    >
                        Dùng thử miễn phí
                    </button>
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
 *  LandingFooter — giữ nội dung của hệ thống (Footer.tsx)
 *  Chỉ áp phong cách landing.
 * ========================================================================= */

function LandingFooter() {
    const year = typeof Date !== 'undefined' ? new Date().getFullYear() : 2025;
    return (
        <footer className="lp-footer" aria-label="Chân trang">
            <div className="landing-container">
                <div className="landing-container lp-footer-inner">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <TutorProLogo iconClassName="h-7 w-7" />
                        </div>
                        <p style={{ fontSize: '14px', maxWidth: '320px', color: 'var(--mut)', lineHeight: '1.6' }}>
                            Kiến tạo tương lai giáo dục 1-1 tại Việt Nam bằng công nghệ và trí tuệ nhân tạo.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                        <div>
                            <div style={{
                                fontWeight: 800,
                                fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                color: 'var(--ink)',
                                marginBottom: '12px',
                                fontSize: '15px',
                            }}>
                                Nền tảng
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li><Link href="/features">Tính năng</Link></li>
                                <li><Link href="/pricing">Bảng giá</Link></li>
                                <li>
                                    <a href="https://github.com/longtq2501/Tutor-Pro" target="_blank" rel="noreferrer">
                                        GitHub
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div style={{
                                fontWeight: 800,
                                fontFamily: 'var(--font-baloo-2), system-ui, sans-serif',
                                color: 'var(--ink)',
                                marginBottom: '12px',
                                fontSize: '15px',
                            }}>
                                Liên hệ
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li>Email: tonquynhlong05@gmail.com</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    className="landing-container"
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: '12px',
                        alignItems: 'center',
                        paddingTop: '24px',
                        marginTop: '24px',
                        borderTop: '1px solid var(--line)',
                        fontSize: '12.5px',
                        letterSpacing: '0.04em',
                    }}
                >
                    <p>© {year} TUTOR PRO VIETNAM. ALL RIGHTS RESERVED.</p>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* =========================================================================
 *  LandingPageContent — root
 * ========================================================================= */

const LandingPageContent: React.FC = () => {
    const router = useRouter();

    const handleNavigate = (href: string) => {
        if (href.startsWith('/')) {
            router.push(href);
        } else if (href.startsWith('http')) {
            if (typeof window !== 'undefined') window.location.href = href;
        }
    };

    return (
        <div className="landing-page" style={{ minHeight: '100vh' }}>
            <NavBar onNavigate={handleNavigate} />
            <main>
                <Hero onNavigate={handleNavigate} />
                <FlowIntro />
                <StepFlow />
                <FinalCTA onCTA={() => handleNavigate('/register')} />
            </main>
            <LandingFooter />
        </div>
    );
};

export default LandingPageContent;
