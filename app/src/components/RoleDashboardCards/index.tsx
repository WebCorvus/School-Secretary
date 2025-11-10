import { useUser } from '@/hooks/useUser'
import { UserRole } from '@/types/user'
import { GuardianDashboardCard } from './components/GuardianDashboardCard'
import { ProfessorDashboardCard } from './components/ProfessorDashboardCard'
import { StaffDashboardCard } from './components/StaffDashboardCard'
import { StudentDashboardCard } from './components/StudentDashboardCard'

export function RoleDashboardCards() {
    const { data: userInfo } = useUser()

    if (!userInfo) {
        return null
    }

    // Render different components based on user role
    switch (userInfo.role) {
        case UserRole.STUDENT:
            return <StudentDashboardCard />
        case UserRole.GUARDIAN:
            return <GuardianDashboardCard />
        case UserRole.PROFESSOR:
            return <ProfessorDashboardCard />
        case UserRole.STAFF:
        case UserRole.SUPERUSER:
            return <StaffDashboardCard />
        default:
            // For unknown roles, return null or a default component
            return null
    }
}
