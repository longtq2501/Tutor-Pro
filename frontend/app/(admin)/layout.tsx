import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopNav } from '@/components/admin/AdminTopNav';
import './admin.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRoles={['ADMIN']}>
            <div className="admin-theme dark min-h-screen">
                <AdminSidebar />
                <div className="flex flex-col flex-1 pl-16">
                    <AdminTopNav />
                    <main className="mt-[52px] h-[calc(100vh-52px)] overflow-y-auto p-8">
                        <div className="max-w-[1440px] mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

