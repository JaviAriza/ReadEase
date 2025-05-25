import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ReadMode from '../../pages/ReadMode';

describe('ReadMode page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <ReadMode />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /reading mode/i })).toBeInTheDocument();
  });
});
