import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import type { GuardianProps } from '@/types/guardian'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const guardianActions: DocumentRequest[] = [
    { id: 1, title: 'Acompanhar Boletim', type: 'MONITOR_BULLETIN' },
    { id: 2, title: 'Ver Frequência', type: 'CHECK_ATTENDANCE' },
    { id: 3, title: 'Comunicados da Escola', type: 'SCHOOL_COMMUNICATIONS' },
    { id: 4, title: 'Relatório do Aluno', type: 'STUDENT_REPORT' },
    {
        id: 5,
        title: 'Acompanhar Desempenho do Aluno',
        type: 'MONITOR_PERFORMANCE',
    },
    {
        id: 6,
        title: 'Consultar Frequência do Aluno',
        type: 'CHECK_CHILD_ATTENDANCE',
    },
    { id: 7, title: 'Receber Notificações', type: 'MANAGE_NOTIFICATIONS' },
    { id: 8, title: 'Solicitar Documentos', type: 'REQUEST_DOCUMENTS' },
    { id: 9, title: 'Contatar Professor', type: 'CONTACT_TEACHER' },
    { id: 10, title: 'Ver Calendário Escolar', type: 'VIEW_CALENDAR' },
    { id: 11, title: 'Acompanhar Tarefas Escolares', type: 'MONITOR_HOMEWORK' },
    { id: 12, title: 'Gerenciar Dados de Contato', type: 'UPDATE_CONTACT' },
]

export function GuardianPanelCard() {
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
                case 'MONITOR_PERFORMANCE':
                case 'CHECK_CHILD_ATTENDANCE':
                case 'MANAGE_NOTIFICATIONS':
                case 'REQUEST_DOCUMENTS':
                case 'CONTACT_TEACHER':
                case 'VIEW_CALENDAR':
                case 'MONITOR_HOMEWORK':
                case 'UPDATE_CONTACT':
                    window.location.href = NAVIGATION.ADMIN
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        } else {
            switch (item.type) {
                case 'MONITOR_BULLETIN':
                    window.location.href = NAVIGATION.STUDENT_GRADES
                    break
                case 'CHECK_ATTENDANCE':
                    window.location.href = NAVIGATION.STUDENT_ATTENDANCE
                    break
                case 'SCHOOL_COMMUNICATIONS':
                    window.location.href = NAVIGATION.EVENTS
                    break
                case 'STUDENT_REPORT':
                    window.location.href = NAVIGATION.PROFILE
                    break
                case 'MONITOR_PERFORMANCE':
                    window.location.href = NAVIGATION.STUDENT_GRADES
                    break
                case 'CHECK_CHILD_ATTENDANCE':
                    window.location.href = NAVIGATION.STUDENT_ATTENDANCE
                    break
                case 'MANAGE_NOTIFICATIONS':
                    window.location.href = NAVIGATION.INBOX
                    break
                case 'REQUEST_DOCUMENTS':
                    window.location.href = NAVIGATION.PROFILE
                    break
                case 'CONTACT_TEACHER':
                    window.location.href = NAVIGATION.PROFESSOR_COMMUNICATION
                    break
                case 'VIEW_CALENDAR':
                    window.location.href = NAVIGATION.CALENDAR
                    break
                case 'MONITOR_HOMEWORK':
                    window.location.href = NAVIGATION.GUARDIAN_HOMEWORK
                    break
                case 'UPDATE_CONTACT':
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
        <RolePanelCardLayout title="Painel do Responsável">
            <ButtonGridCard
                header="Ações do Responsável"
                description="Funcionalidades disponíveis para responsáveis"
                data={guardianActions}
                handleClick={handleClick}
            />
        </RolePanelCardLayout>
    )
}
