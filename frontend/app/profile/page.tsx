'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarUpload } from '@/components/shared/AvatarUpload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Save, User, Mail, Shield, Hash, Bell, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(50, 'Họ tên không được vượt quá 50 ký tự'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type SettingsSection = 'profile' | 'password' | 'notifications';

const SIDEBAR_ITEMS: { id: SettingsSection; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'password', label: 'Mật khẩu', icon: Lock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
];

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || '',
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName,
            });
        }
    }, [user, reset]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            setIsSaving(true);
            await updateProfile(data);
            reset(data);
            toast.success('Cập nhật thông tin thành công');
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Sidebar */}
                <aside className="lg:w-56 flex-shrink-0">
                    <nav className="space-y-1">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-4">
                            Cài đặt
                        </h2>
                        {SIDEBAR_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveSection(item.id)}
                                    className={cn(
                                        'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                                        activeSection === item.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0 space-y-10">
                    {activeSection === 'profile' && (
                        <>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                    Thông tin cá nhân
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    Quản lý ảnh đại diện và thông tin tài khoản
                                </p>
                            </div>

                            <div className="border-t border-border/60 pt-8">
                                <div className="flex flex-col sm:flex-row gap-10 sm:gap-14">
                                    <div className="flex flex-col items-center sm:items-start space-y-3">
                                        <AvatarUpload size="xl" className="ring-2 ring-border/50" />
                                        <div className="text-center sm:text-left">
                                            <p className="text-sm font-semibold text-foreground">Ảnh đại diện</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 max-w-[220px]">
                                                Kéo chỉnh vị trí trong khung tròn rồi lưu
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    Họ và tên
                                                </Label>
                                                <Input
                                                    id="fullName"
                                                    {...register('fullName')}
                                                    placeholder="Nhập họ và tên của bạn"
                                                    className={cn(
                                                        'h-11 w-full max-w-md xl:max-w-lg',
                                                        errors.fullName && 'border-destructive focus-visible:ring-destructive'
                                                    )}
                                                    disabled={isSaving}
                                                />
                                                {errors.fullName && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errors.fullName.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="border-t border-border/40 pt-6 space-y-4">
                                                <h4 className="text-sm font-semibold text-foreground">Thông tin đăng nhập</h4>
                                                <div className="grid gap-4 sm:grid-cols-2 w-full max-w-xl xl:max-w-2xl">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            Email
                                                        </Label>
                                                        <p className="px-3 py-2 rounded-md bg-muted/40 text-foreground font-medium text-sm">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <Shield className="h-4 w-4" />
                                                            Vai trò
                                                        </Label>
                                                        <p className="px-3 py-2 rounded-md bg-muted/40 text-foreground font-medium text-sm capitalize">
                                                            {user.role}
                                                        </p>
                                                    </div>
                                                    {user.studentId && (
                                                        <div className="space-y-2">
                                                            <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                                                <Hash className="h-4 w-4" />
                                                                Mã học sinh
                                                            </Label>
                                                            <p className="px-3 py-2 rounded-md bg-muted/40 text-foreground font-medium text-sm">
                                                                #{user.studentId}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <Button
                                                    type="submit"
                                                    form="profile-form"
                                                    className="h-11 px-8 font-medium"
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Đang lưu...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Lưu thay đổi
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'password' && (
                        <>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                    Mật khẩu
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    Đổi mật khẩu đăng nhập (tính năng đang phát triển)
                                </p>
                            </div>
                            <div className="border-t border-border/60 pt-8">
                                <p className="text-sm text-muted-foreground">Bạn có thể đổi mật khẩu qua email xác thực trong phiên bản sau.</p>
                            </div>
                        </>
                    )}

                    {activeSection === 'notifications' && (
                        <>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                    Thông báo
                                </h3>
                                <p className="text-muted-foreground mt-1">
                                    Tùy chọn nhận thông báo (tính năng đang phát triển)
                                </p>
                            </div>
                            <div className="border-t border-border/60 pt-8">
                                <p className="text-sm text-muted-foreground">Cài đặt thông báo sẽ được bổ sung sau.</p>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
