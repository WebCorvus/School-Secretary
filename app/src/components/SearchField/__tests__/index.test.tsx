
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SearchField from '../index'

describe('SearchField', () => {
  it('renders the search field', () => {
    render(<SearchField />)
    const searchElement = screen.getByLabelText('Campo de busca')
    expect(searchElement).toBeInTheDocument()
  })
})
