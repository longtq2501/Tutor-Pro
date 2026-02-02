import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FeatureShowcase from '../FeatureShowcase';

describe('FeatureShowcase Component', () => {
    it('renders the section title and subtitle', () => {
        render(<FeatureShowcase />);
        expect(screen.getByText(/Mọi công cụ bạn cần/i)).toBeDefined();
        expect(screen.getByText(/Trong một nền tảng duy nhất/i)).toBeDefined();
    });

    it('renders all core features including Live Teaching', () => {
        render(<FeatureShowcase />);
        const features = [
            'Lớp học Tương tác',
            'Lịch dạy Thông minh',
            'Khảo thí & Chấm điểm',
            'Quản lý Tài chính',
            'Kho tài liệu 3D'
        ];

        features.forEach(feature => {
            expect(screen.getByText(feature)).toBeDefined();
        });
    });

    it('renders the visual mockups for each feature', () => {
        const { container } = render(<FeatureShowcase />);
        // Select main feature items specifically by their structure
        const visuals = container.querySelectorAll('#features .flex.flex-col.gap-32 > div');
        expect(visuals.length).toBe(5);
    });
});
