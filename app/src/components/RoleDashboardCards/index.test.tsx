import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RoleDashboardCards } from './index'

// Mock the useUser hook
const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({
    useUser: () => mockUseUser(),
}))

// Mock the individual dashboard cards
vi.mock('./components/StudentDashboardCard', () => ({
    StudentDashboardCard: () => (
        <div data-testid="student-dashboard-card">Student Dashboard</div>
    ),
}))

vi.mock('./components/ProfessorDashboardCard', () => ({
    ProfessorDashboardCard: () => (
        <div data-testid="professor-dashboard-card">Professor Dashboard</div>
    ),
}))

vi.mock('./components/GuardianDashboardCard', () => ({
    GuardianDashboardCard: () => (
        <div data-testid="guardian-dashboard-card">Guardian Dashboard</div>
    ),
}))

vi.mock('./components/StaffDashboardCard', () => ({
    StaffDashboardCard: () => (
        <div data-testid="staff-dashboard-card">Staff Dashboard</div>
    ),
}))

describe('RoleDashboardCards', () => {
    it('renders StudentDashboardCard for student role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'STUDENT' },
        })

        render(<RoleDashboardCards />)

        expect(screen.getByTestId('student-dashboard-card')).toBeInTheDocument()
    })

    it('renders ProfessorDashboardCard for professor role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'PROFESSOR' },
        })

        render(<RoleDashboardCards />)

        expect(
            screen.getByTestId('professor-dashboard-card'),
        ).toBeInTheDocument()
    })

    it('renders GuardianDashboardCard for guardian role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'GUARDIAN' },
        })

        render(<RoleDashboardCards />)

        expect(
            screen.getByTestId('guardian-dashboard-card'),
        ).toBeInTheDocument()
    })

    it('renders StaffDashboardCard for staff role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'STAFF' },
        })

        render(<RoleDashboardCards />)

        expect(screen.getByTestId('staff-dashboard-card')).toBeInTheDocument()
    })

    it('renders StaffDashboardCard for superuser role', () => {
        mockUseUser.mockReturnValue({
            data: { role: 'SUPERUSER' },
        })

        render(<RoleDashboardCards />)

        expect(screen.getByTestId('staff-dashboard-card')).toBeInTheDocument()
    })

    it('returns null when user info is not available', () => {
        mockUseUser.mockReturnValue({
            data: null,
        })

        render(<RoleDashboardCards />)

        expect(screen.queryByTestId(/-dashboard-card/)).not.toBeInTheDocument()
    })
})
