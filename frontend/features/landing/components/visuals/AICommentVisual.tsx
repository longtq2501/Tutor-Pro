import React from 'react';

/**
 * Visual minh họa cho Bước 3: Nhận xét từng buổi học
 */
export function AICommentVisual() {
    return (
        <div className="lp-visual">
            <div className="lp-ai-bubble-wrap">
                <span className="lp-ai-label">
                    <span aria-hidden="true">✏️</span>
                    Nhận xét của gia sư
                </span>
                <div className="lp-ai-bubble" role="img" aria-label="Ví dụ nhận xét buổi học do gia sư viết">
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
