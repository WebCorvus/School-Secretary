
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchField from './index'

describe('SearchField', () => {
  it('renders the search field and button', () => {
    const onSearch = vi.fn()
    render(<SearchField onSearch={onSearch} />)
    const searchInput = screen.getByLabelText('Campo de busca')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    expect(searchInput).toBeInTheDocument()
    expect(searchButton).toBeInTheDocument()
  })

  it('calls onSearch with the correct value when submitted', () => {
    const onSearch = vi.fn()
    render(<SearchField onSearch={onSearch} />)
    const searchInput = screen.getByLabelText('Campo de busca')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })

    fireEvent.change(searchInput, { target: { value: 'test query' } })
    fireEvent.click(searchButton)

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('test query')
  })
})
