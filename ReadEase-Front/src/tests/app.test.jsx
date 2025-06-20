import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App.jsx'

vi.mock('../services/api.js', () => ({
  default: { get: () => Promise.resolve({ data: [] }) }
}))

describe('<App /> Snapshots por ruta', () => {
  const paths = [
    '/',           
    '/login',       
    '/signup',     
    '/store',    
    '/cart',       
    '/my-books',    
    '/config',      
    '/read/1'       
  ]

  paths.forEach((p) => {
    it(`snapshot en ruta "${p}"`, () => {
      window.history.pushState({}, '', p)
      const { container } = render(<App />)
      expect(container).toMatchSnapshot()
    })
  })
})
