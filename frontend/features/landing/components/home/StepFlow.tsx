'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CalendarVisual } from '../visuals/CalendarVisual';
import { LiveTeachingVisual } from '../visuals/LiveTeachingVisual';
import { AICommentVisual } from '../visuals/AICommentVisual';
import { FinanceVisual } from '../visuals/FinanceVisual';
import { ProgressVisual } from '../visuals/ProgressVisual';
import { STEP_DATA, StepDataItem } from './stepFlowData';

export type { StepDataItem };

/** Full step item with JSX visual — only used inside this client component. */
export interface StepItem extends StepDataItem {
    visual: React.ReactNode;
}

const VISUALS: React.ReactNode[] = [
    <CalendarVisual key="cal" />,
    <LiveTeachingVisual key="live" />,
    <AICommentVisual key="ai" />,
    <FinanceVisual key="fin" />,
    <ProgressVisual key="prog" />,
];

/** Full steps with JSX visuals — only referenced inside this client module. */
const LANDING_STEPS: StepItem[] = STEP_DATA.map((d, i) => ({ ...d, visual: VISUALS[i] }));

/** Re-exported so existing imports keep working (chip data only, no JSX). */
export { STEP_DATA as LANDING_STEPS };

export function StepFlow() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (typeof IntersectionObserver === 'undefined') {
            document.querySelectorAll<HTMLElement>('.lp-row').forEach((r) => r.classList.add('active'));
            return;
        }
        const rows = Array.from(document.querySelectorAll<HTMLElement>('.lp-row'));
        if (rows.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
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

        if (rows[0]) rows[0].classList.add('active');

        return () => observer.disconnect();
    }, []);

    return (
        <section aria-labelledby="flow-heading">
            <div className="landing-container lp-flow">
                {LANDING_STEPS.map((s) => (
                    <article
                        key={s.anchor}
                        id={s.anchor}
                        className="lp-row"
                        data-tone={s.num}
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
                            {s.featureSlug && (
                                <div className="lp-step-link-wrap">
                                    <Link
                                        href={`/features/${s.featureSlug}`}
                                        className="lp-step-link"
                                    >
                                        <span>Tìm hiểu tính năng chi tiết</span>
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="lp-visual-col">
                            {s.visual}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
