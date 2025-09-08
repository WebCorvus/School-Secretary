
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../index'

describe('Footer', () => {
  it('renders the footer', () => {
    render(<Footer />)
    const footerElement = screen.getByRole('contentinfo')
    expect(footerElement).toBeInTheDocument()
  })
})
