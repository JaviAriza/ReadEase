// src/tests/app.test.jsx
import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App.jsx'

// Mockeamos el cliente API para que no rompa nada en mount
vi.mock('../services/api.js', () => ({
  default: { get: () => Promise.resolve({ data: [] }) }
}))

describe('<App /> Snapshots por ruta', () => {
  const paths = [
    '/',            // Home / Store
    '/login',       // Login
    '/signup',      // Sign Up
    '/store',       // Store (repetido, pero por si tu App lo mapea)
    '/cart',        // Cart (protegida, pero snapshot mostrará el login/redirección)
    '/my-books',    // MyBooks (protegida → login redirige)
    '/config',      // Config (protegida → login redirige)
    '/read/1'       // ReadMode
  ]

  paths.forEach((p) => {
    it(`snapshot en ruta "${p}"`, () => {
      // Fijamos la URL sin envolver en otro Router
      window.history.pushState({}, '', p)
      const { container } = render(<App />)
      expect(container).toMatchSnapshot()
    })
  })
})
