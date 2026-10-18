import {
    LayoutDashboard,
    Wallet,
    Settings,
    Users,
    GraduationCap,
    Calendar,
    FolderArchive,
    BookOpen,
    BarChart3,
    ClipboardCheck,
    LucideIcon
} from 'lucide-react';

export type FeatureGroup = 'operations' | 'academics' | 'teaching' | 'assessment';
export type FeatureType = 'view' | 'action' | 'mixed';

export interface FeatureConfig {
    slug: string;
    name: string;
    tagline: string;
    desc: string;
    icon: LucideIcon;
    group: FeatureGroup;
    type: FeatureType;
    keyBenefits: string[];
    systemMeaning: string;
    actionGuideTitle?: string;
    actionGuideSteps?: string[];
    related: string[];
}

export interface FeatureGroupInfo {
    key: FeatureGroup;
    label: string;
    description: string;
}

export const FEATURE_GROUPS: Record<FeatureGroup, FeatureGroupInfo> = {
    operations: {
        key: 'operations',
        label: 'Vận hành',
        description: 'Bao quát hệ thống, doanh thu và thiết lập cá nhân',
    },
    academics: {
        key: 'academics',
        label: 'Học vụ',
        description: 'Quản lý học sinh, phụ huynh và tổ chức lớp học',
    },
    teaching: {
        key: 'teaching',
        label: 'Giảng dạy',
        description: 'Lịch dạy, kho tài liệu và bài giảng tương tác',
    },
    assessment: {
        key: 'assessment',
        label: 'Đánh giá',
        description: 'Báo cáo tiến độ và hệ thống bài tập khảo thí',
    },
};

