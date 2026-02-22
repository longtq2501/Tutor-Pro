import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminLayout>{children}</AdminLayout>
        </ProtectedRoute>
    );
}
