
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../index'

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />)
    const headerElement = screen.getByText('Início')
    expect(headerElement).toBeInTheDocument()
  })
})
