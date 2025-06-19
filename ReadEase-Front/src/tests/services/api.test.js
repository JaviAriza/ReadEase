import API from '../../services/api.js'
import { describe, it, expect } from 'vitest'

describe('API service', () => {
  it('tiene defaults.baseURL definido', () => {
    expect(API).toBeDefined()
    expect(API.defaults).toBeDefined()
    expect(typeof API.defaults.baseURL).toBe('string')
    expect(API.defaults.baseURL).toMatch(/^http/)
  })

  it('expone métodos HTTP básicos', () => {
    expect(typeof API.get).toBe('function')
    expect(typeof API.post).toBe('function')
    expect(typeof API.put).toBe('function')
    expect(typeof API.delete).toBe('function')
  })
})
