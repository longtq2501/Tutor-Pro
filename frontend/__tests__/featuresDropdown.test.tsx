import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeaturesDropdown, FEATURES_DROPDOWN_ID } from '@/features/landing/components/layout/FeaturesDropdown';
import { NavBar } from '@/features/landing/components/layout/NavBar';
import { FEATURES, FEATURE_GROUPS, FEATURE_GROUP_ORDER } from '@/features/landing/config/features';

describe('FeaturesDropdown', () => {
    it('luôn nằm trong DOM và đóng/mở bằng data-open', () => {
        const { container, rerender } = render(
            <FeaturesDropdown isOpen={false} onClose={vi.fn()} />
        );

        const panel = container.querySelector('.lp-mega');
        expect(panel).not.toBeNull();
        expect(panel).toHaveAttribute('data-open', 'false');

        rerender(<FeaturesDropdown isOpen onClose={vi.fn()} />);
        expect(container.querySelector('.lp-mega')).toHaveAttribute('data-open', 'true');
    });

    it('render đủ 10 mục với đúng tên và đường dẫn', () => {
        const { container } = render(<FeaturesDropdown isOpen onClose={vi.fn()} />);

        const links = container.querySelectorAll('.lp-mega-item');
        expect(links).toHaveLength(FEATURES.length);

        FEATURES.forEach((feature) => {
            const link = container.querySelector(`a[href="/features/${feature.slug}"]`);
            expect(link).not.toBeNull();
            expect(link?.textContent).toContain(feature.name);
        });
    });

    it('hiển thị nhóm theo thứ tự Vận hành, Học vụ, Giảng dạy, Đánh giá', () => {
        const { container } = render(<FeaturesDropdown isOpen onClose={vi.fn()} />);

        const labels = Array.from(container.querySelectorAll('.lp-mega-group-label')).map(
            (node) => node.textContent
        );

        expect(labels).toEqual(FEATURE_GROUP_ORDER.map((key) => FEATURE_GROUPS[key].label));
    });

    it('gọi onClose khi bấm vào một mục', () => {
        const onClose = vi.fn();
        render(<FeaturesDropdown isOpen onClose={onClose} />);

        fireEvent.click(screen.getByText('Tổng Quan'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('NavBar — dropdown "Tính năng"', () => {
    it('bấm để mở/đóng, aria-expanded và aria-controls đúng', () => {
        render(<NavBar />);

        const trigger = screen.getByRole('button', { name: 'Tính năng' });
        const panel = document.getElementById(FEATURES_DROPDOWN_ID);

        expect(panel).not.toBeNull();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('aria-controls', FEATURES_DROPDOWN_ID);
        expect(panel).toHaveAttribute('data-open', 'false');

        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(panel).toHaveAttribute('data-open', 'true');

        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(panel).toHaveAttribute('data-open', 'false');
    });

    it('Esc đóng menu và trả focus về nút', () => {
        render(<NavBar />);

        const trigger = screen.getByRole('button', { name: 'Tính năng' });
        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(document.activeElement).toBe(trigger);
    });

    it('không đặt display inline trên .lp-nav-links (để CSS ẩn được ở mobile)', () => {
        const { container } = render(<NavBar />);

        const navLinks = container.querySelector<HTMLElement>('.lp-nav-links');
        expect(navLinks).not.toBeNull();
        expect(navLinks?.style.display).toBe('');
    });

    it('mở drawer mobile thì đóng dropdown desktop', () => {
        render(<NavBar />);

        const trigger = screen.getByRole('button', { name: 'Tính năng' });
        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');

        const hamburger = screen.getByRole('button', { name: 'Mở menu tính năng' });
        fireEvent.click(hamburger);

        expect(hamburger).toHaveAttribute('aria-expanded', 'true');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
});
