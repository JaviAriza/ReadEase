import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';

describe('Home page', () => {
  it('renders the navigation links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /store/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my books/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /configuration/i })).toBeInTheDocument();
  });
});
