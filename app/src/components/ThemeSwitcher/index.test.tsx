import { fireEvent, render, screen } from '@testing-library/react'
import { useTheme } from 'next-themes'
import { describe, expect, it, vi } from 'vitest'

import { ThemeSwitcher } from './index'

vi.mock('next-themes', () => ({
    useTheme: vi.fn(),
}))

describe('ThemeSwitcher', () => {
    const mockSetTheme = vi.fn()

    beforeEach(() => {
        ;(useTheme as jest.Mock).mockReturnValue({ setTheme: mockSetTheme })
    })

    it('deve renderizar o botão de troca de tema', () => {
        render(<ThemeSwitcher />)
        expect(
            screen.getByRole('button', { name: 'Mudar Tema' }),
        ).toBeInTheDocument()
    })

    it('deve abrir o menu de temas ao clicar no botão', async () => {
        render(<ThemeSwitcher />)
        const button = screen.getByRole('button', { name: 'Mudar Tema' })
        fireEvent.click(button)

        expect(await screen.findByText(/Claro/)).toBeInTheDocument()
        expect(await screen.findByText(/Escuro/)).toBeInTheDocument()
        expect(await screen.findByText(/Sistema/)).toBeInTheDocument()
    })

    it('deve chamar setTheme com "light" ao clicar em "Claro"', async () => {
        render(<ThemeSwitcher />)
        fireEvent.click(screen.getByRole('button', { name: 'Mudar Tema' }))
        fireEvent.click(await screen.findByText(/Claro/))
        expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('deve chamar setTheme com "dark" ao clicar em "Escuro"', async () => {
        render(<ThemeSwitcher />)
        fireEvent.click(screen.getByRole('button', { name: 'Mudar Tema' }))
        fireEvent.click(await screen.findByText(/Escuro/))
        expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('deve chamar setTheme com "system" ao clicar em "Sistema"', async () => {
        render(<ThemeSwitcher />)
        fireEvent.click(screen.getByRole('button', { name: 'Mudar Tema' }))
        fireEvent.click(await screen.findByText(/Sistema/))
        expect(mockSetTheme).toHaveBeenCalledWith('system')
    })
})
