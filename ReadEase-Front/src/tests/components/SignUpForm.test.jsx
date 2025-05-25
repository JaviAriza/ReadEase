import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

describe('SignUpForm', () => {
  it('renders three input fields (email, password, confirm password)', () => {
    render(<SignUpForm />);
    // All are "input", one type=email, two type=password
    const email = screen.getByRole('textbox');
    expect(email).toBeInTheDocument();
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBe(2);
  });
});
