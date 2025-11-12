import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RolePanelCards } from './index'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the individual panel cards
vi.mock('./components/StudentPanelCard', () => ({
    StudentPanelCard: () => (
        <div data-testid="student-panel-card">Student Panel</div>
    ),
}))

vi.mock('./components/ProfessorPanelCard', () => ({
    ProfessorPanelCard: () => (
        <div data-testid="professor-panel-card">Professor Panel</div>
    ),
}))

vi.mock('./components/GuardianPanelCard', () => ({
    GuardianPanelCard: () => (
        <div data-testid="guardian-panel-card">Guardian Panel</div>
    ),
}))

vi.mock('./components/StaffPanelCard', () => ({
    StaffPanelCard: () => <div data-testid="staff-panel-card">Staff Panel</div>,
}))

describe('RolePanelCards', () => {
    it('renders StudentPanelCard for student role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'STUDENT' },
        })

        render(<RolePanelCards />)

        expect(screen.getByTestId('student-panel-card')).toBeInTheDocument()
    })

    it('renders ProfessorPanelCard for professor role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'PROFESSOR' },
        })

        render(<RolePanelCards />)

        expect(screen.getByTestId('professor-panel-card')).toBeInTheDocument()
    })

    it('renders GuardianPanelCard for guardian role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'GUARDIAN' },
        })

        render(<RolePanelCards />)

        expect(screen.getByTestId('guardian-panel-card')).toBeInTheDocument()
    })

    it('renders StaffPanelCard for staff role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'STAFF' },
        })

        render(<RolePanelCards />)

        expect(screen.getByTestId('staff-panel-card')).toBeInTheDocument()
    })

    it('renders StaffPanelCard for superuser role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'SUPERUSER' },
        })

        render(<RolePanelCards />)

        expect(screen.getByTestId('staff-panel-card')).toBeInTheDocument()
    })

    it('returns null when user info is not available', () => {
        mockUseUser.mockReturnValue({
            data: null,
        })

        render(<RolePanelCards />)

        expect(screen.queryByTestId(/-panel-card/)).not.toBeInTheDocument()
    })
})
