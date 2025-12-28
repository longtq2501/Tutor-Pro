'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Loader2, BookOpen, FileText, Edit, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type {
  LessonDTO,
  LessonLibraryDTO,
  LessonFormMode,
  LessonFormData,
} from '../types';
import { formatDateForBackend, parseDateFromBackend } from '../types';
import { CloudinaryUploader } from './CloudinaryUploader';
import { useLessonCategories } from '../hooks/useLessonCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema validation dựa trên Backend DTOs
const createLessonFormSchema = (mode: LessonFormMode) => {
  const baseSchema = {
    tutorName: z
      .string()
      .min(1, 'Tên giáo viên không được để trống')
      .max(100, 'Tên giáo viên không được vượt quá 100 ký tự'),
    title: z
      .string()
      .min(1, 'Tiêu đề không được để trống')
      .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
    summary: z
      .string()
      .max(500, 'Tóm tắt không được vượt quá 500 ký tự')
      .optional(),
    content: z
      .string()
      .min(10, 'Nội dung phải có ít nhất 10 ký tự')
      .max(50000, 'Nội dung không được vượt quá 50,000 ký tự'),
    videoUrl: z
      .string()
      .optional()
      .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
        message: 'URL video không hợp lệ',
      }),
    thumbnailUrl: z
      .string()
      .optional()
      .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
        message: 'URL thumbnail không hợp lệ',
      }),
    isPublished: z.boolean(),
    categoryId: z.string().optional().nullable(),
  };

  // Library mode không bắt buộc lessonDate (vì sẽ tự động dùng ngày hiện tại)
  if (mode === 'library') {
    return z.object({
      ...baseSchema,
      lessonDate: z.date().optional().nullable(),
    });
  }

  // Create và Edit mode bắt buộc lessonDate
  return z.object({
    ...baseSchema,
    lessonDate: z.date().nullable(),
  }).refine((data) => data.lessonDate !== null && data.lessonDate !== undefined, {
    message: 'Vui lòng chọn ngày học',
    path: ['lessonDate'],
  });
};

// Infer type từ schema
type LessonFormValues = z.infer<ReturnType<typeof createLessonFormSchema>>;

interface LessonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: LessonFormMode;
  lesson?: LessonDTO | LessonLibraryDTO;
  onSubmit: (data: LessonFormData) => void;
  isLoading?: boolean;
}

