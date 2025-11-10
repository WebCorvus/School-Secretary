import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GuardianDashboardCard } from './GuardianDashboardCard'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the components used in GuardianDashboardCard
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

vi.mock('./RoleDashboardCardLayout', () => ({
    RoleDashboardCardLayout: ({
        title,
        children,
    }: {
        title: string
        children: React.ReactNode
    }) => (
        <div data-testid="role-dashboard-card-layout" data-title={title}>
            {children}
        </div>
    ),
}))

describe('GuardianDashboardCard', () => {
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

        render(<GuardianDashboardCard />)

        expect(
            screen.getByTestId('role-dashboard-card-layout'),
        ).toBeInTheDocument()
        expect(
            screen.getByTestId('role-dashboard-card-layout'),
        ).toHaveAttribute('data-title', 'Painel do Responsável')
        expect(screen.getByTestId('button-grid-card')).toBeInTheDocument()
    })

    it('returns null when user is not a guardian or profile is null', () => {
        mockUseUser.mockReturnValue({
            data: {
                profile_details: null,
                role: 'GUARDIAN',
            },
        })

        render(<GuardianDashboardCard />)

        expect(
            screen.queryByTestId('role-dashboard-card-layout'),
        ).not.toBeInTheDocument()
    })
})
