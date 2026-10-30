'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import {
  BookOpen,
  CalendarDays,
  Check,
  Edit,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  User,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
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

// ---------------------------------------------------------------------------
// Media card: gọn, cùng kích thước cho ảnh đại diện và video
// ---------------------------------------------------------------------------
const MEDIA_URL_PATTERN = /^https?:\/\//i;

interface MediaCardProps {
  type: 'image' | 'video';
  icon: LucideIcon;
  title: string;
  hint: string;
  badge: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function MediaCard({
  type,
  icon: Icon,
  title,
  hint,
  badge,
  value,
  onValueChange,
  disabled = false,
  children,
}: MediaCardProps) {
  // Chỉ hiển thị preview khi URL hợp lệ để tránh ảnh lỗi trong lúc đang nhập
  const previewUrl = MEDIA_URL_PATTERN.test(value) ? value : '';

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-2 border-b bg-muted/20 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-tight">{title}</h3>
            <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
          </div>
        </div>
        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {badge}
        </span>
      </header>

      <div className="space-y-2 p-3">
        <div className="h-[150px] overflow-hidden rounded-lg">
          <CloudinaryUploader
            compact
            type={type}
            value={previewUrl}
            onUploadSuccess={onValueChange}
            disabled={disabled}
          />
        </div>
        <Input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={type === 'image' ? 'Hoặc dán URL ảnh...' : 'Hoặc dán URL video...'}
          className="h-8 text-xs"
          disabled={disabled}
        />
        {children}
      </div>
    </section>
  );
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
  const { user } = useAuth();

  // Tên giáo viên được lấy tự động từ tài khoản đang đăng nhập
  const defaultTutorName = (user?.fullName || '').trim();
  const defaultTutorNameRef = useRef(defaultTutorName);
  // Phạm vi (lần mở dialog + bài giảng) đang bật chế độ sửa tên giáo viên.
  // Nhờ vậy trạng thái tự reset mỗi lần mở dialog hoặc đổi bài giảng, không cần effect.
  const [editingTutorNameScope, setEditingTutorNameScope] = useState<string | null>(null);

  useEffect(() => {
    defaultTutorNameRef.current = defaultTutorName;
  }, [defaultTutorName]);

  // Fetch full lesson details if editing a library lesson
  const isLibraryLesson = mode === 'library' && !!lesson?.id;
  const { data: fullLessonData } = useLessonLibraryById(
    isLibraryLesson ? lesson?.id : undefined
  );

  // Use full lesson data if available, otherwise use prop
  const lessonToUse = fullLessonData || lesson;

  const tutorNameScopeKey = `${open ? 'open' : 'closed'}:${lessonToUse?.id ?? 'new'}`;
  const isEditingTutorName = editingTutorNameScope === tutorNameScopeKey;
  const setIsEditingTutorName = (next: boolean) =>
    setEditingTutorNameScope(next ? tutorNameScopeKey : null);

