'use client';

import React from 'react';
import Link from 'next/link';
import { HeroVideo } from './HeroVideo';

// Khai báo đường dẫn video và ảnh poster tại đây để hiển thị trong hero
const HERO_VIDEO = { src: '', poster: '' };

export function Hero() {
    return (
        <section className="lp-hero lp-grid-bg" aria-labelledby="hero-heading">
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

                <div className="lp-hero-video-col">
                    <HeroVideo src={HERO_VIDEO.src} poster={HERO_VIDEO.poster} />
                </div>
            </div>
        </section>
    );
}
