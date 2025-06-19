// src/tests/pages/ReadMode.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ReadMode from '../../pages/ReadMode'

describe('<ReadMode />', () => {
  it('muestra encabezado y texto explicativo', () => {
    render(<ReadMode />)
    expect(screen.getByText(/reading mode/i)).toBeInTheDocument()
    expect(screen.getByText(/Here you can read/i)).toBeInTheDocument()
  })
})
