
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HorizontalLine from './index'

describe('HorizontalLine', () => {
  it('renders the horizontal line', () => {
    render(<HorizontalLine />)
    const hrElement = screen.getByRole('separator')
    expect(hrElement).toBeInTheDocument()
  })
})
