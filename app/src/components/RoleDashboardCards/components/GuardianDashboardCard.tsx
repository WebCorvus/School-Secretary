import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import type { GuardianProps } from '@/types/guardian'
import { RoleDashboardCardLayout } from './RoleDashboardCardLayout'

const guardianActions: DocumentRequest[] = [
    { id: 1, title: 'Acompanhar Boletim', type: 'MONITOR_BULLETIN' },
    { id: 2, title: 'Ver Frequência', type: 'CHECK_ATTENDANCE' },
    { id: 3, title: 'Comunicados da Escola', type: 'SCHOOL_COMMUNICATIONS' },
    { id: 4, title: 'Relatório do Aluno', type: 'STUDENT_REPORT' },
]

export function GuardianDashboardCard() {
    const { data: userInfo } = useUser()
    const profile = userInfo?.profile_details as GuardianProps | undefined

    const handleClick = (item: DocumentRequest) => {
        if (!userInfo) {
            toast.error('Não foi possível acessar as informações do usuário')
            return
        }

        if (userInfo.is_staff || userInfo.is_superuser) {
            switch (item.type) {
                case 'MONITOR_BULLETIN':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_GRADE
                    break
                case 'CHECK_ATTENDANCE':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_ATTENDANCE
                    break
                case 'SCHOOL_COMMUNICATIONS':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_ANNOUNCEMENT
                    break
                case 'STUDENT_REPORT':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_STUDENT
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        } else {
            switch (item.type) {
                case 'MONITOR_BULLETIN':
                    window.location.href = NAVIGATION.AGENDA
                    break
                case 'CHECK_ATTENDANCE':
                    window.location.href = NAVIGATION.AGENDA
                    break
                case 'SCHOOL_COMMUNICATIONS':
                    window.location.href = NAVIGATION.EVENTS
                    break
                case 'STUDENT_REPORT':
                    window.location.href = NAVIGATION.PROFILE
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        }
    }

    if (!profile) {
        return null
    }

    return (
        <RoleDashboardCardLayout title="Painel do Responsável">
            <ButtonGridCard
                header="Ações do Responsável"
                description="Funcionalidades disponíveis para responsáveis"
                data={guardianActions}
                handleClick={handleClick}
            />
        </RoleDashboardCardLayout>
    )
}