export function LessonForm({
  open,
  onOpenChange,
  mode,
  lesson,
  onSubmit,
  isLoading = false,
}: LessonFormProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(createLessonFormSchema(mode)),
    defaultValues: {
      tutorName: '',
      title: '',
      summary: '',
      content: '',
      lessonDate: null,
      videoUrl: '',
      thumbnailUrl: '',
      isPublished: false,
      categoryId: 'none',
    },
  });

  const { categories } = useLessonCategories();

  // Reset form khi lesson hoặc open state thay đổi
  useEffect(() => {
    if (open) {
      if (lesson) {
        form.reset({
          tutorName: lesson.tutorName,
          title: lesson.title,
          summary: lesson.summary || '',
          content: lesson.content,
          lessonDate:
            'lessonDate' in lesson && lesson.lessonDate
              ? parseDateFromBackend(lesson.lessonDate) ?? null
              : null,
          videoUrl: lesson.videoUrl || '',
          thumbnailUrl: lesson.thumbnailUrl || '',
          isPublished: 'isPublished' in lesson ? lesson.isPublished : false,
          categoryId: lesson.category?.id ? String(lesson.category.id) : 'none',
        });
      } else {
        form.reset({
          tutorName: '',
          title: '',
          summary: '',
          content: '',
          lessonDate: mode !== 'library' ? new Date() : null,
          videoUrl: '',
          thumbnailUrl: '',
          isPublished: false,
          categoryId: 'none',
        });
      }
    }
  }, [lesson, form, open, mode]);

  const handleSubmit = (values: LessonFormValues) => {
    // Cast và format dữ liệu để khớp với LessonFormData interface
    const formattedData: LessonFormData = {
      tutorName: values.tutorName.trim(),
      title: values.title.trim(),
      summary: values.summary?.trim() || undefined,
      content: values.content.trim(),
      // Nếu là library mode và không có lessonDate, sử dụng ngày hiện tại
      // Backend yêu cầu lessonDate bắt buộc cho mọi bài giảng
      lessonDate: values.lessonDate
        ? formatDateForBackend(values.lessonDate)
        : mode === 'library'
          ? formatDateForBackend(new Date())
          : undefined,
      videoUrl: values.videoUrl?.trim() || undefined,
      thumbnailUrl: values.thumbnailUrl?.trim() || undefined,
      isPublished: values.isPublished,
      categoryId: values.categoryId && values.categoryId !== 'none' ? Number(values.categoryId) : undefined,
      images: [], // Default empty array
      resources: [], // Default empty array
    };

    onSubmit(formattedData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const getDialogConfig = () => {
    switch (mode) {
      case 'create':
        return {
          title: 'Tạo bài giảng mới',
          description: 'Điền thông tin để tạo bài giảng mới',
          icon: FileText,
          submitLabel: 'Tạo bài giảng',
        };
      case 'edit':
        return {
          title: 'Chỉnh sửa bài giảng',
          description: 'Cập nhật thông tin bài giảng',
          icon: Edit,
          submitLabel: 'Cập nhật',
        };
      case 'library':
        return {
          title: 'Thêm vào kho học liệu',
          description: 'Tạo bài giảng mẫu trong kho',
          icon: BookOpen,
          submitLabel: 'Thêm vào kho',
        };
    }
  };

  const config = getDialogConfig();
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-[700px] md:max-w-[750px] h-[95vh] sm:h-auto sm:max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl sm:rounded-lg">
        <DialogHeader className="px-4 py-4 sm:p-6 sm:pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
            <span className="truncate">{config.title}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:p-6 sm:pt-4 space-y-4 sm:space-y-6 min-h-0">
              {/* Tutor Name */}
              <FormField
                control={form.control}
                name="tutorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Tên giáo viên <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên giáo viên..."
                        className="h-9 sm:h-10 text-sm"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Category selector */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Danh mục bài giảng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ''} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="h-9 sm:h-10 text-sm">
                          <SelectValue placeholder="Chọn danh mục..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none" className="text-sm">Không có danh mục</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)} className="text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Tiêu đề bài giảng <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tiêu đề..."
                        className="h-9 sm:h-10 text-sm"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Summary */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Tóm tắt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập tóm tắt ngắn gọn..."
                        className="resize-none text-sm min-h-[60px] sm:min-h-[70px]"
                        rows={2}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] sm:text-xs">
                      Mô tả ngắn gọn về nội dung bài giảng (tùy chọn)
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Nội dung bài giảng <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung chi tiết..."
                        className="min-h-[150px] sm:min-h-[200px] resize-none text-sm"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] sm:text-xs">
                      Nội dung chi tiết của bài giảng (hỗ trợ HTML)
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Lesson Date - Only show if not library mode */}
              {mode !== 'library' && (
                <FormField
                  control={form.control}
                  name="lessonDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs sm:text-sm">
                        Ngày học <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value || undefined}
                          onChange={field.onChange}
                          placeholder="Chọn ngày học"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}

              {/* Thông báo cho library mode */}
              {mode === 'library' && (
                <div className="rounded-xl sm:rounded-lg border border-blue-200 bg-blue-50 p-2.5 sm:p-3">
                  <p className="text-xs sm:text-sm text-blue-800">
                    💡 <strong>Lưu ý:</strong> Bài giảng trong kho sẽ tự động sử dụng ngày hiện tại.
                    Bạn có thể chỉnh sửa ngày học sau khi giao bài cho học sinh.
                  </p>
                </div>
              )}

              {/* Thumbnail Upload - Thay thế Input URL bằng CloudinaryUploader */}
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Ảnh đại diện (Thumbnail)</FormLabel>
                    <FormControl>
                      <CloudinaryUploader
                        type="image"
                        value={field.value || ''}
                        onUploadSuccess={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] sm:text-xs">
                      Upload ảnh đại diện cho bài giảng
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Video Upload - Thay thế Input URL bằng CloudinaryUploader */}
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Video bài giảng</FormLabel>
                    <FormControl>
                      <CloudinaryUploader
                        type="video"
                        value={field.value || ''}
                        onUploadSuccess={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] sm:text-xs">
                      Upload video minh họa cho bài giảng
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Is Published Switch */}
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl sm:rounded-lg border p-3 sm:p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm sm:text-base">
                        Xuất bản ngay
                      </FormLabel>
                      <FormDescription className="text-[10px] sm:text-xs">
                        Bài giảng sẽ hiển thị cho học sinh ngay lập tức
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-4 py-3 sm:p-6 sm:pt-3 bg-muted/20 border-t shrink-0 flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
                className="flex-1 sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
              >
                {isLoading && <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />}
                {config.submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}