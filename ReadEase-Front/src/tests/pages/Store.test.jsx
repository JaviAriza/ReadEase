import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Store from '../../pages/Store';

describe('Store page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <Store />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /store|books/i })).toBeInTheDocument();
  });
});
