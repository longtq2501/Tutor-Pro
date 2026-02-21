'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarUpload } from '@/components/shared/AvatarUpload';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Save, User, Mail, Shield, Hash } from 'lucide-react';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(50, 'Họ tên không được vượt quá 50 ký tự'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || '',
        },
    });

    // Reset form when user data loads/changes
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
            toast.success('Cập nhật thông tin thành công');
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                        Thông tin cá nhân
                    </CardTitle>
                    <CardDescription className="text-base">
                        Quản lý ảnh đại diện và thông tin tài khoản của bạn
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-10 pt-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <AvatarUpload size="xl" className="ring-4 ring-primary/10 transition-all hover:ring-primary/20" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Ảnh đại diện</p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                                Ảnh rõ nét giúp mọi người dễ dàng nhận ra bạn hơn
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6">
                            {/* Full Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-sm font-bold flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    Họ và tên
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="fullName"
                                        {...register('fullName')}
                                        placeholder="Nhập họ và tên của bạn"
                                        className={`h-12 bg-background/50 border-input transition-all focus:ring-2 focus:ring-primary/20 ${errors.fullName ? 'border-destructive ring-destructive/20' : ''}`}
                                        disabled={isSaving}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            {/* Read-only Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <p className="px-3 py-2.5 rounded-md bg-muted/30 text-muted-foreground font-medium border border-transparent">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        Vai trò
                                    </Label>
                                    <p className="px-3 py-2.5 rounded-md bg-muted/30 text-muted-foreground font-medium border border-transparent capitalize">
                                        {user.role}
                                    </p>
                                </div>

                                {user.studentId && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            Mã học sinh
                                        </Label>
                                        <p className="px-3 py-2.5 rounded-md bg-muted/30 text-muted-foreground font-medium border border-transparent">
                                            #{user.studentId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center pb-8 pt-2">
                    <Button
                        type="submit"
                        form="profile-form"
                        className="w-full sm:w-auto px-10 h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        disabled={isSaving || !isDirty}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-5 w-5" />
                                Lưu thay đổi
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
