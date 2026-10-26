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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { cn } from '@/lib/utils';
import type {
  LessonDTO,
  LessonLibraryDTO,
  LessonFormMode,
  LessonFormData,
} from '../types';
import { formatDateForBackend, parseDateFromBackend } from '../types';
import { CloudinaryUploader } from './CloudinaryUploader';
import { LessonEditor } from './LessonEditor';
import { useLessonCategories } from '../hooks/useLessonCategories';
import { useLessonLibraryById } from '../hooks/useLessonLibrary';
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

  // Fetch full lesson details if editing a library lesson
  const isLibraryLesson = mode === 'library' && !!lesson?.id;
  const { data: fullLessonData } = useLessonLibraryById(
    isLibraryLesson ? lesson?.id : undefined
  );

  // Use full lesson data if available, otherwise use prop
  const lessonToUse = fullLessonData || lesson;

  // Reset form khi lesson hoặc open state thay đổi
  useEffect(() => {
    if (open) {
      if (lessonToUse) {
        form.reset({
          tutorName: lessonToUse.tutorName,
          title: lessonToUse.title,
          summary: lessonToUse.summary || '',
          content: lessonToUse.content,
          lessonDate:
            'lessonDate' in lessonToUse && lessonToUse.lessonDate
              ? parseDateFromBackend(lessonToUse.lessonDate) ?? null
              : null,
          videoUrl: lessonToUse.videoUrl || '',
          thumbnailUrl: lessonToUse.thumbnailUrl || '',
          isPublished: 'isPublished' in lessonToUse ? lessonToUse.isPublished : false,
          categoryId: lessonToUse.category?.id ? String(lessonToUse.category.id) : 'none',
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
  }, [lessonToUse, form, open, mode]);

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
          iconColor: 'text-emerald-600',
          iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        };
      case 'edit':
        return {
          title: 'Chỉnh sửa bài giảng',
          description: 'Cập nhật thông tin bài giảng',
          icon: Edit,
          submitLabel: 'Cập nhật',
          iconColor: 'text-amber-600',
          iconBg: 'bg-amber-50 dark:bg-amber-900/20',
        };
      case 'library':
        return {
          title: 'Thêm bài giảng mới',
          description: 'Tạo bài giảng mẫu trong kho học liệu',
          icon: BookOpen,
          submitLabel: 'Thêm vào kho',
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10',
        };
    }
  };

  const config = getDialogConfig();
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1400px] h-[95vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4">
        {/* Unified Header */}
        <DialogHeader className="flex-row items-center gap-3.5 px-5 py-4 shrink-0 border-b bg-card">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.iconBg)}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base font-semibold text-foreground leading-none mb-0.5">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-none">
              {config.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 overflow-hidden min-h-0">

            <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-muted/10">
              <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-2 border-b bg-background shrink-0">
                  <TabsList className="grid w-full max-w-[600px] grid-cols-3">
                    <TabsTrigger value="content" className={cn(form.formState.errors.content ? "text-destructive data-[state=active]:text-destructive" : "")}>
                      Nội dung
                    </TabsTrigger>
                    <TabsTrigger value="details" className={cn((form.formState.errors.title || form.formState.errors.tutorName || form.formState.errors.lessonDate) ? "text-destructive data-[state=active]:text-destructive" : "")}>
                      Thông tin chung
                    </TabsTrigger>
                    <TabsTrigger value="media" className={cn((form.formState.errors.videoUrl || form.formState.errors.thumbnailUrl) ? "text-destructive data-[state=active]:text-destructive" : "")}>
                      Media & Cài đặt
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 p-6">
                  {/* TAB 1: CONTENT */}
                  <TabsContent value="content" className="h-full mt-0 border-none">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="h-full flex flex-col">
                          <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/20">
                            <FormLabel className="text-base font-bold text-slate-800 dark:text-white">Nội dung bài giảng</FormLabel>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide border border-red-200">Bắt buộc</span>
                          </div>
                          <FormControl>
                            <div className="flex-1 relative min-h-[400px]">
                              {isLibraryLesson && !fullLessonData ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 z-10 gap-3 backdrop-blur-[2px]">
                                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                  <p className="text-sm font-medium text-muted-foreground">Đang tải nội dung chi tiết...</p>
                                </div>
                              ) : null}
                              <LessonEditor
                                content={field.value}
                                onChange={field.onChange}
                                disabled={isLoading || (isLibraryLesson && !fullLessonData)}
                                className="h-full border-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="px-6 py-2" />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* TAB 2: DETAILS */}
                  <TabsContent value="details" className="mt-0 border-none h-full p-1">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                      {/* Left Column: Core Info */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                          <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold leading-none tracking-tight">Thông tin cơ bản</h3>
                              <p className="text-sm text-muted-foreground">Các thông tin chính của bài giảng</p>
                            </div>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                              Thông tin bắt buộc
                            </span>
                          </div>

                          <div className="grid gap-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center justify-between mb-2">
                                    <FormLabel className="text-base font-semibold">Tiêu đề bài giảng</FormLabel>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide border border-red-200">Bắt buộc</span>
                                  </div>
                                  <FormControl>
                                    <Input placeholder="Nhập tiêu đề bài giảng..." className="h-12 text-base" {...field} disabled={isLoading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="tutorName"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="flex items-center justify-between mb-2">
                                      <FormLabel className="font-semibold">Tên giáo viên</FormLabel>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide border border-red-200">Bắt buộc</span>
                                    </div>
                                    <FormControl>
                                      <Input placeholder="Nhập tên giáo viên..." className="h-11" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {mode !== 'library' && (
                                <FormField
                                  control={form.control}
                                  name="lessonDate"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <div className="flex items-center justify-between mb-2">
                                        <FormLabel className="font-semibold">Ngày học</FormLabel>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide border border-red-200">Bắt buộc</span>
                                      </div>
                                      <FormControl>
                                        <DatePicker
                                          value={field.value || undefined}
                                          onChange={field.onChange}
                                          placeholder="Chọn ngày học"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                          <div className="space-y-1 border-b pb-4">
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Phân loại</h3>
                            <p className="text-sm text-muted-foreground">Giúp học sinh dễ dàng tìm kiếm bài giảng</p>
                          </div>
                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold">Danh mục</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ''} value={field.value || ''}>
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Chọn danh mục..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">Không có danh mục</SelectItem>
                                    {categories.map((cat) => (
                                      <SelectItem key={cat.id} value={String(cat.id)}>
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                                          {cat.name}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Right Column: Descriptions & Notes */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 h-full flex flex-col">
                          <div className="space-y-1 border-b pb-4 mb-4">
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Mô tả chi tiết</h3>
                            <p className="text-sm text-muted-foreground">Thông tin bổ sung cho bài giảng</p>
                          </div>

                          {mode === 'library' && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6">
                              <p className="text-sm text-blue-800 flex gap-2">
                                <span className="shrink-0 text-lg">💡</span>
                                <span className="leading-relaxed"><strong>Lưu ý:</strong> Bài giảng trong kho sẽ tự động sử dụng ngày hiện tại khi được giao.</span>
                              </p>
                            </div>
                          )}

                          <FormField
                            control={form.control}
                            name="summary"
                            render={({ field }) => (
                              <FormItem className="flex-1 flex flex-col">
                                <FormLabel className="font-semibold mb-2">Tóm tắt nội dung</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Nhập tóm tắt nội dung chính của bài giảng..."
                                    className="resize-none flex-1 min-h-[200px] text-base leading-relaxed p-4"
                                    {...field}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormDescription className="mt-2">Tóm tắt này sẽ hiển thị trên thẻ bài giảng trong danh sách.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 3: MEDIA */}
                  <TabsContent value="media" className="mt-0 border-none p-6">
                    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                      <div className="grid grid-cols-1 gap-8">
                        {/* Thumbnail Section */}
                        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="text-lg font-bold">Hình ảnh đại diện</h3>
                              <p className="text-sm text-muted-foreground">Xuất hiện trên thẻ bài giảng và kết quả tìm kiếm</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2 py-1 rounded bg-amber-100 text-amber-700 uppercase tracking-tighter border border-amber-200">Khuyên dùng 16:9</span>
                            </div>
                          </div>
                          <div className="p-6">
                            <FormField
                              control={form.control}
                              name="thumbnailUrl"
                              render={({ field }) => (
                                <FormItem className="space-y-4">
                                  <FormControl>
                                    <div className="w-full aspect-video rounded-xl overflow-hidden">
                                      <CloudinaryUploader
                                        type="image"
                                        value={field.value || ''}
                                        onUploadSuccess={field.onChange}
                                        disabled={isLoading}
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Video Section */}
                        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="text-lg font-bold">Video bài giảng</h3>
                              <p className="text-sm text-muted-foreground">Video minh họa nội dung hoặc bài giảng ghi sẵn</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2 py-1 rounded bg-blue-100 text-blue-700 uppercase tracking-tighter border border-blue-200">Max 100MB</span>
                            </div>
                          </div>
                          <div className="p-6">
                            <FormField
                              control={form.control}
                              name="videoUrl"
                              render={({ field }) => (
                                <FormItem className="space-y-4">
                                  <FormControl>
                                    <div className="w-full aspect-video rounded-xl overflow-hidden">
                                      <CloudinaryUploader
                                        type="video"
                                        value={field.value || ''}
                                        onUploadSuccess={field.onChange}
                                        disabled={isLoading}
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Settings Bar */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-0.5 shadow-xl">
                        <div className="bg-white rounded-[14px] p-6">
                          <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <FormLabel className="text-xl font-bold text-slate-800">Cài đặt xuất bản</FormLabel>
                                    {field.value ? (
                                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Công khai</span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">Bản nháp</span>
                                    )}
                                  </div>
                                  <FormDescription className="text-base text-slate-500">
                                    Khi kích hoạt, bài giảng sẽ ngay lập tức xuất hiện trong mục học tập của sinh viên.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                    className="scale-150 data-[state=checked]:bg-blue-600"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <DialogFooter className="px-5 py-4 bg-card border-t shrink-0 flex items-center justify-between sm:justify-between w-full gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
                className="rounded-xl"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[140px] rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
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