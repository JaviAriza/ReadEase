import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import SignUpForm from '../../components/SignUpForm/SignUpForm.jsx'
import API from '../../services/api.js'

describe('<SignUpForm />', () => {
  const onLogin = vi.fn()

  beforeEach(() => {
    onLogin.mockClear()
    API.post = vi.fn()
  })

  it('renderiza todos los campos y el botón Sign Up', () => {
    render(<SignUpForm onLogin={onLogin} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()           // Solo "Password"
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()     // Solo "Confirm Password"

    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('no envía cuando los campos están vacíos', () => {
    render(<SignUpForm onLogin={onLogin} />, { wrapper: MemoryRouter })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(API.post).not.toHaveBeenCalled()
  })

  it('envía registro válido y llama onLogin', async () => {
    API.post
      .mockResolvedValueOnce({})                    
      .mockResolvedValueOnce({ data: { token: 't', name: 'J' } })

    render(<SignUpForm onLogin={onLogin} />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'J' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'j@u.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'pass123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'pass123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(API.post).toHaveBeenNthCalledWith(1, '/users', {
        name: 'J', email: 'j@u.com', password: 'pass123'
      })
      expect(API.post).toHaveBeenNthCalledWith(2, '/auth/login', {
        email: 'j@u.com', password: 'pass123'
      })
      expect(onLogin).toHaveBeenCalledWith('t', 'J')
    })
  })
})
