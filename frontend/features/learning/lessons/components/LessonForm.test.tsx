import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { LessonForm } from './LessonForm';

// Tên giáo viên được tự động điền từ tài khoản đang đăng nhập
vi.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({ user: { fullName: 'Nguyễn Văn A' } }),
}));

vi.mock('../hooks/useLessonCategories', () => ({
    useLessonCategories: () => ({
        categories: [{ id: 3, name: 'Ngữ pháp', color: '#10b981' }],
        isLoading: false,
    }),
}));

vi.mock('../hooks/useLessonLibrary', () => ({
    useLessonLibraryById: () => ({ data: undefined }),
}));

if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

const openInfoTab = () => {
    const tab = screen.getByRole('tab', { name: 'Thông tin & Media' });
    fireEvent.mouseDown(tab);
    fireEvent.click(tab);
};

describe('LessonForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('tự động điền tên giáo viên và gộp thông tin vào một tab', async () => {
        render(<LessonForm open mode="create" onOpenChange={vi.fn()} onSubmit={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('Tạo bài giảng mới')).toBeInTheDocument();
        }, { timeout: 5000 });

        openInfoTab();

        await waitFor(() => {
            expect(screen.getByText('Tự động')).toBeInTheDocument();
        }, { timeout: 5000 });

        // Tên giáo viên lấy từ user.fullName
        expect(screen.getAllByText('Nguyễn Văn A').length).toBeGreaterThan(0);

        // Tab "Thông tin & Media" gộp cả thông tin, ảnh đại diện và video
        expect(screen.getByText('Thông tin bài giảng')).toBeInTheDocument();
        expect(screen.getByText('Ảnh đại diện')).toBeInTheDocument();
        expect(screen.getByText('Video bài giảng')).toBeInTheDocument();

        // Card "Xem trước hiển thị" đã được bỏ
        expect(screen.queryByText('Xem trước hiển thị')).not.toBeInTheDocument();
    });

    it('cho phép đổi tên giáo viên khi bấm nút chỉnh sửa', async () => {
        render(<LessonForm open mode="create" onOpenChange={vi.fn()} onSubmit={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('Tạo bài giảng mới')).toBeInTheDocument();
        }, { timeout: 5000 });

        openInfoTab();

        const editButton = await screen.findByTitle('Đổi tên giáo viên');
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Nhập tên giáo viên...')).toBeInTheDocument();
        }, { timeout: 5000 });

        // Bấm "Xong" sẽ thoát chế độ chỉnh sửa và quay lại trạng thái tự động
        fireEvent.click(screen.getByTitle('Xong'));

        await waitFor(() => {
            expect(screen.getByText('Tự động')).toBeInTheDocument();
        }, { timeout: 5000 });
    });
});
