import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginForm from '../../components/LoginForm/LoginForm';

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    render(<LoginForm />);
    // Email input: type="email"
    expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
    // Password input: type="password"
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
  });
});
