'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, MapPin, Award, User, GraduationCap, FileText, Clock } from 'lucide-react';
import { useState } from 'react';

interface TutorDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    tutor: any;
}

export function TutorDetailDrawer({ isOpen, onClose, tutor }: TutorDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState('info');

    if (!tutor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full max-w-[480px] bg-[var(--admin-surface)] border-l border-[var(--admin-border)] z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-[var(--admin-border)] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface2)] rounded-xl transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex flex-col items-center text-center gap-4 mt-4">
                                <div className="w-24 h-24 rounded-3xl bg-[var(--admin-accent-dim)] border-2 border-[var(--admin-accent)]/30 flex items-center justify-center text-[var(--admin-accent)] text-3xl font-black shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                    {tutor.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h2 className="text-2xl font-black text-[var(--admin-text)] tracking-tight">{tutor.name}</h2>
                                    <div className="flex items-center justify-center gap-2">
                                        {tutor.tier === 'PRO' ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-violet-400 border border-violet-500/30">PRO TIER</span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20">FREE TIER</span>
                                        )}
                                        <span className="w-1 h-1 rounded-full bg-[var(--admin-text3)]" />
                                        <span className="text-[10px] font-bold text-[var(--admin-green)] uppercase tracking-widest">{tutor.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-[var(--admin-border)] bg-[var(--admin-surface2)]/30 p-1 mx-6 mt-6 rounded-xl">
                            {[
                                { id: 'info', label: 'Thông tin', icon: User },
                                { id: 'students', label: 'Học sinh', icon: GraduationCap },
                                { id: 'schedule', label: 'Lịch dạy', icon: Clock },
                                { id: 'docs', label: 'Tài liệu', icon: FileText },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${activeTab === tab.id
                                            ? 'bg-[var(--admin-surface)] text-[var(--admin-accent)] shadow-sm'
                                            : 'text-[var(--admin-text3)] hover:text-[var(--admin-text2)]'
                                        }`}
                                >
                                    <tab.icon className="h-3.5 w-3.5" />
                                    <span className="uppercase tracking-wider">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {activeTab === 'info' && (
                                <div className="flex flex-col gap-8">
                                    <div className="grid grid-cols-1 gap-6">
                                        <InfoItem icon={Mail} label="Email" value={tutor.email} />
                                        <InfoItem icon={Phone} label="Số điện thoại" value="+84 912 345 678" />
                                        <InfoItem icon={Calendar} label="Ngày tham gia" value={tutor.joined} />
                                        <InfoItem icon={MapPin} label="Địa chỉ" value="Quận Cầu Giấy, Hà Nội" />
                                        <InfoItem icon={Award} label="Chuyên môn" value="Toán học, Vật lý" />
                                    </div>

                                    <div className="p-4 bg-[var(--admin-accent-dim)] rounded-2xl border border-[var(--admin-accent)]/10">
                                        <p className="text-[11px] font-medium text-[var(--admin-accent)] leading-relaxed">
                                            Gia sư này đã hoàn thành 124 giờ dạy trong tháng này và có tỉ lệ hài lòng từ học sinh đạt 98%.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'info' && (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20 opacity-40">
                                    <div className="p-4 bg-[var(--admin-surface2)] rounded-full">
                                        <Clock className="h-8 w-8 text-[var(--admin-text3)]" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-bold text-[var(--admin-text2)]">Tính năng đang phát triển</p>
                                        <p className="text-xs text-[var(--admin-text3)]">Dữ liệu chi tiết sẽ được cập nhật trong phiên bản tiếp theo.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-[var(--admin-surface2)]/50 border-t border-[var(--admin-border)] flex gap-3">
                            <button className="flex-1 py-3 bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-xs font-bold rounded-xl hover:bg-[var(--admin-surface3)] transition-all">
                                CHỈNH SỬA
                            </button>
                            <button className="flex-1 py-3 bg-[var(--admin-red)] text-[var(--admin-bg)] text-xs font-black rounded-xl hover:opacity-90 transition-all shadow-lg shadow-red-500/20">
                                KHOÁ TÀI KHOẢN
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-2 bg-[var(--admin-surface2)] rounded-xl text-[var(--admin-text3)] mt-0.5">
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[var(--admin-text3)] uppercase tracking-widest">{label}</span>
                <span className="text-sm font-bold text-[var(--admin-text2)]">{value}</span>
            </div>
        </div>
    );
}
