import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecordingPreviewDialog } from '../RecordingPreviewDialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('RecordingPreviewDialog', () => {
    const mockOnDownload = vi.fn();
    const mockOnDiscard = vi.fn();

    // Mock HTMLMediaElement.prototype.play since it's not implemented in JSDOM
    beforeEach(() => {
        vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    });

    it('should render dialog when isOpen is true', () => {
        render(
            <RecordingPreviewDialog
                isOpen={true}
                videoUrl="blob:http://localhost/123"
                onDownload={mockOnDownload}
                onDiscard={mockOnDiscard}
            />
        );
        expect(screen.getByText('Xác nhận bản ghi hình')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /tải xuống/i })).toBeInTheDocument();
    });

    it('should show video when videoUrl is provided', () => {
        render(
            <RecordingPreviewDialog
                isOpen={true}
                videoUrl="blob:http://localhost/123"
                onDownload={mockOnDownload}
                onDiscard={mockOnDiscard}
            />
        );
        const video = screen.getByTestId('preview-video');
        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute('src', 'blob:http://localhost/123');
    });

    it('should call onDownload when download button is clicked', () => {
        render(
            <RecordingPreviewDialog
                isOpen={true}
                videoUrl="blob:test"
                onDownload={mockOnDownload}
                onDiscard={mockOnDiscard}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: /tải xuống/i }));
        expect(mockOnDownload).toHaveBeenCalled();
    });

    it('should call onDiscard when discard button is clicked', () => {
        render(
            <RecordingPreviewDialog
                isOpen={true}
                videoUrl="blob:test"
                onDownload={mockOnDownload}
                onDiscard={mockOnDiscard}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: /hủy bỏ/i }));
        expect(mockOnDiscard).toHaveBeenCalled();
    });

    it('should show guidance text', () => {
        render(
            <RecordingPreviewDialog
                isOpen={true}
                videoUrl="blob:test"
                onDownload={mockOnDownload}
                onDiscard={mockOnDiscard}
            />
        );
        expect(screen.getByText(/Lưu ý quan trọng/i)).toBeInTheDocument();
        expect(screen.getByText(/Google Drive/i)).toBeInTheDocument();
    });
});
