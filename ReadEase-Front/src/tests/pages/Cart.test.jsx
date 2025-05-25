import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../../pages/Cart';

describe('Cart page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /cart|checkout/i })).toBeInTheDocument();
  });
});
