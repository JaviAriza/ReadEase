import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import MyBooks from '../../pages/MyBooks'
import API from '../../services/api'

vi.mock('../../services/api')

describe('<MyBooks />', () => {
  const books = [{ id:5, title:'My X', pdf_url:'u.pdf' }]
  beforeEach(() => {
    API.get = vi.fn().mockResolvedValue({ data: books })
    localStorage.setItem('token', 'fake.jwt')
  })

  it('muestra mis libros y botón Read', async () => {
    render(<MyBooks />, { wrapper: MemoryRouter })
    await waitFor(() => {
      expect(screen.getByText(/My X/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /read/i })).toBeInTheDocument()
    })
  })
})
