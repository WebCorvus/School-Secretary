import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import SearchField from './index'

describe('SearchField', () => {
    it('deve renderizar o campo de busca e o botão', () => {
        render(<SearchField onSearch={() => {}} />)
        expect(screen.getByLabelText('Campo de busca')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Buscar' }),
        ).toBeInTheDocument()
    })

    it('deve atualizar o valor do input ao digitar', () => {
        render(<SearchField onSearch={() => {}} />)
        const input = screen.getByLabelText('Campo de busca')
        fireEvent.change(input, { target: { value: 'test search' } })
        expect(input).toHaveValue('test search')
    })

    it('deve chamar onSearch com o valor correto ao enviar', () => {
        const mockOnSearch = vi.fn()
        render(<SearchField onSearch={mockOnSearch} />)
        const input = screen.getByLabelText('Campo de busca')
        const button = screen.getByRole('button', { name: 'Buscar' })

        fireEvent.change(input, { target: { value: 'test search' } })
        fireEvent.click(button)

        expect(mockOnSearch).toHaveBeenCalledTimes(1)
        expect(mockOnSearch).toHaveBeenCalledWith('test search')
    })
})
