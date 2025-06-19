// src/tests/pages/LoginPage.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Login from '../../pages/Login'

describe('<LoginPage />', () => {
  it('renderiza LoginForm en /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/*" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renderiza SignUpForm en /signup', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/*" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })
})
