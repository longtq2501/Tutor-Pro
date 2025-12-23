/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  Calendar as CalendarIcon,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Save,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { adminLessonsApi } from '@/lib/api';
import { 
  LessonImage,      // ✅ Import from types
  LessonResource,   // ✅ Import from types
  UpdateLessonRequest,
  formatBytes       // ✅ Import helper function
} from '@/lib/types';

// ❌ REMOVED LOCAL INTERFACES - Use types.ts instead

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default as any), 
  { ssr: false }
);

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface EditLessonFormProps {
  lessonId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditLessonForm({ lessonId, onSuccess, onCancel }: EditLessonFormProps) {

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [tutorName, setTutorName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [lessonDate, setLessonDate] = useState<Date>();
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // ✅ Use proper types from types.ts
  const [images, setImages] = useState<LessonImage[]>([]);
  const [resources, setResources] = useState<LessonResource[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  const CLOUDINARY_CLOUD_NAME = 'doi1wiy3t';
  const CLOUDINARY_UPLOAD_PRESET = 'tutor_preset';

  useEffect(() => {
    fetchLesson();
    loadCloudinaryWidget();
  }, [lessonId]);

  /**
   * ✅ FIXED: Fetch lesson with proper type handling
   */
  const fetchLesson = async () => {
    try {
      setLoading(true);
      const data = await adminLessonsApi.getById(lessonId);
      
      console.log('📖 Fetched lesson data:', data);
      
      // Set basic fields
      setTutorName(data.tutorName || 'Thầy Quỳnh Long');
      setTitle(data.title || '');
      setSummary(data.summary || '');
      setContent(data.content || '');
      setLessonDate(data.lessonDate ? new Date(data.lessonDate) : undefined);
      setVideoUrl(data.videoUrl || '');
      setThumbnailUrl(data.thumbnailUrl || '');
      setIsPublished(data.isPublished || false);
      
      // ✅ FIXED: Use type assertion to handle backend response
      setImages((data.images || []) as LessonImage[]);
      setResources((data.resources || []) as LessonResource[]);
      
      console.log('✅ Loaded images:', data.images?.length || 0);
      console.log('✅ Loaded resources:', data.resources?.length || 0);
    } catch (error: any) {
      console.error('❌ Error fetching lesson:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Không thể tải thông tin bài giảng');
    } finally {
      setLoading(false);
    }
  };

  const loadCloudinaryWidget = () => {
    if (!document.getElementById('cloudinary-upload-widget')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-upload-widget';
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const openCloudinaryWidget = (
    resourceType: 'image' | 'video' | 'raw' | 'auto',
    onSuccess: (url: string) => void
  ) => {
    if (!window.cloudinary) {
      toast.error('Cloudinary widget chưa được tải');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        resourceType: resourceType,
        multiple: false,
        maxFileSize: 50000000,
        clientAllowedFormats: resourceType === 'image' ? ['png', 'jpg', 'jpeg', 'gif', 'webp'] : 
                             resourceType === 'video' ? ['mp4', 'mov', 'avi'] : null,
      },
      (error: any, result: any) => {
        if (error) {
          toast.error('Lỗi upload: ' + (error.message || 'Không thể upload file'));
          return;
        }

        if (result.event === 'success') {
          onSuccess(result.info.secure_url);
          toast.success('Upload file thành công');
        }
      }
    );

    widget.open();
  };

  /**
   * ✅ FIXED: Add image with proper type
   */
  const addImage = () => {
    openCloudinaryWidget('image', (url) => {
      const newImage: LessonImage = {
        // ✅ No id - it's optional for new images
        imageUrl: url,
        caption: '',      // ✅ Optional but provide empty string
        displayOrder: images.length,
      };
      setImages((prev) => [...prev, newImage]);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageCaption = (index: number, caption: string) => {
    setImages((prev) => prev.map((img, i) => 
      i === index ? { ...img, caption } : img
    ));
  };

  /**
   * ✅ FIXED: Add resource with proper type handling
   */
  const addResource = (type: LessonResource['resourceType']) => {
    if (type === 'LINK') {
      const newResource: LessonResource = {
        // ✅ No id - it's optional for new resources
        title: '',
        description: '',  // ✅ Optional but provide empty string
        resourceUrl: '',
        resourceType: 'LINK',
        displayOrder: resources.length,
      };
      setResources((prev) => [...prev, newResource]);
    } else {
      const resourceType = type.toLowerCase() as 'image' | 'video' | 'raw';
      
      openCloudinaryWidget(resourceType, (url) => {
        const newResource: LessonResource = {
          // ✅ No id - it's optional
          title: '',
          description: '',
          resourceUrl: url,
          resourceType: type,
          displayOrder: resources.length,
        };
        setResources((prev) => [...prev, newResource]);
      });
    }
  };

  const removeResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const updateResource = (index: number, field: keyof LessonResource, value: any) => {
    setResources((prev) =>
      prev.map((res, i) => (i === index ? { ...res, [field]: value } : res))
    );
  };

  /**
   * ✅ COMPLETELY FIXED: Handle form submission with proper data sanitization
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔍 Form validation starting...');

    // Validate required fields
    if (!title || !lessonDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // ✅ Validate date is valid
    if (isNaN(lessonDate.getTime())) {
      toast.error('Ngày dạy không hợp lệ');
      return;
    }

    setSaving(true);

    try {
      // ✅ STEP 1: Format lesson date properly
      const formattedDate = format(lessonDate, 'yyyy-MM-dd');
      console.log('📅 Formatted date:', formattedDate);

      // ✅ STEP 2: Sanitize URLs (empty string → undefined)
      const cleanVideoUrl = videoUrl.trim() || undefined;
      const cleanThumbnailUrl = thumbnailUrl.trim() || undefined;

      // ✅ STEP 3: Prepare images array (keep id if exists, reindex displayOrder)
      const cleanImages: LessonImage[] = images.map((img, index) => ({
        ...(img.id && { id: img.id }),  // Keep id if exists
        imageUrl: img.imageUrl,
        caption: img.caption?.trim() || '',  // Empty string if no caption
        displayOrder: index,
      }));

      // ✅ STEP 4: Prepare resources array (keep id if exists, reindex displayOrder)
      const cleanResources: LessonResource[] = resources.map((res, index) => ({
        ...(res.id && { id: res.id }),  // Keep id if exists
        title: res.title.trim() || '',
        description: res.description?.trim() || '',
        resourceUrl: res.resourceUrl,
        resourceType: res.resourceType,
        ...(res.fileSize && { fileSize: res.fileSize }),  // Include if exists
        displayOrder: index,
      }));

      // ✅ STEP 5: Build payload with proper types
      const payload: UpdateLessonRequest = {
        tutorName: tutorName.trim() || 'Thầy Quỳnh Long',
        title: title.trim(),
        summary: summary.trim() || undefined,
        content: content.trim() || undefined,
        lessonDate: formattedDate,
        videoUrl: cleanVideoUrl,
        thumbnailUrl: cleanThumbnailUrl,
        images: cleanImages,
        resources: cleanResources,
        isPublished,
      };

      console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

      // ✅ STEP 6: Send update request
      await adminLessonsApi.update(lessonId, payload);

      console.log('✅ Update successful!');
      toast.success('Đã cập nhật bài giảng thành công');
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error updating lesson:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Không thể cập nhật bài giảng';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Cơ Bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tutorName">Tên Giáo Viên</Label>
              <Input
                id="tutorName"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                placeholder="Thầy Quỳnh Long"
              />
            </div>

            <div className="space-y-2">
              <Label>Ngày Dạy *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !lessonDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lessonDate ? format(lessonDate, 'PPP', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={lessonDate}
                    onSelect={setLessonDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu Đề *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Bài 1: Giới thiệu về Đại số"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Tóm Tắt</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Mô tả ngắn gọn về bài giảng..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Nội Dung Bài Giảng</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-color-mode="dark">
            {(() => {
              const Editor = MDEditor as any;
              return (
                <Editor
                  value={content}
                  onChange={(val: string) => setContent(val || '')}
                  height={400}
                  preview="live"
                />
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Video URL</Label>
              <div className="flex gap-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openCloudinaryWidget('video', setVideoUrl)}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <div className="flex gap-2">
                <Input
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openCloudinaryWidget('image', setThumbnailUrl)}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hình Ảnh</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addImage}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Hình
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có hình ảnh nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={image.imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={image.caption || ''}
                      onChange={(e) => updateImageCaption(index, e.target.value)}
                      placeholder="Mô tả hình ảnh..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tài Liệu</CardTitle>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addResource('PDF')}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addResource('LINK')}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Link
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có tài liệu nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge>{resource.resourceType}</Badge>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeResource(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={resource.title}
                    onChange={(e) => updateResource(index, 'title', e.target.value)}
                    placeholder="Tiêu đề tài liệu"
                  />
                  <Textarea
                    value={resource.description || ''}
                    onChange={(e) => updateResource(index, 'description', e.target.value)}
                    placeholder="Mô tả (tùy chọn)"
                    rows={2}
                  />
                  {resource.resourceType === 'LINK' ? (
                    <Input
                      value={resource.resourceUrl}
                      onChange={(e) => updateResource(index, 'resourceUrl', e.target.value)}
                      placeholder="https://..."
                    />
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate flex-1">
                        {resource.resourceUrl}
                      </span>
                      {resource.fileSize && (
                        <Badge variant="secondary">
                          {formatBytes(resource.fileSize)}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publish Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài Đặt Xuất Bản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="publish">Xuất bản</Label>
              <p className="text-sm text-muted-foreground">
                Bài giảng sẽ hiển thị cho học sinh
              </p>
            </div>
            <Switch 
              id="publish" 
              checked={isPublished} 
              onCheckedChange={setIsPublished} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu Thay Đổi
            </>
          )}
        </Button>
      </div>
    </form>
  );
}