'use client';

import { useState, useEffect } from 'react';
import {
    FileText,
    FileImage,
    File as FileIcon,
    Search,
    Filter,
    Download,
    Clock,
    User,
    Trash2
} from 'lucide-react';
import { adminDocumentsApi } from '@/lib/services/admin-documents';
import type { AdminDocument } from '@/lib/types/admin';
import { toast } from 'sonner';

export function DocumentsGrid() {
    const [docs, setDocs] = useState<AdminDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const data = await adminDocumentsApi.getAll(page, 12, searchTerm);
            setDocs(data.content);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
            toast.error('Không thể tải danh sách tài liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, [page, searchTerm]);

    const getFileIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('pdf')) return <FileText className="h-10 w-10 text-rose-500" />;
        if (t.includes('image') || t.includes('png') || t.includes('jpg')) return <FileImage className="h-10 w-10 text-emerald-500" />;
        if (t.includes('word') || t.includes('doc')) return <FileIcon className="h-10 w-10 text-blue-500" />;
        return <FileIcon className="h-10 w-10 text-slate-500" />;
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này? Thao tác này không thể hoàn tác.')) return;
        try {
            await adminDocumentsApi.delete(id);
            toast.success('Đã xóa tài liệu');
            fetchDocs();
        } catch (error) {
            toast.error('Xóa tài liệu thất bại');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Actions & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--admin-text3)]" />
                        <input
                            type="text"
                            placeholder="Tìm tên tài liệu..."
                            className="w-full h-10 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl pl-10 pr-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-60 text-xs text-[var(--admin-text3)]">Đang tải tài liệu...</div>
            ) : docs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center gap-2 opacity-40">
                    <FileIcon className="h-12 w-12 text-[var(--admin-text3)]" />
                    <p className="text-sm font-bold text-[var(--admin-text2)]">Không tìm thấy tài liệu</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {docs.map((doc) => (
                        <div key={doc.id} className="group relative bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6 flex flex-col gap-6 hover:border-[var(--admin-accent)]/50 transition-all duration-300">
                            {/* Hover Actions */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-1.5 bg-[var(--admin-red)] text-[var(--admin-bg)] rounded-lg hover:scale-110 transition-transform"
                                    title="Xóa tài liệu"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Icon & Name */}
                            <div className="flex flex-col items-center text-center gap-4 mt-2">
                                <div className="p-6 bg-[var(--admin-surface2)] rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                    {getFileIcon(doc.fileType)}
                                </div>
                                <div className="flex flex-col gap-1 w-full px-2">
                                    <h4 className="text-sm font-bold text-[var(--admin-text)] truncate" title={doc.title}>{doc.title}</h4>
                                    <div className="flex items-center justify-center gap-2 text-[var(--admin-text3)] text-[10px] font-medium uppercase">
                                        <span>{doc.fileType}</span>
                                        <span className="w-1 h-1 rounded-full bg-[var(--admin-text3)]" />
                                        <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="pt-4 border-t border-[var(--admin-border)] flex flex-col gap-3">
                                <div className="flex items-center justify-between text-[11px] font-medium">
                                    <div className="flex items-center gap-2 text-[var(--admin-text3)]">
                                        <User className="h-3.5 w-3.5" />
                                        <span>Gia sư</span>
                                    </div>
                                    <span className="text-[var(--admin-text2)]">{doc.tutorName}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-medium">
                                    <div className="flex items-center gap-2 text-[var(--admin-text3)]">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Ngày tải</span>
                                    </div>
                                    <span className="text-[var(--admin-text2)]">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-medium">
                                    <div className="flex items-center gap-2 text-[var(--admin-text3)]">
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Lượt tải</span>
                                    </div>
                                    <span className="text-[var(--admin-text2)]">{doc.downloadCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
