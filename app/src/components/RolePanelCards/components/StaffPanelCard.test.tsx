import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StaffPanelCard } from './StaffPanelCard'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the components used in StaffPanelCard
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

describe('StaffPanelCard', () => {
    it('renders correctly', () => {
        mockUseUser.mockReturnValue({
            data: {
                role: 'STAFF',
            },
        })

        render(<StaffPanelCard />)

        expect(screen.getByTestId('role-panel-card-layout')).toBeInTheDocument()
        expect(screen.getByTestId('role-panel-card-layout')).toHaveAttribute(
            'data-title',
            'Painel Administrativo',
        )
        expect(screen.getByTestId('button-grid-card')).toBeInTheDocument()
    })

    it('returns null when user info is not available', () => {
        mockUseUser.mockReturnValue({
            data: null,
        })

        render(<StaffPanelCard />)

        expect(
            screen.queryByTestId('role-panel-card-layout'),
        ).not.toBeInTheDocument()
    })
})
