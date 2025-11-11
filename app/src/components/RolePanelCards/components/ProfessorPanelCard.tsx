import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import type { ProfessorProps } from '@/types/professor'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const professorActions: DocumentRequest[] = [
    { id: 1, title: 'Lançar Notas', type: 'GRADE_INPUT' },
    { id: 2, title: 'Marcar Presenças', type: 'ATTENDANCE_MARK' },
    { id: 3, title: 'Relatório de Turma', type: 'CLASS_REPORT' },
    { id: 4, title: 'Plano de Aula', type: 'LESSON_PLAN' },
    { id: 5, title: 'Lançar Frequência', type: 'RECORD_ATTENDANCE' },
    { id: 6, title: 'Criar Plano de Aula', type: 'CREATE_LESSON_PLAN' },
    { id: 7, title: 'Gerenciar Turmas', type: 'MANAGE_CLASSES' },
    { id: 8, title: 'Registrar Ocorrências', type: 'RECORD_INCIDENTS' },
    {
        id: 9,
        title: 'Comunicar com Responsáveis',
        type: 'COMMUNICATE_GUARDIANS',
    },
    { id: 10, title: 'Solicitar Recursos', type: 'REQUEST_RESOURCES' },
    {
        id: 11,
        title: 'Consultar Agenda Acadêmica',
        type: 'VIEW_ACADEMIC_SCHEDULE',
    },
]

export function ProfessorPanelCard() {
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
                case 'RECORD_ATTENDANCE':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_ATTENDANCE
                    break
                case 'CLASS_REPORT':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_CLASS
                    break
                case 'LESSON_PLAN':
                case 'CREATE_LESSON_PLAN':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_LESSON_PLAN
                    break
                case 'MANAGE_CLASSES':
                case 'RECORD_INCIDENTS':
                case 'COMMUNICATE_GUARDIANS':
                case 'REQUEST_RESOURCES':
                case 'VIEW_ACADEMIC_SCHEDULE':
                    window.location.href = NAVIGATION.ADMIN
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        } else {
            // For professors, handle their specific tasks
            switch (item.type) {
                case 'GRADE_INPUT':
                    window.location.href = NAVIGATION.PROFESSOR_GRADES
                    break
                case 'ATTENDANCE_MARK':
                case 'RECORD_ATTENDANCE':
                    window.location.href = NAVIGATION.PROFESSOR_ATTENDANCE
                    break
                case 'CLASS_REPORT':
                    window.location.href = NAVIGATION.AGENDA
                    break
                case 'LESSON_PLAN':
                case 'CREATE_LESSON_PLAN':
                    window.location.href = NAVIGATION.PROFESSOR_LESSON_PLANS
                    break
                case 'MANAGE_CLASSES':
                    window.location.href = NAVIGATION.GROUPS
                    break
                case 'RECORD_INCIDENTS':
                    window.location.href = NAVIGATION.PROFESSOR_INCIDENTS
                    break
                case 'COMMUNICATE_GUARDIANS':
                    window.location.href = NAVIGATION.PROFESSOR_COMMUNICATION
                    break
                case 'REQUEST_RESOURCES':
                    // Navigate to resource management
                    window.location.href = NAVIGATION.RESOURCES
                    break
                case 'VIEW_ACADEMIC_SCHEDULE':
                    window.location.href = NAVIGATION.ACADEMIC_SCHEDULE
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
        <RolePanelCardLayout title="Painel do Professor">
            <ButtonGridCard
                header="Ações do Professor"
                description="Funcionalidades disponíveis para professores"
                data={professorActions}
                handleClick={handleClick}
            />
        </RolePanelCardLayout>
    )
}
