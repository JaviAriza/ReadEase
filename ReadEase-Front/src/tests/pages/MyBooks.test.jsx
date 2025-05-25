import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MyBooks from '../../pages/MyBooks';

describe('MyBooks page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <MyBooks />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /my books|library/i })).toBeInTheDocument();
  });
});
