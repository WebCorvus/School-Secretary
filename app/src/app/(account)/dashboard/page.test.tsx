import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useUser } from '@/hooks/useUser'
import { FakeUser, UserRole } from '@/types/user'
import DashboardPage from './page'

vi.mock('@/components/Header1', () => ({
    Header1: ({ text }: { text: string }) => <h1>{text}</h1>,
}))
vi.mock('@/components/Paragraph', () => ({
    Paragraph: ({ text }: { text: string }) => <p>{text}</p>,
}))
vi.mock('@/components/ButtonGridCard', () => ({
    ButtonGridCard: ({
        header,
        data,
        handleClick,
    }: {
        header: string
        data: Array<{ id: string | number; title: string }>
        handleClick: (item: { id: string | number; title: string }) => void
    }) => (
        <div>
            <h2>{header}</h2>
            {data.map((item) => (
                <button
                    type="button"
                    key={item.id}
                    onClick={() => handleClick(item)}
                >
                    {item.title}
                </button>
            ))}
        </div>
    ),
}))
vi.mock('@/components/UserInfoCard', () => ({
    UserInfoCard: ({ data }: { data: { name: string } }) => (
        <div>User Info: {data.name}</div>
    ),
}))
vi.mock('@/components/FullScreenLoading', () => ({
    FullScreenLoading: () => <div>Loading...</div>,
}))
vi.mock('@/components/FullScreenError', () => ({
    FullScreenError: ({ error }: { error: string }) => (
        <div>Error: {error}</div>
    ),
}))
vi.mock('@/components/GradesTableCard', () => ({
    GradesTableCard: ({ data }: { data: { length: number } }) => (
        <div>Grades Table: {data.length} subjects</div>
    ),
}))

// Mock useUser hook
vi.mock('@/hooks/useUser', () => ({
    useUser: vi.fn(),
}))

// Mock toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
    },
}))

describe('DashboardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve renderizar FullScreenLoading quando estiver carregando', () => {
        ;(useUser as vi.Mock).mockReturnValue({
            data: undefined,
            loading: true,
            error: undefined,
        })
        render(<DashboardPage />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('deve renderizar FullScreenError quando houver um erro', () => {
        ;(useUser as vi.Mock).mockReturnValue({
            data: undefined,
            loading: false,
            error: 'Test Error',
        })
        render(<DashboardPage />)
        expect(screen.getByText('Error: Test Error')).toBeInTheDocument()
    })

    it('deve renderizar FullScreenError quando não houver informações do usuário', () => {
        ;(useUser as vi.Mock).mockReturnValue({
            data: undefined,
            loading: false,
            error: undefined,
        })
        render(<DashboardPage />)
        expect(
            screen.getByText('Error: Nenhuma informação encontrada.'),
        ).toBeInTheDocument()
    })

    it('deve renderizar informações do aluno e cards específicos para aluno', async () => {
        const mockUser = { ...FakeUser, role: UserRole.STUDENT }
        ;(useUser as vi.Mock).mockReturnValue({
            data: mockUser,
            loading: false,
            error: undefined,
        })

        render(<DashboardPage />)

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(
            screen.getByText(
                `Bem-vindo(a), ${FakeUser.profile_details?.full_name}`,
            ),
        ).toBeInTheDocument()
        expect(
            screen.getByText(`User Info: ${FakeUser.name}`),
        ).toBeInTheDocument()
        expect(screen.getByText('Ações do Estudante')).toBeInTheDocument()
        expect(
            screen.getByText(
                `Grades Table: ${FakeUser.profile_details?.grades_details?.length} subjects`,
            ),
        ).toBeInTheDocument()
    })

    it('deve renderizar informações do professor e não cards específicos de aluno', () => {
        const mockProfessorUser = {
            ...FakeUser,
            role: UserRole.PROFESSOR,
            profile_details: {
                id: 2,
                full_name: 'Test Professor',
                phone_number: '11987654321',
                photoUrl: 'https://example.com/professor.jpg',
                user: 2,
                created_at: '2023-01-01T00:00:00Z',
                email: 'professor@example.com',
                address: '456 Professor Avenue',
            },
        }
        ;(useUser as vi.Mock).mockReturnValue({
            data: mockProfessorUser,
            loading: false,
            error: undefined,
        })

        render(<DashboardPage />)

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(
            screen.getByText(
                `Bem-vindo(a), ${mockProfessorUser.profile_details.full_name}`,
            ),
        ).toBeInTheDocument()
        expect(
            screen.getByText(`User Info: ${mockProfessorUser.name}`),
        ).toBeInTheDocument()
        expect(screen.queryByText('Ações do Estudante')).not.toBeInTheDocument()
        expect(screen.queryByText(/Grades Table/i)).not.toBeInTheDocument()
    })

    it('deve renderizar informações do responsável e não cards específicos de aluno', () => {
        const mockGuardianUser = {
            ...FakeUser,
            role: UserRole.GUARDIAN,
            profile_details: {
                id: 3,
                full_name: 'Test Guardian',
                phone_number: '11987654321',
                photoUrl: 'https://example.com/guardian.jpg',
                user: 3,
                created_at: '2023-01-01T00:00:00Z',
                email: 'guardian@example.com',
                address: '789 Guardian Road',
            },
        }
        ;(useUser as vi.Mock).mockReturnValue({
            data: mockGuardianUser,
            loading: false,
            error: undefined,
        })

        render(<DashboardPage />)

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(
            screen.getByText(
                `Bem-vindo(a), ${mockGuardianUser.profile_details.full_name}`,
            ),
        ).toBeInTheDocument()
        expect(
            screen.getByText(`User Info: ${mockGuardianUser.name}`),
        ).toBeInTheDocument()
        expect(screen.queryByText('Ações do Estudante')).not.toBeInTheDocument()
        expect(screen.queryByText(/Grades Table/i)).not.toBeInTheDocument()
    })
})
