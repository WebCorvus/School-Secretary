
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from './index'

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Estudantes' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Professores' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Matérias' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Itinerários' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Turmas' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Horários' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Eventos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Agenda' })).toBeInTheDocument()
  })
})
