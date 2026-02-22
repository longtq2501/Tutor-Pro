'use client';

import {
    UserPlus,
    Crown,
    FileUp,
    Lock,
    CreditCard
} from 'lucide-react';

const activities = [
    {
        id: 1,
        type: 'register',
        text: 'Gia sư Nguyễn Văn A vừa đăng ký mới',
        time: '2 phút trước',
        icon: UserPlus,
        color: 'var(--admin-green)'
    },
    {
        id: 2,
        type: 'upgrade',
        text: 'Lê Hoàng C vừa nâng cấp gói PRO',
        time: '15 phút trước',
        icon: Crown,
        color: 'var(--admin-accent)'
    },
    {
        id: 3,
        type: 'document',
        text: 'Tài liệu "Toán 12 nâng cao" được tải lên',
        time: '1 giờ trước',
        icon: FileUp,
        color: 'var(--admin-accent)'
    },
    {
        id: 4,
        type: 'ban',
        text: 'Tài khoản Phạm Minh D bị tạm khoá',
        time: '3 giờ trước',
        icon: Lock,
        color: 'var(--admin-red)'
    },
    {
        id: 5,
        type: 'payment',
        text: 'Thanh toán hoá đơn #INV-2024-001 thành công',
        time: 'Hôm qua',
        icon: CreditCard,
        color: 'var(--admin-green)'
    },
];

export function ActivityFeed() {
    return (
        <div className="flex-1 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[var(--admin-border)]">
                <h3 className="text-lg font-bold text-[var(--admin-text)]">Hoạt Động Gần Đây</h3>
                <p className="text-xs text-[var(--admin-text3)] uppercase tracking-widest font-medium">Nhật ký hệ thống</p>
            </div>

            <div className="flex flex-col flex-1 divide-y divide-[var(--admin-border)]">
                {activities.map((activity) => (
                    <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-[var(--admin-surface2)]/30 transition-colors group">
                        <div
                            className="p-2 rounded-lg bg-[var(--admin-surface2)] group-hover:scale-110 transition-transform"
                            style={{ color: activity.color }}
                        >
                            <activity.icon className="h-4 w-4" />
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <p className="text-xs font-medium text-[var(--admin-text2)] leading-tight">
                                {activity.text}
                            </p>
                            <span className="text-[10px] text-[var(--admin-text3)] font-medium">
                                {activity.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-[var(--admin-border)] bg-[var(--admin-surface2)]/30">
                <button className="w-full text-[10px] font-bold text-[var(--admin-accent)] hover:text-[var(--admin-accent)]/80 uppercase tracking-widest transition-colors">
                    Xem tất cả hoạt động
                </button>
            </div>
        </div>
    );
}