export const FEATURES: FeatureConfig[] = [
    // 1. Vận hành
    {
        slug: 'overview',
        name: 'Tổng Quan',
        tagline: 'Nhìn toàn cảnh công việc dạy học trong một bảng điều khiển',
        desc: 'Theo dõi nhanh các buổi học hôm nay, học phí cần thu và việc cần xử lý ngay khi mở ứng dụng.',
        icon: LayoutDashboard,
        group: 'operations',
        type: 'view',
        keyBenefits: [
            'Xem ngay các ca dạy sắp tới trong ngày',
            'Nắm bắt nhanh số học phí đã thu và còn nợ',
            'Cảnh báo các bài tập cần chấm hoặc việc gấp',
        ],
        systemMeaning: 'Tổng Quan là trung tâm chỉ huy hàng ngày của gia sư, tổng hợp dữ liệu từ lịch dạy, học vụ, tài chính và khảo thí để gia sư nắm trọn công việc mà không cần lật mở từng trang.',
        related: ['schedule', 'finance', 'students'],
    },
    {
        slug: 'finance',
        name: 'Tài Chính',
        tagline: 'Quản lý học phí minh bạch, theo dõi công nợ chuẩn xác',
        desc: 'Theo dõi chi tiết học phí từng học sinh, lập hóa đơn, đối soát VietQR và báo cáo doanh thu theo tháng.',
        icon: Wallet,
        group: 'operations',
        type: 'mixed',
        keyBenefits: [
            'Theo dõi công nợ và trạng thái đóng học phí của từng em',
            'Tự động tổng hợp số buổi đã học để tính học phí',
            'Hỗ trợ tạo hóa đơn gửi phụ huynh kèm mã thanh toán nhanh',
        ],
        systemMeaning: 'Module Tài Chính đồng bộ trực tiếp với nhật ký buổi dạy thực tế, giúp gia sư loại bỏ hoàn toàn việc ghi chép sổ sách thủ công hay quên thu học phí.',
        actionGuideTitle: 'Quy trình thu học phí gợi ý',
        actionGuideSteps: [
            'Kiểm tra danh sách học sinh cần thanh toán theo chu kỳ',
            'Tạo hóa đơn đối soát tự động từ số buổi đã hoàn thành',
            'Xác nhận thanh toán và cập nhật trạng thái công nợ',
        ],
        related: ['overview', 'students', 'reports'],
    },
    {
        slug: 'settings',
        name: 'Cài đặt',
        tagline: 'Tùy chỉnh hồ sơ dạy học và phương thức vận hành',
        desc: 'Thiết lập thông tin cá nhân, định dạng tài khoản ngân hàng nhận học phí và các tùy chọn cá nhân hóa.',
        icon: Settings,
        group: 'operations',
        type: 'mixed',
        keyBenefits: [
            'Cập nhật thông tin gia sư và chứng chỉ chuyên môn',
            'Thiết lập thông tin tài khoản ngân hàng để tạo mã QR',
            'Tùy chỉnh thông báo và giao diện làm việc',
        ],
        systemMeaning: 'Khu vực Cài đặt đảm bảo hệ thống phản ánh đúng danh tính chuyên nghiệp của bạn trước phụ huynh và học sinh.',
        actionGuideTitle: 'Các bước thiết lập ban đầu',
        actionGuideSteps: [
            'Hoàn thiện hồ sơ gia sư và thông tin liên hệ',
            'Cài đặt tài khoản ngân hàng nhận học phí',
            'Cấu hình các mẫu tin nhắn và định dạng báo cáo',
        ],
        related: ['overview', 'finance'],
    },

    // 2. Học vụ
    {
        slug: 'students',
        name: 'Học Sinh & PH',
        tagline: 'Hồ sơ học tập trọn vẹn và cầu nối tin cậy với phụ huynh',
        desc: 'Quản lý thông tin chi tiết từng học sinh, nhật ký học tập, liên hệ phụ huynh và tiến độ rèn luyện.',
        icon: Users,
        group: 'academics',
        type: 'action',
        keyBenefits: [
            'Lưu trữ hồ sơ học sinh, lớp, trường và mục tiêu học tập',
            'Kết nối thông tin liên hệ phụ huynh để gửi báo cáo',
            'Ghi chép ghi chú cá nhân hóa cho từng em',
        ],
        systemMeaning: 'Học Sinh & PH là hạt nhân của mọi luồng học vụ trong Tutor Pro. Từ đây gia sư gán lịch dạy, xếp lớp, giao bài tập và xuất báo cáo tiến độ.',
        actionGuideTitle: 'Thao tác quản lý học sinh',
        actionGuideSteps: [
            'Thêm mới học sinh kèm thông tin phụ huynh',
            'Gán học sinh vào lớp học hoặc xếp lịch 1-1',
            'Xem lịch sử học tập và nhận xét định kỳ',
        ],
        related: ['classes', 'schedule', 'reports'],
    },
    {
        slug: 'classes',
        name: 'Lớp học',
        tagline: 'Tổ chức lớp nhóm hoặc kèm 1-1 khoa học',
        desc: 'Phân loại học sinh theo lớp, môn học hoặc trình độ để dễ dàng xếp lịch và giao học liệu đồng loạt.',
        icon: GraduationCap,
        group: 'academics',
        type: 'action',
        keyBenefits: [
            'Gom nhóm học sinh theo trình độ và mục tiêu',
            'Giao bài tập và tài liệu chung cho cả lớp trong một click',
            'Quản lý sĩ số và trạng thái học tập thuận tiện',
        ],
        systemMeaning: 'Lớp học giúp chuẩn hóa quy trình sư phạm khi gia sư mở rộng từ dạy 1-1 sang các nhóm nhỏ hoặc lớp kèm chất lượng cao.',
        actionGuideTitle: 'Thao tác với lớp học',
        actionGuideSteps: [
            'Tạo lớp mới với thông tin môn học và mục tiêu',
            'Thêm học sinh vào danh sách lớp',
            'Theo dõi tiến độ chung và phân phối học liệu',
        ],
        related: ['students', 'schedule', 'lessons'],
    },

    // 3. Giảng dạy
    {
        slug: 'schedule',
        name: 'Lịch dạy',
        tagline: 'Lịch trình thông minh, không lo trùng giờ hay quên ca',
        desc: 'Xem lịch tuần, lịch tháng trực quan, hỗ trợ xếp lịch lặp định kỳ và tự động cảnh báo xung đột giờ dạy.',
        icon: Calendar,
        group: 'teaching',
        type: 'action',
        keyBenefits: [
            'Giao diện lịch tuần trực quan với mã màu theo từng học sinh',
            'Cảnh báo xung đột giờ dạy ngay khi tạo lịch',
            'Hỗ trợ lặp lịch tự động theo tuần không cần nhập lại',
        ],
        systemMeaning: 'Lịch dạy là điểm khởi đầu của mỗi buổi học. Dữ liệu điểm danh từ lịch dạy trực tiếp nuôi sống module Tài Chính và Báo Cáo.',
        actionGuideTitle: 'Thao tác xếp lịch',
        actionGuideSteps: [
            'Chọn học sinh/lớp học và khung giờ mong muốn',
            'Bật chế độ lặp định kỳ cho các tuần kế tiếp',
            'Xác nhận lịch và theo dõi trạng thái buổi học',
        ],
        related: ['overview', 'students', 'lessons'],
    },
    {
        slug: 'documents',
        name: 'Tài Liệu',
        tagline: 'Kho tài liệu số hóa, tìm kiếm tức thì mọi giáo án',
        desc: 'Lưu trữ giáo trình, đề cương, file đề thi PDF/Word tập trung để chia sẻ nhanh chóng với học sinh.',
        icon: FolderArchive,
        group: 'teaching',
        type: 'action',
        keyBenefits: [
            'Phân loại tài liệu theo môn học và khối lớp',
            'Chia sẻ tài liệu trực tiếp cho học sinh mà không cần gửi link rời rạc',
            'Tìm kiếm nhanh tài liệu ngay trong lúc đang dạy',
        ],
        systemMeaning: 'Kho Tài Liệu giải phóng gia sư khỏi sự lộn xộn của Google Drive hay Zalo, đưa tài liệu vào đúng ngữ cảnh học tập của từng học sinh.',
        actionGuideTitle: 'Quản lý tài liệu',
        actionGuideSteps: [
            'Tải lên tài liệu giáo trình hoặc đề luyện tập',
            'Gắn nhãn môn học, khối lớp để phân loại',
            'Gán tài liệu cho học sinh hoặc đính kèm vào buổi dạy',
        ],
        related: ['lessons', 'exams', 'schedule'],
    },
    {
        slug: 'lessons',
        name: 'Bài Giảng',
        tagline: 'Soạn giáo án và bài giảng theo lộ trình chuẩn mực',
        desc: 'Tổ chức nội dung bài giảng theo từng chương mục, tích hợp tài nguyên đa phương tiện và phòng học trực tuyến.',
        icon: BookOpen,
        group: 'teaching',
        type: 'action',
        keyBenefits: [
            'Xây dựng lộ trình bài học theo từng chuyên đề rõ ràng',
            'Tích hợp phòng học online với bảng trắng và video trực tiếp',
            'Tái sử dụng bài giảng cho nhiều thế hệ học sinh',
        ],
        systemMeaning: 'Bài Giảng là nơi diễn ra hoạt động truyền tải kiến thức chính, gắn kết học liệu số và tương tác giảng dạy trong cùng một màn hình.',
        actionGuideTitle: 'Tổ chức bài giảng',
        actionGuideSteps: [
            'Tạo chuyên đề bài giảng và cấu trúc các buổi học',
            'Đính kèm bài tập và tài liệu tương ứng',
            'Mở bài giảng trong phòng học để giảng dạy tương tác',
        ],
        related: ['schedule', 'documents', 'exams'],
    },

    // 4. Đánh giá
    {
        slug: 'reports',
        name: 'Báo Cáo',
        tagline: 'Báo cáo học tập chuyên nghiệp, gửi phụ huynh tin cậy',
        desc: 'Tổng hợp số buổi học, điểm số bài tập và nhận xét có sự hỗ trợ của AI để xuất báo cáo PDF/hình ảnh đẹp mắt.',
        icon: BarChart3,
        group: 'assessment',
        type: 'view',
        keyBenefits: [
            'Tổng hợp tự động số buổi dạy và tỷ lệ chuyên cần',
            'AI gợi ý lời nhận xét sư phạm sắc bén, chuẩn tiếng Việt',
            'Xuất báo cáo định kỳ dạng PDF chuyên nghiệp gửi phụ huynh',
        ],
        systemMeaning: 'Báo Cáo là công cụ giữ chân phụ huynh hiệu quả nhất, biến nỗ lực giảng dạy thầm lặng của gia sư thành những tiến bộ nhìn thấy được.',
        related: ['students', 'exams', 'finance'],
    },
    {
        slug: 'exams',
        name: 'Khảo thí',
        tagline: 'Ngân hàng câu hỏi và chấm thi tự động chuẩn mực',
        desc: 'Tạo bài tập trắc nghiệm và tự luận, tự động thu bài khi hết hạn, chấm điểm tức thì và theo dõi tiến độ nộp bài.',
        icon: ClipboardCheck,
        group: 'assessment',
        type: 'action',
        keyBenefits: [
            'Hỗ trợ cả trắc nghiệm chấm tự động và tự luận chấm tay',
            'Cơ chế tự động thu bài khi hết hạn giúp rèn tính kỷ luật',
            'Thống kê phổ điểm và tỉ lệ hoàn thành của từng em',
        ],
        systemMeaning: 'Hệ thống Khảo thí cung cấp số liệu thực tế về năng lực học sinh, là cơ sở để gia sư điều chỉnh phương pháp dạy và đưa ra nhận xét chính xác.',
        actionGuideTitle: 'Quy trình tạo và chấm bài',
        actionGuideSteps: [
            'Tạo đề thi trắc nghiệm hoặc tự luận kèm hạn nộp',
            'Giao đề cho học sinh hoặc lớp học',
            'Theo dõi tiến độ làm bài và chấm điểm tự luận',
        ],
        related: ['lessons', 'reports', 'students'],
    },
];

export function getAllFeatures(): FeatureConfig[] {
    return FEATURES;
}

export function getFeatureBySlug(slug: string): FeatureConfig | undefined {
    return FEATURES.find((f) => f.slug === slug);
}

export function getFeaturesByGroup(group: FeatureGroup): FeatureConfig[] {
    return FEATURES.filter((f) => f.group === group);
}

export function getRelatedFeatures(slug: string): FeatureConfig[] {
    const feature = getFeatureBySlug(slug);
    if (!feature) return [];
    return feature.related
        .map((relSlug) => getFeatureBySlug(relSlug))
        .filter((f): f is FeatureConfig => Boolean(f));
}
