import React from 'react';
import Link from 'next/link';

export function FinalCTA() {
    return (
        <section className="lp-cta" aria-labelledby="cta-heading">
            <div className="landing-container">
                <div className="lp-cta-block lp-grid-bg">
                    <h2 id="cta-heading">Sẵn sàng dạy nhẹ nhàng hơn?</h2>
                    <p>Dùng thử miễn phí, bắt đầu trong vài phút.</p>
                    <Link
                        href="/register"
                        className="lp-btn lp-btn-primary"
                    >
                        Dùng thử miễn phí
                    </Link>
                </div>
            </div>
        </section>
    );
}
