import React from 'react';

interface MascotProps {
    className?: string;
    width?: number | string;
    height?: number | string;
}

/**
 * Mascot chibi Tutor Pro
 * - Gia sư nam, áo sơ mi trắng, vest navy, cà vạt cam, kính tròn
 * - Tay phải (viewer's left) vẫy, chớp mắt
 * - Đặt trong khối vuông cam ở ngoài component này
 *
 * Màu sắc cố định (như thiết kế), không theo theme.
 */
const Mascot: React.FC<MascotProps> = ({ className, width = 200, height = 240 }) => {
    return (
        <svg
            className={`lp-mascot-svg ${className ?? ''}`}
            viewBox="0 0 200 240"
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* ======= Legs ======= */}
            {/* Pants */}
            <rect x="78" y="200" width="18" height="26" rx="5" fill="#12385b" />
            <rect x="104" y="200" width="18" height="26" rx="5" fill="#12385b" />
            {/* Shoes */}
            <ellipse cx="87" cy="232" rx="14" ry="6" fill="#2a1c00" />
            <ellipse cx="113" cy="232" rx="14" ry="6" fill="#2a1c00" />

            {/* ======= Torso / Vest ======= */}
            {/* Shirt (white, visible at sides and collar) */}
            <rect x="60" y="138" width="80" height="68" rx="14" fill="#ffffff" />

            {/* Vest (navy) - front panels */}
            <path
                d="M60 142 Q60 138 64 138 L88 138 L92 206 L64 206 Q60 206 60 202 Z"
                fill="#12385b"
            />
            <path
                d="M140 142 Q140 138 136 138 L112 138 L108 206 L136 206 Q140 206 140 202 Z"
                fill="#12385b"
            />
            {/* Vest V-neck */}
            <path
                d="M88 138 L100 170 L112 138"
                fill="none"
                stroke="#12385b"
                strokeWidth="3"
                strokeLinejoin="round"
            />
            {/* Vest buttons */}
            <circle cx="95" cy="182" r="2.2" fill="#fbbf24" />
            <circle cx="105" cy="182" r="2.2" fill="#fbbf24" />

            {/* Shirt collar triangles */}
            <polygon points="88,138 100,150 92,150" fill="#ffffff" />
            <polygon points="112,138 100,150 108,150" fill="#ffffff" />
            <path
                d="M88 138 L92 150 L100 150 L100 144"
                fill="none"
                stroke="#d3dce5"
                strokeWidth="1"
            />
            <path
                d="M112 138 L108 150 L100 150 L100 144"
                fill="none"
                stroke="#d3dce5"
                strokeWidth="1"
            />

            {/* Tie */}
            <path
                d="M97 147 L103 147 L106 160 L100 190 L94 160 Z"
                fill="#f59e0b"
                strokeLinejoin="round"
            />
            {/* Tie knot */}
            <rect x="95" y="143" width="10" height="7" rx="2" fill="#f59e0b" />
            {/* Tie dimple */}
            <path
                d="M99 152 L100 160 L101 152"
                fill="none"
                stroke="#d97e09"
                strokeWidth="1.2"
                strokeLinecap="round"
            />

            {/* ======= Left arm (viewer's right) — hanging down ======= */}
            <g>
                {/* Upper arm */}
                <rect x="140" y="142" width="16" height="36" rx="8" fill="#12385b" />
                {/* Shirt cuff */}
                <rect x="138" y="174" width="20" height="8" rx="3" fill="#ffffff" stroke="#d3dce5" strokeWidth="0.8" />
                {/* Hand */}
                <circle cx="148" cy="192" r="10" fill="#ffe3cc" />
            </g>

            {/* ======= Right arm (viewer's left) — waving (animated) ======= */}
            {/*
                transform-origin set inline to character's right shoulder: x=52, y=142
                Matches CSS keyframes lp-wave.
            */}
            <g className="lp-mascot-arm" style={{ transformOrigin: '52px 142px' }}>
                {/* Upper arm (raised upwards) */}
                <rect x="34" y="108" width="18" height="42" rx="9" fill="#12385b" transform="rotate(-20 43 129)" />
                {/* Shirt cuff */}
                <rect x="26" y="94" width="20" height="8" rx="3" fill="#ffffff" stroke="#d3dce5" strokeWidth="0.8" transform="rotate(-20 36 98)" />
                {/* Hand */}
                <circle cx="32" cy="86" r="11" fill="#ffe3cc" />
                {/* Fingers hint */}
                <path
                    d="M26 82 Q23 78 26 74 M30 80 Q27 75 31 72 M35 80 Q33 74 37 72"
                    fill="none"
                    stroke="#e6c5ac"
                    strokeWidth="1"
                    strokeLinecap="round"
                />
            </g>

            {/* ======= Neck ======= */}
            <rect x="92" y="126" width="16" height="18" rx="5" fill="#ffe3cc" />

            {/* ======= Head ======= */}
            {/* Head base */}
            <circle cx="100" cy="80" r="55" fill="#ffe3cc" />

            {/* Ears */}
            <ellipse cx="46" cy="82" rx="6" ry="9" fill="#ffe3cc" />
            <ellipse cx="154" cy="82" rx="6" ry="9" fill="#ffe3cc" />
            <ellipse cx="46" cy="82" rx="3" ry="5" fill="#f2cfb0" />
            <ellipse cx="154" cy="82" rx="3" ry="5" fill="#f2cfb0" />

            {/* Hair back (under head shape) */}
            <path
                d="M48 70 Q42 50 56 36 Q74 22 100 22 Q126 22 144 36 Q158 50 152 70 Q150 60 140 52 Q124 38 100 38 Q76 38 60 52 Q50 60 48 70 Z"
                fill="#2b2b3a"
            />
            {/* Bangs — fringe parted */}
            <path
                d="M50 62 Q54 50 68 48 Q80 46 90 52 L96 62 Q90 58 82 58 L74 70 Q70 62 62 64 Q56 66 52 72 Z"
                fill="#2b2b3a"
            />
            <path
                d="M150 62 Q146 50 132 48 Q120 46 110 52 L104 62 Q110 58 118 58 L126 70 Q130 62 138 64 Q144 66 148 72 Z"
                fill="#2b2b3a"
            />
            {/* Tuft on top */}
            <path
                d="M100 12 Q96 26 90 24 Q96 30 92 34 Q100 30 104 28 Q102 22 108 18 Q104 20 100 12 Z"
                fill="#2b2b3a"
                strokeLinejoin="round"
            />

            {/* Face — Blush */}
            <ellipse cx="68" cy="92" rx="7" ry="4.5" fill="#f8b4b4" opacity="0.8" />
            <ellipse cx="132" cy="92" rx="7" ry="4.5" fill="#f8b4b4" opacity="0.8" />

            {/* Eyebrows */}
            <path
                d="M70 68 Q78 64 86 68"
                fill="none"
                stroke="#2b2b3a"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M114 68 Q122 64 130 68"
                fill="none"
                stroke="#2b2b3a"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Eyes (white sclera + pupil + highlight)
                Eye group uses lp-mascot-eye animation class with transformOrigin inline.
            */}
            <g>
                {/* Left eye (viewer's right) */}
                <g className="lp-mascot-eye" style={{ transformOrigin: '120px 80px' }}>
                    <ellipse cx="120" cy="80" rx="11" ry="12" fill="#ffffff" stroke="#2b2b3a" strokeWidth="1.5" />
                    <circle cx="122" cy="81" r="5.5" fill="#2a1c00" />
                    <circle cx="124" cy="78" r="2" fill="#ffffff" />
                </g>
                {/* Right eye (viewer's left) */}
                <g className="lp-mascot-eye" style={{ transformOrigin: '80px 80px' }}>
                    <ellipse cx="80" cy="80" rx="11" ry="12" fill="#ffffff" stroke="#2b2b3a" strokeWidth="1.5" />
                    <circle cx="82" cy="81" r="5.5" fill="#2a1c00" />
                    <circle cx="84" cy="78" r="2" fill="#ffffff" />
                </g>
            </g>

            {/* Round glasses */}
            <g fill="none" stroke="#3d4f5f" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="80" cy="80" r="16" />
                <circle cx="120" cy="80" r="16" />
                <path d="M96 80 L104 80" />
                {/* Temple arms */}
                <path d="M64 80 Q58 78 52 72" />
                <path d="M136 80 Q142 78 148 72" />
            </g>

            {/* Nose (tiny dot) */}
            <circle cx="100" cy="94" r="1.8" fill="#e0b08e" />

            {/* Mouth — small smile */}
            <path
                d="M92 104 Q100 112 108 104"
                fill="none"
                stroke="#8b3a2f"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default Mascot;
