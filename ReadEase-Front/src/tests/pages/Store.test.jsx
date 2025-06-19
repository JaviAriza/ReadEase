import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Store from '../../pages/Store.jsx'
import API from '../../services/api.js'

describe('<Store />', () => {
  const books = [
    { id: 1, title: 'One' },
    { id: 2, title: 'Two' },
    { id: 3, title: 'Three' }
  ]
  beforeEach(() => {
    API.get = vi.fn().mockResolvedValue({ data: books })
  })

  it('muestra tarjetas de libros tras carga', async () => {
    render(<Store />, { wrapper: MemoryRouter })
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/One/i)).toBeInTheDocument()
      expect(screen.getByText(/Two/i)).toBeInTheDocument()
    })
  })

  it('filtra resultados por búsqueda', async () => {
    render(<Store />, { wrapper: MemoryRouter })
    await waitFor(() => screen.getByText(/One/i))
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'Two' } })
    expect(screen.queryByText(/One/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Two/i)).toBeInTheDocument()
  })
})
