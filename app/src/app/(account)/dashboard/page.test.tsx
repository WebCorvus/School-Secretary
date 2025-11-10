import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { describe, expect, it, vi } from 'vitest'
import { useUser } from '@/hooks/useUser'
import { createFakeGuardian } from '@/types/guardian'
import { createFakeProfessor } from '@/types/professor'
import { createFakeStudent } from '@/types/student'
import { createFakeUser, UserRole } from '@/types/user'
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
        const mockStudentProfile = createFakeStudent()
        const mockUser = {
            ...createFakeUser(),
            role: UserRole.STUDENT,
            profile_details: mockStudentProfile,
        }
        ;(useUser as vi.Mock).mockReturnValue({
            data: mockUser,
            loading: false,
            error: undefined,
        })

        render(<DashboardPage />)

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(
            screen.getByText(`Bem-vindo(a), ${mockStudentProfile.full_name}`),
        ).toBeInTheDocument()
        expect(
            screen.getByText(`User Info: ${mockUser.name}`),
        ).toBeInTheDocument()
        expect(screen.getByText('Requisitar Documentos')).toBeInTheDocument()
        expect(
            screen.getByText(
                `Grades Table: ${mockStudentProfile.grades_details.length} subjects`,
            ),
        ).toBeInTheDocument()

        // Mock window.open to prevent jsdom error
        Object.defineProperty(window, 'open', {
            value: vi.fn(),
            writable: true,
        })

        // Mock window.location to prevent navigation error
        const originalLocation = window.location
        Object.defineProperty(window, 'location', {
            value: {
                ...originalLocation,
                href: '',
                assign: vi.fn(),
                replace: vi.fn(),
            },
            writable: true,
        })

        // Test handleClick for ButtonGridCard
        const bulletinButton = screen.getByRole('button', { name: /Boletim/i })
        fireEvent.click(bulletinButton)
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                'Requisição de Boletim enviada com sucesso!',
            )
        })

        // Restore original location
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
        })
    })

    it('deve renderizar informações do professor e não cards específicos de aluno', () => {
        const mockProfessorProfile = createFakeProfessor()
        const mockUser = {
            ...createFakeUser(),
            role: UserRole.PROFESSOR,
            profile_details: mockProfessorProfile,
        }
        ;(useUser as vi.Mock).mockReturnValue({
            data: mockUser,
            loading: false,
            error: undefined,
        })

        render(<DashboardPage />)

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(
            screen.getByText(`Bem-vindo(a), ${mockProfessorProfile.full_name}`),
        ).toBeInTheDocument()
        expect(
            screen.getByText(`User Info: ${mockUser.name}`),
        ).toBeInTheDocument()
        expect(
            screen.queryByText('Requisitar Documentos'),
        ).not.toBeInTheDocument()
        expect(screen.queryByText(/Grades Table/i)).not.toBeInTheDocument()
    })

    it('deve renderizar informações do responsável e não cards específicos de aluno', () => {
        const mockGuardianProfile = createFakeGuardian()
        const mockUser = {
            ...createFakeUser(),
            role: UserRole.GUARDIAN,
            profile_details: mockGuardianProfile,
        }
        ;(useUser as vi.Mock).mockReturnValue({
            data: mockUser,
            loading: false,
            error: undefined,
        })

        render(<DashboardPage />)

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(
            screen.getByText(`Bem-vindo(a), ${mockGuardianProfile.full_name}`),
        ).toBeInTheDocument()
        expect(
            screen.getByText(`User Info: ${mockUser.name}`),
        ).toBeInTheDocument()
        expect(
            screen.queryByText('Requisitar Documentos'),
        ).not.toBeInTheDocument()
        expect(screen.queryByText(/Grades Table/i)).not.toBeInTheDocument()
    })
})
