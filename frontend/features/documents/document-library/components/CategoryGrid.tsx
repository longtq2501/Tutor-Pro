
import type { DocumentCategory, Category } from '@/lib/types';
import { memo, useState } from 'react';
import { Trash2, Pencil, FileText } from 'lucide-react';
import { documentsApi } from '@/lib/services';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import { AnimatePresence, motion } from 'framer-motion';
import { CategoryFormModal } from './CategoryFormModal';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  categories: Category[];
  counts: Record<string, number>;
  onCategoryClick: (category: DocumentCategory) => void;
  onDeleteCategory?: (id: number) => void;
  isLoading?: boolean;
  loadMoreCategories?: () => void;
  hasMoreCategories?: boolean;
  isFetchingMoreCategories?: boolean;
}

const CategoryGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 w-full">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-muted animate-pulse rounded-xl h-[92px] lg:h-[116px] w-full" />
    ))}
  </div>
);

export const CategoryGrid = memo(({
  categories,
  counts,
  onCategoryClick,
  onDeleteCategory,
  isLoading,
  loadMoreCategories,
  hasMoreCategories,
  isFetchingMoreCategories
}: Props) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // CRUD State (Edit only, Add moved to parent)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Use dynamic categories from server
  const displayCategories = categories;

  const confirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    const deletePromise = async () => {
      if (onDeleteCategory) {
        onDeleteCategory(deleteId);
      } else {
        await documentsApi.deleteCategory(deleteId);
        // Invalidate query to trigger refresh without reload
        queryClient.invalidateQueries({ queryKey: [...queryKeys.documents.all, 'categories'] });
        queryClient.invalidateQueries({ queryKey: ['documents', 'stats'] });
      }
    };

    const promise = deletePromise();

    toast.promise(promise, {
      loading: 'Đang xóa danh mục...',
      success: `Đã xóa danh mục "${deleteName}"`,
      error: 'Không thể xóa danh mục này (có thể đang chứa tài liệu)'
    });

    try {
      await promise; // Wait for completion to update local state
    } catch {
      // Handled by toast
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleEditClick = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsFormOpen(true);
  };


  if (isLoading && categories.length === 0) {
    return <CategoryGridSkeleton />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        <AnimatePresence mode="popLayout">
          {displayCategories.map((cat: Category) => {
            const code = cat.code;
            const name = cat.name;
            const icon = <FileText className="w-6 h-6 lg:w-8 lg:h-8" />;
            const color = cat.color || '';
            const count = counts?.[code] || 0;
            const isDynamic = !!cat.id;

            // Fallback gradient if no color set
            const bgClass = color ? '' : 'bg-gradient-to-r from-blue-500 to-blue-600';

            return (
              <motion.div
                key={code}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative group"
              >
                <button
                  onClick={() => onCategoryClick(code as DocumentCategory)}
                  className={`w-full ${bgClass} text-white rounded-xl p-4 lg:p-6 text-left hover:shadow-lg transition-all transform hover:scale-[1.02] will-change-transform contain-layout`}
                  style={color ? { backgroundColor: color } : {}}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
                      <div className="shrink-0 p-2 lg:p-3 bg-white/20 rounded-xl backdrop-blur-md">
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm lg:text-lg truncate">{name}</h3>
                        <p className="text-white/80 text-[10px] lg:text-sm truncate">{count} tài liệu</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-3 bg-white/20 rounded-lg px-2 lg:px-3 py-1">
                      <span className="text-xs lg:text-sm font-medium">{count}</span>
                    </div>
                  </div>
                </button>

                {isDynamic && !isStudent && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => handleEditClick(e, cat)}
                      className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, cat.id, name)}
                      className="p-1.5 bg-black/20 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-sm"
                      title="Xóa danh mục"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}

        </AnimatePresence>
      </div>

      {hasMoreCategories && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => loadMoreCategories?.()}
            disabled={isFetchingMoreCategories}
            className="px-6 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isFetchingMoreCategories ? 'Đang tải...' : 'Xem thêm danh mục'}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa danh mục?"
        description={`Bạn có chắc chắn muốn xóa danh mục "${deleteName}" ? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn danh mục khỏi hệ thống.`}
        confirmText={isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
        variant="destructive"
      />

      <CategoryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingCategory}
      />
    </>
  );
});

CategoryGrid.displayName = 'CategoryGrid';