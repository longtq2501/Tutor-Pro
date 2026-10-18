'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Mascot from '../Mascot';

export function Hero() {
    const sceneRef = useRef<HTMLDivElement | null>(null);
    const rigRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scene = sceneRef.current;
        const rig = rigRef.current;
        if (!scene || !rig) return;

        // Tắt hiệu ứng nghiêng trên thiết bị cảm ứng hoặc khi người dùng bật giảm chuyển động
        const isTouch = typeof window !== 'undefined' && (
            'ontouchstart' in window ||
            (navigator.maxTouchPoints ?? 0) > 0
        );
        const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );

        if (isTouch || prefersReducedMotion) return;

        let raf = 0;
        let target = { ry: 0, rx: 0 };
        const current = { ry: 0, rx: 0 };
        let running = false;

        const apply = () => {
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
                        <Link
                            href="/register"
                            className="lp-btn lp-btn-primary"
                        >
                            Dùng thử miễn phí
                        </Link>
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
