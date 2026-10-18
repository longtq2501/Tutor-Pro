import React from 'react';
import { StepDataItem } from './stepFlowData';

interface FlowIntroProps {
    steps: StepDataItem[];
}


export function FlowIntro({ steps }: FlowIntroProps) {
    return (
        <section className="lp-flow-intro" id="flow" aria-labelledby="flow-heading">
            <div className="landing-container">
                <h2 id="flow-heading">Một buổi dạy, từ đầu đến cuối</h2>
                <p>
                    Tutor Pro đi cùng bạn qua 5 việc quen thuộc của mỗi buổi học.
                </p>
                <div className="lp-chips-row" role="navigation" aria-label="Đi đến bước trong luồng">
                    {steps.map((s) => (
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
