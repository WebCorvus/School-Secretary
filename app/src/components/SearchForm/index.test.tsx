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
        render(<SearchForm onSubmit={handleSubmit} />)

        const form = screen.getByRole('search')
        fireEvent.submit(form)

        expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
})
