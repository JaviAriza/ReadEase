// src/tests/components/Footer.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../../components/Footer/Footer'

describe('<Footer />', () => {
  it('muestra texto de copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/©/i)).toBeInTheDocument()
  })
})
