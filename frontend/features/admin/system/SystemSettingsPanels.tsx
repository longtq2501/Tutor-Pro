'use client';

import { Save, Globe, DollarSign, Shield, Mail, Percent } from 'lucide-react';

export function SystemSettingsPanels() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    <div className="px-6 py-4 bg-[var(--admin-surface2)]/50 border-b border-[var(--admin-border)] flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Globe className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-sm font-black text-[var(--admin-text)] uppercase tracking-wider">Cài Đặt Chung</h3>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Tên Nền Tảng</label>
                            <input
                                type="text"
                                defaultValue="Tutor Pro"
                                className="w-full h-10 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl px-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Email Hỗ Trợ</label>
                            <input
                                type="email"
                                defaultValue="support@tutorpro.edu.vn"
                                className="w-full h-10 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl px-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl mt-2">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-[var(--admin-text)]">Chế độ bảo trì</span>
                                <span className="text-[10px] text-[var(--admin-text3)]">Tạm dừng truy cập người dùng</span>
                            </div>
                            <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Finance Settings */}
                <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    <div className="px-6 py-4 bg-[var(--admin-surface2)]/50 border-b border-[var(--admin-border)] flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-black text-[var(--admin-text)] uppercase tracking-wider">Cấu Hình Tài Chính</h3>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Chiết Khấu Hệ Thống (%)</label>
                            <div className="relative">
                                <Percent className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--admin-text3)]" />
                                <input
                                    type="number"
                                    defaultValue="15"
                                    className="w-full h-10 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl px-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Hạn Mức Rút Tiền Tối Thiểu</label>
                            <input
                                type="text"
                                defaultValue="500,000"
                                className="w-full h-10 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl px-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Chu Kỳ Quyết Toán</label>
                            <select className="w-full h-10 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl px-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all">
                                <option>Hàng tuần (Thứ 2)</option>
                                <option>Hàng tháng (Ngày 1)</option>
                                <option>Tức thì sau mỗi buổi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security & Auth */}
                <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl overflow-hidden shadow-xl shadow-black/20 lg:col-span-2">
                    <div className="px-6 py-4 bg-[var(--admin-surface2)]/50 border-b border-[var(--admin-border)] flex items-center gap-3">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <Shield className="h-5 w-5 text-violet-400" />
                        </div>
                        <h3 className="text-sm font-black text-[var(--admin-text)] uppercase tracking-wider">Bảo Mật & Xác Thực</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Xác Thực 2 Bước (2FA)</label>
                            <select className="w-full h-10 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl px-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all">
                                <option>Bắt buộc cho Admin/Gia sư</option>
                                <option>Không bắt buộc</option>
                                <option>Bắt buộc cho tất cả</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Duyệt Gia Sư Tự Động</label>
                            <div className="flex items-center gap-3 h-10">
                                <div className="w-10 h-5 bg-[var(--admin-accent)]/80 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
                                </div>
                                <span className="text-xs text-[var(--admin-text2)] font-medium">Bật</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-[var(--admin-text3)] uppercase tracking-widest px-1">Thời Gian Hết Hạn Token</label>
                            <select className="w-full h-10 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl px-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all">
                                <option>7 Ngày</option>
                                <option>30 Ngày</option>
                                <option>24 Giờ</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button className="px-6 py-2.5 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] transition-all">
                    HUỶ THAY ĐỔI
                </button>
                <button className="flex items-center gap-2 px-8 py-2.5 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-xl text-xs font-black shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-all">
                    <Save className="h-4 w-4" />
                    <span>LƯU CẤU HÌNH</span>
                </button>
            </div>
        </div>
    );
}
