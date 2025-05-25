import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renderiza título principal', () => {
    render(<App />);
    expect(screen.getByText(/read/i)).toBeInTheDocument();
  });
});
