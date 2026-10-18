/**
 * Plain data for the 5-step landing flow.
 * No JSX / React elements here — safe to import from Server Components.
 * The `visual` ReactNode is added in StepFlow.tsx (client boundary).
 */
export interface StepDataItem {
    num: number;
    anchor: string;
    chipLabel: string;
    h3: string;
    desc: string;
    ticks: [string, string];
    featureSlug?: string;
}

export const STEP_DATA: StepDataItem[] = [
    {
        num: 1,
        anchor: 'step-1',
        chipLabel: 'Xếp lịch',
        h3: 'Lịch dạy rõ ràng cả tuần',
        desc: 'Xem lịch theo ngày hoặc tuần trong một màn hình.',
        ticks: [
            'Phát hiện lịch trùng để xử lý sớm',
            'Tạo lịch hàng loạt cho nhiều học sinh',
        ],
        featureSlug: 'schedule',
    },
    {
        num: 2,
        anchor: 'step-2',
        chipLabel: 'Dạy học',
        h3: 'Dạy ngay trong ứng dụng',
        desc: 'Tổ chức lớp online với bảng trắng và phòng học, không cần chuyển qua nền tảng khác.',
        ticks: [
            'Bảng trắng và phòng học đồng bộ',
            'Sắp bài giảng theo chương hoặc buổi học',
        ],
        featureSlug: 'lessons',
    },
    {
        num: 3,
        anchor: 'step-3',
        chipLabel: 'Nhận xét',
        h3: 'Nhận xét buổi học nhanh hơn',
        desc: 'AI gợi ý nhận xét theo nội dung buổi học, để bạn bớt ngồi nghĩ chữ sau giờ dạy.',
        ticks: [
            'Gợi ý theo ngữ cảnh từng buổi',
            'Viết bằng tiếng Việt tự nhiên',
        ],
        featureSlug: 'reports',
    },
    {
        num: 4,
        anchor: 'step-4',
        chipLabel: 'Thu học phí',
        h3: 'Biết ai đã đóng, ai chưa',
        desc: 'Theo dõi học phí đã thu và chưa thu của từng học sinh, kèm doanh thu theo chu kỳ.',
        ticks: [
            'Công nợ theo từng học sinh',
            'Đối soát học phí qua VietQR',
        ],
        featureSlug: 'finance',
    },
    {
        num: 5,
        anchor: 'step-5',
        chipLabel: 'Theo dõi tiến độ',
        h3: 'Theo sát tiến độ từng em',
        desc: 'Tổng hợp kết quả học tập để điều chỉnh lộ trình cho phù hợp.',
        ticks: [
            'Đánh giá theo buổi học và theo giai đoạn',
            'Tài liệu lưu tập trung, tìm lại nhanh',
        ],
        featureSlug: 'students',
    },
];
