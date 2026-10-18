import React from 'react';

/**
 * Visual minh họa cho Bước 2: Dạy ngay trong ứng dụng
 */
export function LiveTeachingVisual() {
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
