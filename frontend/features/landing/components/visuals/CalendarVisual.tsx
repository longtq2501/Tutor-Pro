import React from 'react';

/**
 * Visual minh họa cho Bước 1: Lịch dạy rõ ràng cả tuần
 */
export function CalendarVisual() {
    // 3 tuần (3 hàng) x 7 ngày: T2, T3, T4, T5, T6, T7, CN
    const cells: ('' | 'plum' | 'blue' | 'pink' | 'amber' | 'conflict-blue' | 'conflict-pink')[] = [
        '', '', 'blue', '', 'plum', '', '',
        'pink', '', 'conflict-blue', 'amber', '', 'plum', '',
        '', 'plum', 'conflict-pink', '', '', '', 'amber',
    ];

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
