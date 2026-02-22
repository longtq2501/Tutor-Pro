'use client';

import { Eye, Edit2, MoreHorizontal } from 'lucide-react';

const tutors = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vanna@gmail.com', students: 12, tier: 'PRO', status: 'Active' },
    { id: 2, name: 'Trần Thị B', email: 'thib@gmail.com', students: 8, tier: 'FREE', status: 'Inactive' },
    { id: 3, name: 'Lê Hoàng C', email: 'hoangc@gmail.com', students: 25, tier: 'PRO', status: 'Active' },
    { id: 4, name: 'Phạm Minh D', email: 'minhd@gmail.com', students: 5, tier: 'FREE', status: 'Suspended' },
    { id: 5, name: 'Hoàng Anh E', email: 'anhe@gmail.com', students: 18, tier: 'PRO', status: 'Active' },
];

const getAvatarColor = (name: string) => {
    const colors = [
        'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'bg-amber-500/20 text-amber-400 border-amber-500/30',
        'bg-rose-500/20 text-rose-400 border-rose-500/30',
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
};

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'Active': return { dot: 'bg-[var(--admin-green)]', text: 'text-[var(--admin-green)]', label: 'Hoạt động' };
        case 'Inactive': return { dot: 'bg-[var(--admin-text3)]', text: 'text-[var(--admin-text3)]', label: 'Ngoại tuyến' };
        case 'Suspended': return { dot: 'bg-[var(--admin-red)]', text: 'text-[var(--admin-red)]', label: 'Đã khoá' };
        default: return { dot: 'bg-gray-500', text: 'text-gray-500', label: status };
    }
};

export function RecentTutors() {
    return (
        <div className="flex-1 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[var(--admin-border)] flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-[var(--admin-text)]">Gia Sư Mới</h3>
                    <p className="text-xs text-[var(--admin-text3)] uppercase tracking-widest font-medium">Danh sách đăng ký gần đây</p>
                </div>
                <button className="p-2 hover:bg-[var(--admin-surface2)] rounded-lg transition-colors text-[var(--admin-text3)]">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--admin-surface2)]/50">
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--admin-text3)] uppercase tracking-widest">Gia Sư</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--admin-text3)] uppercase tracking-widest">Học Sinh</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--admin-text3)] uppercase tracking-widest">Tier</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--admin-text3)] uppercase tracking-widest">Trạng Thái</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--admin-text3)] uppercase tracking-widest text-right">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--admin-border)]">
                        {tutors.map((tutor) => {
                            const status = getStatusStyles(tutor.status);
                            const avatarStyle = getAvatarColor(tutor.name);

                            return (
                                <tr key={tutor.id} className="group hover:bg-[var(--admin-surface2)]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-xs ${avatarStyle}`}>
                                                {tutor.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[var(--admin-text)] group-hover:text-[var(--admin-accent)] transition-colors">{tutor.name}</span>
                                                <span className="text-[11px] text-[var(--admin-text3)]">{tutor.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-[var(--admin-text2)]">{tutor.students}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {tutor.tier === 'PRO' ? (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-violet-400 border border-violet-500/30">PRO</span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20">FREE</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                            <span className={`text-[11px] font-medium ${status.text}`}>{status.label}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface3)] rounded-lg transition-all">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface3)] rounded-lg transition-all">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
