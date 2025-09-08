
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './index'

describe('Footer', () => {
  it('renders the footer', () => {
    render(<Footer />)
    const footerElement = screen.getByRole('contentinfo')
    expect(footerElement).toBeInTheDocument()
    expect(screen.getByText('Secretaria Escolar - Escola Exemplo')).toBeInTheDocument()
    expect(screen.getByText('Rua das Escolas, 123 - Centro, Cidade Exemplo/EE')).toBeInTheDocument()
    expect(screen.getByText('secretaria@exemplo.exp | (00) 4002-8922')).toBeInTheDocument()
  })
})
