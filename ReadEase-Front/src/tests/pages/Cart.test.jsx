import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Cart from '../../pages/Cart.jsx'
import API from '../../services/api.js'

describe('<Cart />', () => {
  beforeEach(() => {
    API.get = vi.fn().mockResolvedValue({ data: [{ id:1, book:{ title:'X' }, quantity:2 }] })
    localStorage.setItem('token', 'fake.jwt')
  })

  it('muestra mensaje de carrito vacío si no hay items', async () => {
    API.get.mockResolvedValueOnce({ data: [] })
    render(<Cart />, { wrapper: MemoryRouter })
    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument()
  })
})
