import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../../components/LoginForm/LoginForm.jsx'
import API from '../../services/api.js'

describe('<LoginForm />', () => {
  const onLogin = vi.fn()

  beforeEach(() => {
    onLogin.mockClear()
    API.post = vi.fn()
  })

  it('renderiza inputs y botón', () => {
    render(<LoginForm onLogin={onLogin} />, { wrapper: BrowserRouter })
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('envía credenciales válidas y llama onLogin', async () => {
    API.post.mockResolvedValue({ data: { token: 'abc', name: 'Juan' } })
    render(<LoginForm onLogin={onLogin} />, { wrapper: BrowserRouter })

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'u@u.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/auth/login', {
        email: 'u@u.com',
        password: 'pass123'
      })
      expect(onLogin).toHaveBeenCalledWith('abc', 'Juan')
    })
  })

  it('muestra error en credenciales inválidas', async () => {
    API.post.mockRejectedValue({ response: { data: { message: 'Invalid' } } })
    render(<LoginForm onLogin={onLogin} />, { wrapper: BrowserRouter })

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'x@x.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument()
    expect(onLogin).not.toHaveBeenCalled()
  })
})