  // Reset form khi lesson hoặc open state thay đổi
  useEffect(() => {
    if (open) {
      if (lessonToUse) {
        form.reset({
          tutorName: lessonToUse.tutorName?.trim() || defaultTutorNameRef.current,
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
          tutorName: defaultTutorNameRef.current,
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

  // Trường hợp user được tải xong sau khi dialog đã mở: bổ sung tên giáo viên còn trống
  useEffect(() => {
    if (!open || !defaultTutorName) return;

    if (!form.getValues('tutorName')) {
      form.setValue('tutorName', defaultTutorName, { shouldValidate: true });
    }
  }, [open, defaultTutorName, form]);


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

  // Chỉ cần theo dõi tóm tắt (đếm ký tự); các trường khác đọc trực tiếp qua FormField
  const watchedSummary = useWatch({ control: form.control, name: 'summary' });

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
                  <TabsList className="grid w-full max-w-[420px] grid-cols-2">
                    <TabsTrigger value="content" className={cn(form.formState.errors.content ? "text-destructive data-[state=active]:text-destructive" : "")}>
                      Nội dung
                    </TabsTrigger>
                    <TabsTrigger
                      value="info"
                      className={cn(
                        (form.formState.errors.title ||
                          form.formState.errors.tutorName ||
                          form.formState.errors.lessonDate ||
                          form.formState.errors.thumbnailUrl ||
                          form.formState.errors.videoUrl)
                          ? "text-destructive data-[state=active]:text-destructive"
                          : ""
                      )}
                    >
                      Thông tin & Media
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

                  {/* TAB 2: THÔNG TIN & MEDIA */}
                  <TabsContent value="info" className="mt-0 border-none">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-4 lg:grid-cols-12">
                      {/* Cột trái: thông tin bài giảng */}
                      <div className="lg:col-span-7">
                        <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                          <header className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <h3 className="text-sm font-semibold">Thông tin bài giảng</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-destructive">
                              * Bắt buộc
                            </span>
                          </header>

                          <div className="space-y-3.5 p-4">
                            {/* Tiêu đề */}
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-semibold">Tiêu đề bài giảng</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nhập tiêu đề bài giảng..." {...field} disabled={isLoading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Giáo viên + Ngày học */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="tutorName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs font-semibold">Giáo viên</FormLabel>
                                    <FormControl>
                                      {isEditingTutorName ? (
                                        <div className="flex items-center gap-1.5">
                                          <Input
                                            placeholder="Nhập tên giáo viên..."
                                            {...field}
                                            disabled={isLoading}
                                            autoFocus
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 shrink-0"
                                            title="Xong"
                                            disabled={isLoading}
                                            onClick={() => {
                                              if (!field.value.trim()) {
                                                field.onChange(defaultTutorName);
                                              }
                                              setIsEditingTutorName(false);
                                            }}
                                          >
                                            <Check className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="flex h-9 items-center gap-1.5 rounded-md border border-dashed bg-muted/40 px-2.5">
                                          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                          <span className="truncate text-sm font-medium">
                                            {field.value || 'Chưa xác định'}
                                          </span>
                                          <span className="ml-auto shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                            Tự động
                                          </span>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 shrink-0"
                                            title="Đổi tên giáo viên"
                                            disabled={isLoading}
                                            onClick={() => setIsEditingTutorName(true)}
                                          >
                                            <Pencil className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      )}
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />



                              {mode !== 'library' ? (
                                <FormField
                                  control={form.control}
                                  name="lessonDate"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel className="text-xs font-semibold">Ngày học</FormLabel>
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
                              ) : (
                                <div className="flex flex-col">
                                  <span className="text-xs font-semibold">Ngày học</span>
                                  <div className="mt-2 flex h-9 items-center gap-2 rounded-md border border-dashed bg-muted/40 px-2.5 text-xs text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                    Tự động dùng ngày hiện tại
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Danh mục + Trạng thái */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs font-semibold">Danh mục</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value || ''}
                                      value={field.value || ''}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chọn danh mục..." />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="none">Không có danh mục</SelectItem>
                                        {categories.map((cat) => (
                                          <SelectItem key={cat.id} value={String(cat.id)}>
                                            <div className="flex items-center gap-2">
                                              <div
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: cat.color || '#3b82f6' }}
                                              />
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

                              <FormField
                                control={form.control}
                                name="isPublished"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs font-semibold">Trạng thái</FormLabel>
                                    <FormControl>
                                      <div className="flex h-9 items-center justify-between rounded-md border bg-muted/40 px-2.5">
                                        <span
                                          className={cn(
                                            'text-xs font-semibold',
                                            field.value ? 'text-emerald-600' : 'text-amber-600'
                                          )}
                                        >
                                          {field.value ? 'Công khai' : 'Bản nháp'}
                                        </span>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          disabled={isLoading}
                                          className="scale-90"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Tóm tắt */}
                            <FormField
                              control={form.control}
                              name="summary"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold">Tóm tắt</FormLabel>
                                    <span className="text-[10px] tabular-nums text-muted-foreground">
                                      {(watchedSummary || '').length}/500
                                    </span>
                                  </div>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tóm tắt nội dung chính (hiển thị trên thẻ bài giảng)..."
                                      className="min-h-[76px] resize-none text-sm leading-relaxed"
                                      maxLength={500}
                                      {...field}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </section>
                      </div>

                      {/* Cột phải: media */}
                      <div className="space-y-4 lg:col-span-5">
                        <FormField
                          control={form.control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <FormItem>
                              <MediaCard
                                type="image"
                                icon={ImageIcon}
                                title="Ảnh đại diện"
                                hint="Hiển thị trên thẻ bài giảng"
                                badge="16:9"
                                value={field.value || ''}
                                onValueChange={field.onChange}
                                disabled={isLoading}
                              >
                                <FormMessage />
                              </MediaCard>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="videoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <MediaCard
                                type="video"
                                icon={Video}
                                title="Video bài giảng"
                                hint="Video minh họa nội dung"
                                badge="Tối đa 100MB"
                                value={field.value || ''}
                                onValueChange={field.onChange}
                                disabled={isLoading}
                              >
                                <FormMessage />
                              </MediaCard>
                            </FormItem>
                          )}
                        />

                        {mode === 'library' && (
                          <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] leading-relaxed text-blue-800">
                            💡 Bài giảng trong kho sẽ tự động dùng ngày hiện tại khi được giao.
                          </p>
                        )}
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
