import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../../components/Header/Header.jsx'
import { BrowserRouter } from 'react-router-dom'

describe('<Header />', () => {
  const defaultProps = {
    isLoggedIn: true,
    username: 'Juan',
    onLogout: () => {},
    toggleTheme: () => {},
    currentTheme: 'light',
    cartCount: 5
  }

  it('renderiza el logo y enlaces principales', () => {
    render(
      <BrowserRouter>
        <Header {...defaultProps} />
      </BrowserRouter>
    )
    expect(screen.getByText(/ReadEase/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument()
  })

})
