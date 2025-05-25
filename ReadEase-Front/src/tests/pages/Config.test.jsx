import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Config from '../../pages/Config';

describe('Config page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <Config />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /configuration page/i })).toBeInTheDocument();
  });
});
