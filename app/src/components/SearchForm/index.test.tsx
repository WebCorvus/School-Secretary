import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SearchForm } from './index'

describe('SearchForm', () => {
    it('deve renderizar o campo de busca', () => {
        render(<SearchForm />)
        expect(screen.getByLabelText('Search')).toBeInTheDocument()
    })

    it('deve enviar o formulário', () => {
        const handleSubmit = vi.fn((e) => e.preventDefault())
        const { container } = render(<SearchForm onSubmit={handleSubmit} />)

        // Find the search element using the container
        const searchElement = container.querySelector('search')

        if (searchElement) {
            fireEvent.submit(searchElement)
        }

        expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
})
