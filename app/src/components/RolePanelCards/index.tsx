import { useUser } from '@/hooks/useUser'
import { UserRole } from '@/types/user'
import { GuardianPanelCard } from './components/GuardianPanelCard'
import { ProfessorPanelCard } from './components/ProfessorPanelCard'
import { StaffPanelCard } from './components/StaffPanelCard'
import { StudentPanelCard } from './components/StudentPanelCard'

export function RolePanelCards() {
    const { data: userInfo } = useUser()

    if (!userInfo) {
        return null
    }

    // Render different components based on user role
    switch (userInfo.role) {
        case UserRole.STUDENT:
            return <StudentPanelCard />
        case UserRole.GUARDIAN:
            return <GuardianPanelCard />
        case UserRole.PROFESSOR:
            return <ProfessorPanelCard />
        case UserRole.STAFF:
        case UserRole.SUPERUSER:
            return <StaffPanelCard />
        default:
            // For unknown roles, return null or a default component
            return null
    }
}
