import React from 'react';

/**
 * Visual minh họa cho Bước 5: Theo dõi tiến độ
 */
export function ProgressVisual() {
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
