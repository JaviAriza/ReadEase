import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Configuration from '../../pages/Config.jsx'

describe('<Configuration />', () => {
  it('renderiza los campos con los placeholders correctos', () => {
    render(<Configuration />, { wrapper: MemoryRouter })
    expect(screen.getByPlaceholderText(/new name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/current password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument()
  })
})
