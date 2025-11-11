import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProfessorPanelCard } from './ProfessorPanelCard'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the components used in ProfessorPanelCard
vi.mock('@/components/ButtonGridCard', () => ({
    ButtonGridCard: ({
        header,
        description,
    }: {
        header: string
        description: string
    }) => (
        <div data-testid="button-grid-card">
            {header}: {description}
        </div>
    ),
}))

vi.mock('./RolePanelCardLayout', () => ({
    RolePanelCardLayout: ({
        title,
        children,
    }: {
        title: string
        children: React.ReactNode
    }) => (
        <div data-testid="role-panel-card-layout" data-title={title}>
            {children}
        </div>
    ),
}))

describe('ProfessorPanelCard', () => {
    it('renders correctly for a professor user', () => {
        const mockProfessorProfile = {
            full_name: 'Dr. Smith',
            subject_details: { id: 1, full_name: 'Mathematics' },
        }

        mockUseUser.mockReturnValue({
            data: {
                profile_details: mockProfessorProfile,
                role: 'PROFESSOR',
            },
        })

        render(<ProfessorPanelCard />)

        expect(screen.getByTestId('role-panel-card-layout')).toBeInTheDocument()
        expect(screen.getByTestId('role-panel-card-layout')).toHaveAttribute(
            'data-title',
            'Painel do Professor',
        )
        expect(screen.getByTestId('button-grid-card')).toBeInTheDocument()
    })

    it('returns null when user is not a professor or profile is null', () => {
        mockUseUser.mockReturnValue({
            data: {
                profile_details: null,
                role: 'PROFESSOR',
            },
        })

        render(<ProfessorPanelCard />)

        expect(
            screen.queryByTestId('role-panel-card-layout'),
        ).not.toBeInTheDocument()
    })
})
