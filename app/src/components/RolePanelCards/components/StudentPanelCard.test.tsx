import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StudentPanelCard } from './StudentPanelCard'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the components used in StudentPanelCard
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

interface Grade {
    id: number
    subject: string
    grade: string
}

vi.mock('@/components/GradesTableCard', () => ({
    GradesTableCard: ({ data }: { data: Grade[] }) => (
        <div data-testid="grades-table-card">
            Grades Table: {data.length} items
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

describe('StudentPanelCard', () => {
    it('renders correctly for a student user', () => {
        const mockStudentProfile = {
            full_name: 'John Doe',
            grades_details: [{ id: 1, subject: 'Math', grade: 'A' }],
        }

        mockUseUser.mockReturnValue({
            data: {
                profile_details: mockStudentProfile,
                role: 'STUDENT',
            },
        })

        render(<StudentPanelCard />)

        expect(screen.getByTestId('role-panel-card-layout')).toBeInTheDocument()
        expect(screen.getByTestId('role-panel-card-layout')).toHaveAttribute(
            'data-title',
            'Painel do Estudante',
        )
        expect(screen.getByTestId('button-grid-card')).toBeInTheDocument()
    })

    it('renders without grades if no grades_details', () => {
        const mockStudentProfile = {
            full_name: 'John Doe',
            grades_details: null,
        }

        mockUseUser.mockReturnValue({
            data: {
                profile_details: mockStudentProfile,
                role: 'STUDENT',
            },
        })

        render(<StudentPanelCard />)

        expect(screen.getByTestId('role-panel-card-layout')).toBeInTheDocument()
        expect(screen.getByTestId('role-panel-card-layout')).toHaveAttribute(
            'data-title',
            'Painel do Estudante',
        )
        expect(screen.getByTestId('button-grid-card')).toBeInTheDocument()
        // Should not contain grades table card
        expect(
            screen.queryByTestId('grades-table-card'),
        ).not.toBeInTheDocument()
    })

    it('returns null when user is not a student or profile is null', () => {
        mockUseUser.mockReturnValue({
            data: {
                profile_details: null,
                role: 'STUDENT',
            },
        })

        render(<StudentPanelCard />)

        expect(
            screen.queryByTestId('role-panel-card-layout'),
        ).not.toBeInTheDocument()
    })
})
