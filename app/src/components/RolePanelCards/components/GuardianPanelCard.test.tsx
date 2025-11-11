import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GuardianPanelCard } from './GuardianPanelCard'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the components used in GuardianPanelCard
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

describe('GuardianPanelCard', () => {
    it('renders correctly for a guardian user', () => {
        const mockGuardianProfile = {
            full_name: 'Jane Smith',
            student_details: { full_name: 'John Smith' },
        }

        mockUseUser.mockReturnValue({
            data: {
                profile_details: mockGuardianProfile,
                role: 'GUARDIAN',
            },
        })

        render(<GuardianPanelCard />)

        expect(screen.getByTestId('role-panel-card-layout')).toBeInTheDocument()
        expect(screen.getByTestId('role-panel-card-layout')).toHaveAttribute(
            'data-title',
            'Painel do Responsável',
        )
        expect(screen.getByTestId('button-grid-card')).toBeInTheDocument()
    })

    it('returns null when user is not a guardian or profile is null', () => {
        mockUseUser.mockReturnValue({
            data: {
                profile_details: null,
                role: 'GUARDIAN',
            },
        })

        render(<GuardianPanelCard />)

        expect(
            screen.queryByTestId('role-panel-card-layout'),
        ).not.toBeInTheDocument()
    })
})
