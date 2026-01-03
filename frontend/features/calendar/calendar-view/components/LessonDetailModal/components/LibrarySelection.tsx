import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, Search } from 'lucide-react';
import { useRef } from 'react';

interface LibrarySelectionProps {
    activeTab: 'lessons' | 'documents';
    setActiveTab: (tab: 'lessons' | 'documents') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    categories: string[];
    filteredItems: any[];
    selectedLessonIds: Set<number>;
    selectedDocumentIds: Set<number>;
    currentTabSelectedCount: number;
    toggleSelection: (id: number) => void;
    getCategoryName: (item: any) => string;
}

export function LibrarySelection({
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredItems,
    selectedLessonIds,
    selectedDocumentIds,
    currentTabSelectedCount,
    toggleSelection,
    getCategoryName
}: LibrarySelectionProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: filteredItems.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70,
        overscan: 5,
    });

    return (
        <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="grid grid-cols-3 gap-3 p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                <div className="text-center">
                    <div className="text-xl font-black text-primary">
                        {categories.length}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-bold">Tổng mục</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-black text-primary">
                        {filteredItems.length}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-bold">Tìm thấy</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-black text-primary">
                        {currentTabSelectedCount}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-bold">Đã chọn</div>
                </div>
            </div>

            <div className="flex gap-1 p-1 bg-muted/30 rounded-xl">
                <button
                    type="button"
                    onClick={() => setActiveTab('lessons')}
                    className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2",
                        activeTab === 'lessons'
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    📖 Kho bài giảng
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className={cn(
                        "flex-1 px-4 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2",
                        activeTab === 'documents'
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    📄 Kho tài liệu
                </button>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input
                        type="text"
                        placeholder={`Tìm kiếm...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-border/60 rounded-lg focus:border-primary focus:outline-none bg-background text-xs font-medium transition-all"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border/60 rounded-lg focus:border-primary bg-background text-[10px] font-bold outline-none cursor-pointer"
                >
                    <option value="recent">Mới nhất</option>
                    <option value="name">Tên A-Z</option>
                </select>
            </div>

            {categories.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all",
                                selectedCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                        >
                            {cat === 'all' ? 'Tất cả' : cat}
                        </button>
                    ))}
                </div>
            )}

            <div
                ref={parentRef}
                className="h-[320px] overflow-auto border border-border/60 rounded-xl bg-muted/20 no-scrollbar"
            >
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                        <Search size={40} className="mb-3 opacity-30" />
                        <p className="text-sm font-medium">Không tìm thấy kết quả</p>
                    </div>
                ) : (
                    <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                        {virtualizer.getVirtualItems().map((v: any) => {
                            const item = filteredItems[v.index];
                            const isSelected = activeTab === 'lessons'
                                ? selectedLessonIds.has(Number(item.id))
                                : selectedDocumentIds.has(Number(item.id));

                            return (
                                <div
                                    key={v.key}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        transform: `translateY(${v.start}px)`,
                                        padding: '4px 8px'
                                    }}
                                >
                                    <div
                                        onClick={() => toggleSelection(Number(item.id))}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all group",
                                            isSelected
                                                ? "bg-primary/10 border-primary shadow-sm"
                                                : "bg-card border-transparent hover:border-primary/30 hover:shadow-sm"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0",
                                            isSelected
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "border-border group-hover:border-primary"
                                        )}>
                                            {isSelected && <Check size={14} strokeWidth={3} />}
                                        </div>
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-lg shrink-0 shadow-sm">
                                            {activeTab === 'lessons' ? '📖' : '📄'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-xs truncate mb-0.5">{item.title}</h5>
                                            <div className="text-[10px] text-muted-foreground">📁 {getCategoryName(item)}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
