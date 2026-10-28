"use client";

import ProfilePage from '@/app/(tutor)/profile/page';
import { DashboardHeader } from '@/contexts/UIContext';

export default function SettingsView() {
  return (
    <div className="bg-transparent flex-1 flex flex-col min-h-0 h-full w-full">
      <DashboardHeader
        title="Cài đặt"
        subtitle="Quản lý thông tin cá nhân và cấu hình tài khoản"
      />

      <div data-tour="settings-profile" className="flex-1 flex flex-col min-h-0 h-full w-full overflow-hidden">
        <ProfilePage />
      </div>
    </div>
  );
}

