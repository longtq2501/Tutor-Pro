import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorRecoveryDialog } from '../ErrorRecoveryDialog';
import { describe, it, expect, vi } from 'vitest';

describe('ErrorRecoveryDialog', () => {
    const defaultProps = {
        isOpen: true,
        error: 'Test error message',
        onRetry: vi.fn(),
        onAudioOnly: vi.fn(),
        onExit: vi.fn(),
    };

    it('renders correctly when open', () => {
        render(<ErrorRecoveryDialog {...defaultProps} />);

        expect(screen.getByText('Kết nối thất bại')).toBeDefined();
        expect(screen.getByText('Test error message')).toBeDefined();
        expect(screen.getByText('Thử kết nối lại ngay')).toBeDefined();
        expect(screen.getByText('Chế độ Chỉ âm thanh (Băng thông thấp)')).toBeDefined();
        expect(screen.getByText('Rời khỏi lớp học')).toBeDefined();
    });

    it('calls onRetry when retry button is clicked', () => {
        render(<ErrorRecoveryDialog {...defaultProps} />);

        fireEvent.click(screen.getByText('Thử kết nối lại ngay'));
        expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
    });

    it('calls onAudioOnly when audio only button is clicked', () => {
        render(<ErrorRecoveryDialog {...defaultProps} />);

        fireEvent.click(screen.getByText('Chế độ Chỉ âm thanh (Băng thông thấp)'));
        expect(defaultProps.onAudioOnly).toHaveBeenCalledTimes(1);
    });

    it('calls onExit when exit button is clicked', () => {
        render(<ErrorRecoveryDialog {...defaultProps} />);

        fireEvent.click(screen.getByText('Rời khỏi lớp học'));
        expect(defaultProps.onExit).toHaveBeenCalledTimes(1);
    });

    it('does not render when closed', () => {
        const { container } = render(<ErrorRecoveryDialog {...defaultProps} isOpen={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders default error message and buttons still work when error is null', () => {
        render(<ErrorRecoveryDialog {...defaultProps} error={null} />);
        expect(screen.getByText(/Đã xảy ra sự cố không mong muốn/)).toBeDefined();

        fireEvent.click(screen.getByText('Thử kết nối lại ngay'));
        expect(defaultProps.onRetry).toHaveBeenCalled();
    });

    it('toggles diagnostic information when clicking the toggle button', () => {
        render(<ErrorRecoveryDialog {...defaultProps} />);

        // Initially hidden
        expect(screen.queryByText(/OS\/Browser:/)).toBeNull();

        // Click to show
        fireEvent.click(screen.getByText(/Hiện thông tin chẩn đoán kỹ thuật/));
        expect(screen.getByText(/OS\/Browser:/)).toBeDefined();

        // Click to hide
        fireEvent.click(screen.getByText(/Ẩn thông tin chẩn đoán kỹ thuật/));
        expect(screen.queryByText(/OS\/Browser:/)).toBeNull();
    });
});
