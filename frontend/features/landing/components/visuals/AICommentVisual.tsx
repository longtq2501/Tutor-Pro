import React from 'react';

/**
 * Visual minh họa cho Bước 3: Nhận xét AI
 */
export function AICommentVisual() {
    return (
        <div className="lp-visual">
            <div className="lp-ai-bubble-wrap">
                <span className="lp-ai-label">
                    <span aria-hidden="true">✨</span>
                    Gợi ý của AI
                </span>
                <div className="lp-ai-bubble" role="img" aria-label="Ví dụ nhận xét do AI gợi ý">
                    <p>
                        Buổi hôm nay em Minh Anh tập trung tốt, đã nắm cách dùng thì quá khứ đơn.
                    </p>
                    <p>
                        Bạn nên ôn thêm dạng câu hỏi Wh- ở nhà và kiểm tra lại bài tập phần nghe.
                    </p>
                </div>
            </div>
        </div>
    );
}
