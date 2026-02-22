'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, MapPin, Award, User, GraduationCap, FileText, Clock, Ban, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { tutorsApi } from '@/lib/services/tutor';
import type { Tutor } from '@/lib/types/tutor';
import type { Student } from '@/lib/types/student';
import type { SessionRecord, DocumentDTO } from '@/lib/types/finance';
import { toast } from 'sonner';

interface TutorDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    tutor: Tutor | null;
}

export function TutorDetailDrawer({ isOpen, onClose, tutor }: TutorDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState('info');
    const [data, setData] = useState<(Student | SessionRecord | DocumentDTO)[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !tutor || activeTab === 'info') return;

        const fetchData = async () => {
            setLoading(true);
            try {
                let result;
                if (activeTab === 'students') {
                    result = await tutorsApi.getStudents(tutor.id);
                } else if (activeTab === 'schedule') {
                    result = await tutorsApi.getSessions(tutor.id);
                } else if (activeTab === 'docs') {
                    result = await tutorsApi.getDocuments(tutor.id);
                }
                setData(result?.content || []);
            } catch (error) {
                console.error(`Failed to fetch ${activeTab}:`, error);
                toast.error('Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, isOpen, tutor]);

    const handleToggleStatus = async () => {
        if (!tutor) return;
        try {
            await tutorsApi.toggleStatus(tutor.id);
            toast.success('Đã thay đổi trạng thái tài khoản');
            onClose();
        } catch (error) {
            toast.error('Thao tác thất bại');
        }
    };

    if (!tutor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

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
                                    {tutor.fullName.split(' ').map((n: string) => n[0]).join('')}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h2 className="text-2xl font-black text-[var(--admin-text)] tracking-tight">{tutor.fullName}</h2>
                                    <div className="flex items-center justify-center gap-2">
                                        {tutor.subscriptionPlan === 'PRO' ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-violet-400 border border-violet-500/30">PRO TIER</span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20">FREE TIER</span>
                                        )}
                                        <span className="w-1 h-1 rounded-full bg-[var(--admin-text3)]" />
                                        <span className={`text-[10px] font-bold ${tutor.subscriptionStatus === 'ACTIVE' ? 'text-[var(--admin-green)]' : 'text-[var(--admin-red)]'} uppercase tracking-widest`}>
                                            {tutor.subscriptionStatus}
                                        </span>
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
                            {activeTab === 'info' ? (
                                <div className="flex flex-col gap-8">
                                    <div className="grid grid-cols-1 gap-6">
                                        <InfoItem icon={Mail} label="Email" value={tutor.email} />
                                        <InfoItem icon={Phone} label="Số điện thoại" value={tutor.phone} />
                                        <InfoItem icon={Calendar} label="Ngày tham gia" value={new Date(tutor.createdAt).toLocaleDateString()} />
                                        <InfoItem icon={MapPin} label="Địa chỉ" value="N/A" />
                                        <InfoItem icon={Award} label="Chuyên môn" value="N/A" />
                                    </div>
                                </div>
                            ) : loading ? (
                                <div className="flex items-center justify-center h-40 text-xs text-[var(--admin-text3)]">Đang tải dữ liệu...</div>
                            ) : data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-center gap-2 opacity-40">
                                    <div className="p-3 bg-[var(--admin-surface2)] rounded-full">
                                        <X className="h-5 w-5 text-[var(--admin-text3)]" />
                                    </div>
                                    <p className="text-xs font-bold text-[var(--admin-text2)]">Không có dữ liệu</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {activeTab === 'students' && (data as Student[]).map((s) => (
                                        <div key={s.id} className="p-4 bg-[var(--admin-surface2)]/50 rounded-xl border border-[var(--admin-border)] flex items-center justify-between">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-[var(--admin-text)]">{s.name}</span>
                                                <span className="text-[10px] text-[var(--admin-text3)] uppercase tracking-wider">{s.schedule}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${s.active ? 'bg-[var(--admin-green)]/10 text-[var(--admin-green)]' : 'bg-red-500/10 text-red-500'}`}>
                                                {s.active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </div>
                                    ))}
                                    {activeTab === 'schedule' && (data as SessionRecord[]).map((s) => (
                                        <div key={s.id} className="p-4 bg-[var(--admin-surface2)]/50 rounded-xl border border-[var(--admin-border)] flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-[var(--admin-text)]">{s.studentName}</span>
                                                <span className="text-[10px] font-medium text-[var(--admin-text3)]">{s.sessionDate}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-[var(--admin-accent)] uppercase">{s.subject}</span>
                                                <span className="text-[10px] text-[var(--admin-text3)]">{s.hours} giờ</span>
                                            </div>
                                        </div>
                                    ))}
                                    {activeTab === 'docs' && (data as DocumentDTO[]).map((d) => (
                                        <div key={d.id} className="p-4 bg-[var(--admin-surface2)]/50 rounded-xl border border-[var(--admin-border)] flex items-center gap-4">
                                            <div className="p-2 bg-[var(--admin-surface)] rounded-lg text-[var(--admin-accent)]">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                                                <span className="text-sm font-bold text-[var(--admin-text)] truncate">{d.title}</span>
                                                <span className="text-[10px] text-[var(--admin-text3)]">{(d.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-[var(--admin-surface2)]/50 border-t border-[var(--admin-border)] flex gap-3">
                            <button
                                onClick={handleToggleStatus}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 ${tutor.subscriptionStatus === 'ACTIVE' ? 'bg-[var(--admin-red)] shadow-red-500/20' : 'bg-[var(--admin-green)] shadow-green-500/20'} text-[var(--admin-bg)] text-xs font-black rounded-xl hover:opacity-90 transition-all shadow-lg`}
                            >
                                {tutor.subscriptionStatus === 'ACTIVE' ? (
                                    <>
                                        <Ban className="h-4 w-4" />
                                        <span>KHOÁ TÀI KHOẢN</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>MỞ KHOÁ</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
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
