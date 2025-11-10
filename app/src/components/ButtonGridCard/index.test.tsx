import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UserProvider } from '@/contexts/UserContext'
import { createFakeButtonGridItem } from '@/types/buttonGrid'
import { ButtonGridCard } from './index'

// Mock user context
const _mockUserContext = {
    user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        is_staff: false,
        is_superuser: false,
        is_active: true,
    },
    loading: false,
    error: null,
    setUser: vi.fn(),
    getUser: vi.fn(),
    refetch: vi.fn(),
}

const MockUserProvider = ({ children }: { children: React.ReactNode }) => {
    return <UserProvider>{children}</UserProvider>
}

const mockData = [createFakeButtonGridItem(), createFakeButtonGridItem()]

const mockHandleClick = vi.fn()

describe('ButtonGridCard', () => {
    it('deve renderizar o cabeçalho e a descrição', () => {
        render(
            <MockUserProvider>
                <ButtonGridCard
                    header="Test Header"
                    description="Test Description"
                    data={mockData}
                    handleClick={mockHandleClick}
                />
            </MockUserProvider>,
        )

        expect(screen.getByText('Test Header')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('deve renderizar os botões com base nos dados fornecidos', () => {
        render(
            <MockUserProvider>
                <ButtonGridCard
                    header="Test Header"
                    data={mockData}
                    handleClick={mockHandleClick}
                />
            </MockUserProvider>,
        )

        expect(screen.getByText(mockData[0].title)).toBeInTheDocument()
        expect(screen.getByText(mockData[1].title)).toBeInTheDocument()
    })

    it('deve chamar a função handleClick quando um item é selecionado e confirmado', async () => {
        render(
            <MockUserProvider>
                <ButtonGridCard
                    header="Test Header"
                    data={mockData}
                    handleClick={mockHandleClick}
                />
            </MockUserProvider>,
        )

        const button1 = screen.getByText(mockData[0].title)
        fireEvent.click(button1)

        // Wait for modal to appear and click confirm
        const confirmButton = await screen.findByText('Confirmar')
        fireEvent.click(confirmButton)

        expect(mockHandleClick).toHaveBeenCalledTimes(1)
        expect(mockHandleClick).toHaveBeenCalledWith(mockData[0])
    })
})
