import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ROUTES } from '@/config'
import { useUser } from '@/hooks/useUser'
import { logout } from '@/services/auth'
import { UserRole } from '@/types/user'
import { AppSidebar } from './index'

vi.mock('@/hooks/useUser', () => ({
    useUser: vi.fn(),
}))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

vi.mock('@/services/auth', () => ({
    logout: vi.fn(),
}))

describe('AppSidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve renderizar o sidebar com todos os itens de navegação e o botão de logout para SUPERUSER', () => {
        ;(useUser as vi.Mock).mockReturnValue({
            data: { role: UserRole.SUPERUSER },
            loading: false,
            error: null,
        })

        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>,
        )

        expect(
            screen.getByRole('link', { name: /Início/i }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /Notificações/i }),
        ).toBeInTheDocument()

        expect(screen.getByText('Anúncios')).toBeInTheDocument()
        expect(screen.getByText('Escola')).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: /Atividades/i }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /Eventos/i }),
        ).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Aulas/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Sobre/i })).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /Painel administrativo/i }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: /Logout/i }),
        ).toBeInTheDocument()
    })

    it('deve ter os links de navegação com as URLs corretas para SUPERUSER', () => {
        ;(useUser as vi.Mock).mockReturnValue({
            data: { role: UserRole.SUPERUSER },
            loading: false,
            error: null,
        })

        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>,
        )

        expect(screen.getByRole('link', { name: /Início/i })).toHaveAttribute(
            'href',
            '/dashboard',
        )

        expect(
            screen.getByRole('link', { name: /Atividades/i }),
        ).toHaveAttribute('href', '/agenda')

        const adminLink = screen.getByRole('link', {
            name: /Painel administrativo/i,
        })
        expect(adminLink).toHaveAttribute('href', `${ROUTES.ADMIN}`)
    })

    it('deve renderizar itens de navegação corretos para STUDENT (deve ter acesso a aulas mas não ao painel admin)', () => {
        ;(useUser as vi.Mock).mockReturnValue({
            data: { role: UserRole.STUDENT },
            loading: false,
            error: null,
        })

        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>,
        )

        expect(
            screen.getByRole('link', { name: /Início/i }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /Notificações/i }),
        ).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Aulas/i })).toBeInTheDocument() // STUDENT should see classes

        expect(
            screen.queryByRole('link', { name: /Painel administrativo/i }),
        ).not.toBeInTheDocument() // STUDENT should not see admin panel
    })

    it('deve chamar a função de logout e redirecionar para a página inicial ao clicar no botão "Logout"', async () => {
        ;(useUser as vi.Mock).mockReturnValue({
            data: { role: UserRole.STUDENT },
            loading: false,
            error: null,
        })

        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>,
        )

        const logoutButton = screen.getByRole('button', { name: /Logout/i })

        fireEvent.click(logoutButton)

        expect(logout).toHaveBeenCalledTimes(1)

        expect(mockPush).toHaveBeenCalledTimes(1)
        expect(mockPush).toHaveBeenCalledWith('/')
    })
})
