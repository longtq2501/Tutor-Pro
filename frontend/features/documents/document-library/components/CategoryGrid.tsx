import type { DocumentCategory, Category } from '@/lib/types';
import { memo, useState } from 'react';
import { CATEGORIES } from '../constants';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { documentsApi } from '@/lib/services';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import { AnimatePresence, motion } from 'framer-motion';
import { CategoryFormModal } from './CategoryFormModal';

interface Props {
  categories: any[];
  counts: Record<string, number>;
  onCategoryClick: (category: DocumentCategory) => void;
  onDeleteCategory?: (id: number) => void;
  isLoading?: boolean;
}

const CategoryGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 w-full">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-muted animate-pulse rounded-xl h-[92px] lg:h-[116px] w-full" />
    ))}
  </div>
);

export const CategoryGrid = memo(({ categories, counts, onCategoryClick, onDeleteCategory, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // CRUD State
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
    } catch (e) {
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

  const handleEditClick = (e: React.MouseEvent, category: any) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  if (isLoading && categories.length === 0) {
    return <CategoryGridSkeleton />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        <AnimatePresence mode="popLayout">
          {displayCategories.map((cat: any) => {
            const code = cat.code || cat;
            const name = cat.name || cat;
            const visual = CATEGORIES.find(c => c.key === code) || {
              icon: cat.icon || '📁',
              key: code
            };
            const icon = cat.icon || visual.icon || '📁';
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <span className="text-2xl lg:text-3xl">{icon}</span>
                      <div>
                        <h3 className="font-bold text-sm lg:text-lg truncate">{name}</h3>
                        <p className="text-white/80 text-[10px] lg:text-sm">{count} tài liệu</p>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-2 lg:px-3 py-1">
                      <span className="text-xs lg:text-sm font-medium">{count}</span>
                    </div>
                  </div>
                </button>

                {isDynamic && (
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

          {/* Add Category Button Card */}
          <motion.button
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleAddClick}
            className="w-full h-full min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-4 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all gap-2"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-primary/20">
              <Plus size={24} />
            </div>
            <span className="font-medium text-sm">Thêm danh mục mới</span>
          </motion.button>
        </AnimatePresence>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa danh mục?"
        description={`Bạn có chắc chắn muốn xóa danh mục "${deleteName}"? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn danh mục khỏi hệ thống.`}
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