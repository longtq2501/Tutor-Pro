import React from 'react';

/**
 * Visual minh họa cho Bước 4: Thu học phí
 */
export function FinanceVisual() {
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
