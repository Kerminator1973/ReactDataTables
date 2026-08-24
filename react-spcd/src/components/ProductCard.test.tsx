import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProductCard from './ProductCard';
import type { AnnotatedPicture } from '../types/AnnotatedPicture';

describe('ProductCard', () => {
  it('отображает название товара', () => {
    const product = { id: 1, name: 'Тестовый товар', image: '/img.png' } as AnnotatedPicture;

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    expect(screen.getByText('Тестовый товар')).toBeTruthy();
  })
});
