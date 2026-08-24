import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { AnnotatedPicture } from '../types/AnnotatedPicture';


// --- Mock react-router-dom, чтобы не тянуть весь роутер ---
vi.mock('react-router-dom', () => ({
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className}>{children}</a>
  ),
}));

// Импортируем компонент ПОСЛЕ mock'ов
import ProductCard from './ProductCard';

const mockProduct: AnnotatedPicture = {
  id: 42,
  name: 'Тестовое устройство',
  image: 'https://example.com/image.png',
};

describe('ProductCard', () => {
  it('рендерит имя продукта', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Тестовое устройство')).toBeInTheDocument();
  });

  it('рендерит изображение с корректным src и alt', () => {
    render(<ProductCard product={mockProduct} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('src', mockProduct.image);
    expect(img).toHaveAttribute('alt', 'Image of Тестовое устройство');
  });

  it('оборачивает содержимое в ссылку с корректным маршрутом', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/devices/42');
  });

  it('передаёт className для ссылки', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link.className).toContain('block');
    expect(link.className).toContain('cursor-pointer');
  });

  it('соответствует snapshot', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
