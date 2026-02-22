'use client';

import { useState } from 'react';
import {
    FileText,
    FileImage,
    File as FileIcon,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Download,
    MoreVertical,
    Clock,
    User,
    HardDrive
} from 'lucide-react';

const initialDocs = [
    { id: 1, name: 'Toan_12_Nang_Cao.pdf', type: 'pdf', size: '4.2 MB', uploader: 'Nguyễn Văn A', date: '2024-02-20', status: 'Pending' },
    { id: 2, name: 'De_Cuong_On_Tap.docx', type: 'doc', size: '1.5 MB', uploader: 'Trần Thị B', date: '2024-02-21', status: 'Approved' },
    { id: 3, name: 'Sodo_Tu_Duy.png', type: 'img', size: '2.8 MB', uploader: 'Lê Hoàng C', date: '2024-02-18', status: 'Approved' },
    { id: 4, name: 'Bai_Tap_Vat_Ly.pdf', type: 'pdf', size: '3.1 MB', uploader: 'Phạm Minh D', date: '2024-02-22', status: 'Pending' },
    { id: 5, name: 'Giao_An_Tieng_Anh.pdf', type: 'pdf', size: '5.4 MB', uploader: 'Hoàng Anh E', date: '2024-02-19', status: 'Rejected' },
    { id: 6, name: 'Ky_Nang_Mem.pdf', type: 'pdf', size: '1.2 MB', uploader: 'Đặng Quốc F', date: '2024-02-15', status: 'Approved' },
];

export function DocumentsGrid() {
    const [docs, setDocs] = useState(initialDocs);
    const [searchTerm, setSearchTerm] = useState('');

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="h-10 w-10 text-rose-500" />;
            case 'img': return <FileImage className="h-10 w-10 text-emerald-500" />;
            case 'doc': return <FileIcon className="h-10 w-10 text-blue-500" />;
            default: return <FileIcon className="h-10 w-10 text-slate-500" />;
        }
    };

    const updateStatus = (id: number, status: string) => {
        setDocs(docs.map(doc => doc.id === id ? { ...doc, status } : doc));
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] transition-all">
                        <Filter className="h-4 w-4" />
                        <span>Lọc loại file</span>
                    </button>
                </div>

                <div className="flex items-center gap-4 text-[var(--admin-text3)] text-xs font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--admin-amber)]" />
                        <span>{docs.filter(d => d.status === 'Pending').length} Chờ duyệt</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {docs.map((doc) => (
                    <div key={doc.id} className="group relative bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6 flex flex-col gap-6 hover:border-[var(--admin-accent)]/50 transition-all duration-300">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 group-hover:opacity-0 transition-opacity">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${doc.status === 'Approved' ? 'bg-[var(--admin-green)]/10 text-[var(--admin-green)] border border-[var(--admin-green)]/20' :
                                    doc.status === 'Pending' ? 'bg-[var(--admin-amber)]/10 text-[var(--admin-amber)] border border-[var(--admin-amber)]/20' :
                                        'bg-[var(--admin-red)]/10 text-[var(--admin-red)] border border-[var(--admin-red)]/20'
                                }`}>
                                {doc.status}
                            </span>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            {doc.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(doc.id, 'Approved')}
                                        className="p-1.5 bg-[var(--admin-green)] text-[var(--admin-bg)] rounded-lg hover:scale-110 transition-transform"
                                        title="Duyệt"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(doc.id, 'Rejected')}
                                        className="p-1.5 bg-[var(--admin-red)] text-[var(--admin-bg)] rounded-lg hover:scale-110 transition-transform"
                                        title="Từ chối"
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                            <button className="p-1.5 bg-[var(--admin-surface2)] text-[var(--admin-text2)] rounded-lg hover:text-[var(--admin-text)] transition-colors">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Icon & Name */}
                        <div className="flex flex-col items-center text-center gap-4 mt-2">
                            <div className="p-6 bg-[var(--admin-surface2)] rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                {getFileIcon(doc.type)}
                            </div>
                            <div className="flex flex-col gap-1 w-full px-2">
                                <h4 className="text-sm font-bold text-[var(--admin-text)] truncate" title={doc.name}>{doc.name}</h4>
                                <div className="flex items-center justify-center gap-2 text-[var(--admin-text3)] text-[10px] font-medium uppercase">
                                    <span>{doc.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-[var(--admin-text3)]" />
                                    <span>{doc.size}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="pt-4 border-t border-[var(--admin-border)] flex flex-col gap-3">
                            <div className="flex items-center justify-between text-[11px] font-medium">
                                <div className="flex items-center gap-2 text-[var(--admin-text3)]">
                                    <User className="h-3.5 w-3.5" />
                                    <span>Uploader</span>
                                </div>
                                <span className="text-[var(--admin-text2)]">{doc.uploader}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-medium">
                                <div className="flex items-center gap-2 text-[var(--admin-text3)]">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Ngày tải</span>
                                </div>
                                <span className="text-[var(--admin-text2)]">{doc.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
