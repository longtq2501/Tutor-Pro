import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LandingPage from '@/app/page';

describe('Landing Page (phiên bản B2)', () => {
    it('renders hero headline theo thiết kế mới', () => {
        render(<LandingPage />);
        expect(screen.getByText(/Bạn lo dạy hay/i)).toBeInTheDocument();
        expect(screen.getByText(/Tutor Pro lo phần còn lại/i)).toBeInTheDocument();
    });

    it('renders flow intro với 5 bước tóm tắt', () => {
        render(<LandingPage />);
        expect(screen.getByText(/Một buổi dạy, từ đầu đến cuối/i)).toBeInTheDocument();
        // Chip lables
        expect(screen.getByText('Xếp lịch')).toBeInTheDocument();
        expect(screen.getByText('Dạy học')).toBeInTheDocument();
        expect(screen.getByText('Nhận xét')).toBeInTheDocument();
        expect(screen.getByText('Thu học phí')).toBeInTheDocument();
        expect(screen.getByText('Theo dõi tiến độ')).toBeInTheDocument();
    });

    it('có nhiều nút CTA "Dùng thử miễn phí" theo spec', () => {
        render(<LandingPage />);
        const buttons = screen.getAllByText(/Dùng thử miễn phí/i);
        // Navbar + Hero + CTA cuối → ít nhất 2-3
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('không hiển thị số liệu kỹ thuật hay placeholder cũ', () => {
        render(<LandingPage />);
        expect(screen.queryByText(/<\s*800ms/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/<\s*500ms/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/SSE Realtime/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/WebRTC/i)).not.toBeInTheDocument();
    });

    it('không hiển thị badge "đang phát triển" (theo spec §5.2)', () => {
        render(<LandingPage />);
        expect(screen.queryByText(/đang phát triển/i)).not.toBeInTheDocument();
    });

    it('không hiển thị testimonials giả (backlog §10)', () => {
        render(<LandingPage />);
        expect(screen.queryByText(/Phản hồi từ người dùng thật/i)).not.toBeInTheDocument();
    });

    it('có nút secondary "Xem Tutor Pro làm gì" ở hero', () => {
        render(<LandingPage />);
        expect(screen.getByText(/Xem Tutor Pro làm gì/i)).toBeInTheDocument();
    });

    it('có CTA cuối trang theo spec §5.5', () => {
        render(<LandingPage />);
        expect(screen.getByText(/Sẵn sàng dạy nhẹ nhàng hơn/i)).toBeInTheDocument();
        expect(screen.getByText(/Dùng thử miễn phí, bắt đầu trong vài phút/i)).toBeInTheDocument();
    });
});

describe('Features Page', () => {
    it('renders without crashing', async () => {
        const { default: FeaturesPage } = await import('@/app/features/page');
        render(<FeaturesPage />);
        expect(document.body).toBeTruthy();
    });
});

describe('Pricing Page', () => {
    it('renders without crashing', async () => {
        const { default: PricingPage } = await import('@/app/pricing/page');
        render(<PricingPage />);
        expect(document.body).toBeTruthy();
    });
});
