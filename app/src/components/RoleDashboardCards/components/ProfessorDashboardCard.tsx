import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import type { ProfessorProps } from '@/types/professor'
import { RoleDashboardCardLayout } from './RoleDashboardCardLayout'

const professorActions: DocumentRequest[] = [
    { id: 1, title: 'Lançar Notas', type: 'GRADE_INPUT' },
    { id: 2, title: 'Marcar Presenças', type: 'ATTENDANCE_MARK' },
    { id: 3, title: 'Relatório de Turma', type: 'CLASS_REPORT' },
    { id: 4, title: 'Plano de Aula', type: 'LESSON_PLAN' },
]

export function ProfessorDashboardCard() {
    const { data: userInfo } = useUser()
    const profile = userInfo?.profile_details as ProfessorProps | undefined

    const handleClick = (item: DocumentRequest) => {
        if (!userInfo) {
            toast.error('Não foi possível acessar as informações do usuário')
            return
        }

        // For staff and superuser, link to Django admin sections; for professors, handle their specific tasks
        if (userInfo.is_staff || userInfo.is_superuser) {
            switch (item.type) {
                case 'GRADE_INPUT':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_GRADE
                    break
                case 'ATTENDANCE_MARK':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_ATTENDANCE
                    break
                case 'CLASS_REPORT':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_CLASS
                    break
                case 'LESSON_PLAN':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_LESSON_PLAN
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        } else {
            // For professors, handle their specific tasks
            switch (item.type) {
                case 'GRADE_INPUT':
                    // Navigate to week planning page for grade input
                    window.location.href = NAVIGATION.WEEK_PLANNING
                    break
                case 'ATTENDANCE_MARK':
                    // Navigate to week planning page for attendance
                    window.location.href = NAVIGATION.WEEK_PLANNING
                    break
                case 'CLASS_REPORT':
                    // Navigate to week planning page for class report
                    window.location.href = NAVIGATION.WEEK_PLANNING
                    break
                case 'LESSON_PLAN':
                    // Navigate to week planning page for lesson plan
                    window.location.href = NAVIGATION.WEEK_PLANNING
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
        <RoleDashboardCardLayout title="Painel do Professor">
            <ButtonGridCard
                header="Ações do Professor"
                description="Funcionalidades disponíveis para professores"
                data={professorActions}
                handleClick={handleClick}
            />
        </RoleDashboardCardLayout>
    )
}
