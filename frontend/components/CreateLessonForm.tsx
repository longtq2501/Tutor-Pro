/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Video,
  Link as LinkIcon,
  Save,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import {toast} from 'sonner';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { studentsApi, adminLessonsApi } from '@/lib/api';
// SỬA DÒNG NÀY:
import type { 
  Student, 
  CreateLessonRequest, 
  AdminLessonImage, 
  AdminLessonResource 
} from '@/lib/types';

// Thêm "as any" vào cuối dòng import để đánh lừa TypeScript
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default as any), 
  { ssr: false }
);

interface CreateLessonFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface LessonImage {
  imageUrl: string;
  caption: string;
  displayOrder: number;
}

interface LessonResource {
  title: string;
  description: string;
  resourceUrl: string;
  resourceType: 'PDF' | 'LINK' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  fileSize?: number;
  displayOrder: number;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CreateLessonForm({ onSuccess, onCancel }: CreateLessonFormProps) {

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [tutorName, setTutorName] = useState('Thầy Quỳnh Long');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [lessonDate, setLessonDate] = useState<Date>();
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [images, setImages] = useState<AdminLessonImage[]>([]);
  const [resources, setResources] = useState<AdminLessonResource[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const CLOUDINARY_CLOUD_NAME = 'dvp2wcvmv';
  const CLOUDINARY_UPLOAD_PRESET = 'tutorpro_preset';

  useEffect(() => {
    fetchStudents();
    loadCloudinaryWidget();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const data = await studentsApi.getAll();
      setStudents(data.filter((s: Student) => s.active));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Không thể tải danh sách học sinh');
    } finally {
      setLoadingStudents(false);
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
          toast.error("Không thể upload file");
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

  const toggleStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const addImage = () => {
    openCloudinaryWidget('image', (url) => {
      setImages((prev) => [
        ...prev,
        {
          imageUrl: url,
          caption: '',
          displayOrder: prev.length,
        },
      ]);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageCaption = (index: number, caption: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, caption } : img)));
  };

  const addResource = (type: LessonResource['resourceType']) => {
    const resourceType = type === 'LINK' ? 'auto' : type.toLowerCase() as any;
    
    if (type === 'LINK') {
      setResources((prev) => [
        ...prev,
        {
          title: '',
          description: '',
          resourceUrl: '',
          resourceType: 'LINK',
          displayOrder: prev.length,
        },
      ]);
    } else {
      openCloudinaryWidget(resourceType, (url) => {
        setResources((prev) => [
          ...prev,
          {
            title: '',
            description: '',
            resourceUrl: url,
            resourceType: type,
            displayOrder: prev.length,
          },
        ]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (selectedStudents.length === 0) {
      toast.error('Vui lòng chọn ít nhất một học sinh');
      return;
    }
  
    if (!title || !lessonDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
  
    setLoading(true);
  
    try {
      // SỬA KHỐI NÀY: Gán kiểu CreateLessonRequest
      const payload: CreateLessonRequest = {
        studentIds: selectedStudents,
        tutorName,
        title,
        summary,
        content,
        lessonDate: format(lessonDate, 'yyyy-MM-dd'), // Format này Backend LocalDate mới hiểu
        videoUrl: videoUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        images: images.map((img, index) => ({ ...img, displayOrder: index })),
        resources: resources.map((res, index) => ({ ...res, displayOrder: index })),
        isPublished,
      };
  
      const result = await adminLessonsApi.create(payload);
      
      // Result từ backend thường là List<Lesson> hoặc ApiResponse
      toast.success(`Đã tạo thành công bài giảng`);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      toast.error(error.message || 'Không thể tạo bài giảng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn Học Sinh</CardTitle>
          <CardDescription>Chọn một hoặc nhiều học sinh để gán bài giảng</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingStudents ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {students.map((student) => (
                <Badge
                  key={student.id}
                  variant={selectedStudents.includes(student.id) ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => toggleStudent(student.id)}
                >
                  {student.name}
                  {selectedStudents.includes(student.id) && (
                    <X className="w-3 h-3 ml-2" />
                  )}
                </Badge>
              ))}
            </div>
          )}
          {selectedStudents.length > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              Đã chọn {selectedStudents.length} học sinh
            </p>
          )}
        </CardContent>
      </Card>

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
                <PopoverContent className="w-auto p-0" align="start">
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
          <CardDescription>Sử dụng Markdown để định dạng nội dung</CardDescription>
        </CardHeader>
        <CardContent>
          <div data-color-mode="dark">
            {/* Ép kiểu Component thành any để hết báo đỏ các thuộc tính value, onChange */}
            {(() => {
              const Editor = MDEditor as any;
              return (
                <Editor
                  value={content}
                  onChange={(val: string) => setContent(val || '')}
                  height={400}
                  preview="live"
                  hideToolbar={false}
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
          <CardDescription>Thêm video và hình ảnh thumbnail</CardDescription>
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

          {(videoUrl || thumbnailUrl) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {thumbnailUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {videoUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <video src={videoUrl} controls className="w-full h-full" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hình Ảnh</CardTitle>
              <CardDescription>Thêm hình ảnh minh họa cho bài giảng</CardDescription>
            </div>
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
                      value={image.caption}
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
            <div>
              <CardTitle>Tài Liệu</CardTitle>
              <CardDescription>Thêm tài liệu tham khảo, bài tập, v.v.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addResource('PDF')}
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addResource('LINK')}
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Link
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addResource('VIDEO')}
              >
                <Video className="w-4 h-4 mr-2" />
                Video
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
                  <div className="space-y-2">
                    <Input
                      value={resource.title}
                      onChange={(e) => updateResource(index, 'title', e.target.value)}
                      placeholder="Tiêu đề tài liệu"
                    />
                    <Textarea
                      value={resource.description}
                      onChange={(e) => updateResource(index, 'description', e.target.value)}
                      placeholder="Mô tả (tùy chọn)"
                      rows={2}
                    />
                    {resource.resourceType === 'LINK' && (
                      <Input
                        value={resource.resourceUrl}
                        onChange={(e) => updateResource(index, 'resourceUrl', e.target.value)}
                        placeholder="https://..."
                      />
                    )}
                    {resource.resourceType !== 'LINK' && (
                      <div className="text-sm text-muted-foreground truncate">
                        {resource.resourceUrl}
                      </div>
                    )}
                  </div>
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
              <Label htmlFor="publish">Xuất bản ngay</Label>
              <p className="text-sm text-muted-foreground">
                Bài giảng sẽ hiển thị cho học sinh ngay lập tức
              </p>
            </div>
            <Switch id="publish" checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang tạo...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Tạo Bài Giảng
            </>
          )}
        </Button>
      </div>
    </form>
  );
}