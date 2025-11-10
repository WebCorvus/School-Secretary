import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StaffDashboardCard } from './StaffDashboardCard'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the components used in StaffDashboardCard
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

describe('StaffDashboardCard', () => {
    it('renders correctly', () => {
        mockUseUser.mockReturnValue({
            data: {
                role: 'STAFF',
            },
        })

        render(<StaffDashboardCard />)

        expect(
            screen.getByTestId('role-dashboard-card-layout'),
        ).toBeInTheDocument()
        expect(
            screen.getByTestId('role-dashboard-card-layout'),
        ).toHaveAttribute('data-title', 'Painel Administrativo')
        expect(screen.getByTestId('button-grid-card')).toBeInTheDocument()
    })

    it('returns null when user info is not available', () => {
        mockUseUser.mockReturnValue({
            data: null,
        })

        render(<StaffDashboardCard />)

        expect(
            screen.queryByTestId('role-dashboard-card-layout'),
        ).not.toBeInTheDocument()
    })
})
