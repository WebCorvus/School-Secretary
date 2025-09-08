
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HorizontalLine from '../index'

describe('HorizontalLine', () => {
  it('renders the horizontal line', () => {
    const { container } = render(<HorizontalLine />)
    const hrElement = container.querySelector('hr')
    expect(hrElement).toBeInTheDocument()
  })
})
