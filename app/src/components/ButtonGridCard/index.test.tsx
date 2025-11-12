import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UserContext } from '@/contexts/UserContext'
import { createFakeDashboardLink } from '@/types/dashboardLink'
import { ButtonGridCard } from './index'

// Mock user context
const mockUserContext = {
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
    return (
        <UserContext.Provider value={mockUserContext}>
            {children}
        </UserContext.Provider>
    )
}

const mockData = [createFakeDashboardLink(), createFakeDashboardLink()]

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

    it('deve chamar a função handleClick diretamente quando o usuário é staff', () => {
        const mockUserContextWithStaff = {
            ...mockUserContext,
            user: {
                ...mockUserContext.user,
                is_staff: true,
            },
        }

        render(
            <UserContext.Provider value={mockUserContextWithStaff}>
                <ButtonGridCard
                    header="Test Header"
                    data={mockData}
                    handleClick={mockHandleClick}
                />
            </UserContext.Provider>,
        )

        const button1 = screen.getByText(mockData[0].title)
        fireEvent.click(button1)

        expect(mockHandleClick).toHaveBeenCalledTimes(1)
        expect(mockHandleClick).toHaveBeenCalledWith(mockData[0])
    })
})
