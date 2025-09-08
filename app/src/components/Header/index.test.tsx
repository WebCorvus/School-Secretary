
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from './index'

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />)
    const inicioLink = screen.getByRole('link', { name: 'Início' })
    expect(inicioLink).toBeInTheDocument()
    expect(inicioLink).toHaveAttribute('href', '/')

    const estudantesLink = screen.getByRole('link', { name: 'Estudantes' })
    expect(estudantesLink).toBeInTheDocument()
    expect(estudantesLink).toHaveAttribute('href', '/students')

    const professoresLink = screen.getByRole('link', { name: 'Professores' })
    expect(professoresLink).toBeInTheDocument()
    expect(professoresLink).toHaveAttribute('href', '/professors')

    const materiasLink = screen.getByRole('link', { name: 'Matérias' })
    expect(materiasLink).toBeInTheDocument()
    expect(materiasLink).toHaveAttribute('href', '/subjects')

    const itinerariosLink = screen.getByRole('link', { name: 'Itinerários' })
    expect(itinerariosLink).toBeInTheDocument()
    expect(itinerariosLink).toHaveAttribute('href', '/itineraries')

    const turmasLink = screen.getByRole('link', { name: 'Turmas' })
    expect(turmasLink).toBeInTheDocument()
    expect(turmasLink).toHaveAttribute('href', '/groups')

    const horariosLink = screen.getByRole('link', { name: 'Horários' })
    expect(horariosLink).toBeInTheDocument()
    expect(horariosLink).toHaveAttribute('href', '/lessons')

    const eventosLink = screen.getByRole('link', { name: 'Eventos' })
    expect(eventosLink).toBeInTheDocument()
    expect(eventosLink).toHaveAttribute('href', '/events')

    const agendaLink = screen.getByRole('link', { name: 'Agenda' })
    expect(agendaLink).toBeInTheDocument()
    expect(agendaLink).toHaveAttribute('href', '/agenda')
  })
})
