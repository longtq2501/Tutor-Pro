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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Loader2, BookOpen, FileText, Edit } from 'lucide-react';
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
  };

  // Library mode không bắt buộc lessonDate
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
    },
  });

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
      lessonDate: values.lessonDate ? formatDateForBackend(values.lessonDate) : undefined,
      videoUrl: values.videoUrl?.trim() || undefined,
      thumbnailUrl: values.thumbnailUrl?.trim() || undefined,
      isPublished: values.isPublished,
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Tutor Name */}
            <FormField
              control={form.control}
              name="tutorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên giáo viên <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên giáo viên..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tiêu đề bài giảng <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tóm tắt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập tóm tắt ngắn gọn..."
                      className="resize-none"
                      rows={2}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả ngắn gọn về nội dung bài giảng (tùy chọn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nội dung bài giảng <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung chi tiết..."
                      className="min-h-[200px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Nội dung chi tiết của bài giảng (hỗ trợ HTML)
                  </FormDescription>
                  <FormMessage />
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
                    <FormLabel>
                      Ngày học <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: vi })
                            ) : (
                              <span>Chọn ngày học</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Thumbnail Upload - Thay thế Input URL bằng CloudinaryUploader */}
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh đại diện (Thumbnail)</FormLabel>
                  <FormControl>
                    <CloudinaryUploader
                      type="image"
                      value={field.value || ''}
                      onUploadSuccess={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload ảnh đại diện cho bài giảng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Upload - Thay thế Input URL bằng CloudinaryUploader */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video bài giảng</FormLabel>
                  <FormControl>
                    <CloudinaryUploader
                      type="video"
                      value={field.value || ''}
                      onUploadSuccess={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload video minh họa cho bài giảng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Published Switch */}
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Xuất bản ngay
                    </FormLabel>
                    <FormDescription>
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

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {config.submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}