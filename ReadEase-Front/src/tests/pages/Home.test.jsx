import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../pages/Home.jsx'

describe('<Home />', () => {
  it('muestra los tres enlaces principales', () => {
    render(<Home />, { wrapper: MemoryRouter })
    const labels = ['Store', 'My Books', 'Configuration']
    labels.forEach(text => {
      expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument()
    })
  })
})
