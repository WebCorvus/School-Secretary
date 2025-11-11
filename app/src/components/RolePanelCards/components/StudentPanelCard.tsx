import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { GradesTableCard } from '@/components/GradesTableCard'
import { NAVIGATION, ROUTES } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import type { StudentProps } from '@/types/student'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const documentRequests: DocumentRequest[] = [
    { id: 1, title: 'Boletim', type: 'BULLETIN' },
    { id: 2, title: 'Presenças', type: 'PRESENCE' },
    { id: 3, title: 'Declaração de Matrícula', type: 'DECLARATION' },
    { id: 4, title: 'Histórico Acadêmico', type: 'HISTORY' },
    { id: 5, title: 'Acompanhar Aulas', type: 'MONITOR_CLASSES' },
    { id: 6, title: 'Consultar Frequência', type: 'CHECK_ATTENDANCE_NEW' },
    { id: 7, title: 'Ver Calendário Escolar', type: 'VIEW_CALENDAR' },
    { id: 8, title: 'Acessar Recursos de Aula', type: 'ACCESS_RESOURCES' },
    { id: 9, title: 'Solicitar Transferência', type: 'REQUEST_TRANSFER' },
    {
        id: 10,
        title: 'Consultar Débitos Financeiros',
        type: 'CHECK_FINANCIAL_STATUS',
    },
    { id: 11, title: 'Solicitar Segunda Chamada', type: 'REQUEST_RETAKE' },
    { id: 12, title: 'Ver Comunicados', type: 'READ_ANNOUNCEMENTS' },
]

export function StudentPanelCard() {
    const { data: userInfo } = useUser()
    const profile = userInfo?.profile_details as StudentProps | undefined

    const handleDocumentRequest = async (
        item: DocumentRequest,
        endpoint: string,
    ) => {
        try {
            // For document downloads, we need to handle the response differently
            // These endpoints return PDF files directly, so we'll open them in a new window
            const fullUrl = endpoint.startsWith('/api/')
                ? endpoint
                : `/api/${endpoint}`
            window.open(fullUrl, '_blank')

            toast.success(`Requisição de ${item.title} enviada com sucesso!`)
        } catch (error) {
            console.error(`Error requesting ${item.title}:`, error)
            toast.error(`Erro ao requisitar ${item.title}`)
        }
    }

    const handleClick = (item: DocumentRequest) => {
        if (!userInfo) {
            toast.error('Não foi possível acessar as informações do usuário')
            return
        }

        // For staff and superuser, link to Django admin sections; for students, handle document requests
        if (userInfo.is_staff || userInfo.is_superuser) {
            switch (item.type) {
                case 'BULLETIN':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_GRADE
                    break
                case 'PRESENCE':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_ATTENDANCE
                    break
                case 'DECLARATION':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_STUDENT
                    break
                case 'HISTORY':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_STUDENT
                    break
                case 'MONITOR_CLASSES':
                case 'CHECK_ATTENDANCE_NEW':
                case 'VIEW_CALENDAR':
                case 'ACCESS_RESOURCES':
                case 'REQUEST_TRANSFER':
                case 'CHECK_FINANCIAL_STATUS':
                case 'REQUEST_RETAKE':
                case 'READ_ANNOUNCEMENTS':
                    window.location.href = NAVIGATION.ADMIN
                    break
                default:
                    toast.success(`Foi feita a requisição de: ${item.title}`)
            }
        } else {
            // For students, make API request for document or navigate to appropriate page
            // Ensure the profile exists and has an ID
            if (!profile || profile.id === undefined || profile.id === null) {
                toast.error('Informações do estudante não disponíveis')
                return
            }

            switch (item.type) {
                case 'BULLETIN':
                    // Download bulletin (grades)
                    handleDocumentRequest(
                        item,
                        `${ROUTES.STUDENTS}${profile.id}/download-grades/`,
                    )
                    break
                case 'PRESENCE':
                    // Download attendance records
                    handleDocumentRequest(
                        item,
                        `${ROUTES.STUDENTS}${profile.id}/download-presence/`,
                    )
                    break
                case 'DECLARATION':
                    // For declaration, use academic report as it contains enrollment info
                    handleDocumentRequest(
                        item,
                        `${ROUTES.STUDENTS}${profile.id}/download-academic-report/`,
                    )
                    break
                case 'HISTORY':
                    // Download academic history
                    handleDocumentRequest(
                        item,
                        `${ROUTES.STUDENTS}${profile.id}/download-academic-report/`,
                    )
                    break
                case 'MONITOR_CLASSES':
                    window.location.href = NAVIGATION.AGENDA
                    break
                case 'CHECK_ATTENDANCE_NEW':
                    window.location.href = NAVIGATION.STUDENT_ATTENDANCE
                    break
                case 'VIEW_CALENDAR':
                    window.location.href = NAVIGATION.CALENDAR
                    break
                case 'ACCESS_RESOURCES':
                    window.location.href = NAVIGATION.RESOURCES_LEARNING
                    break
                case 'REQUEST_TRANSFER':
                    window.location.href = NAVIGATION.STUDENT_TRANSFER_REQUEST
                    break
                case 'CHECK_FINANCIAL_STATUS':
                    window.location.href = NAVIGATION.FINANCIAL
                    break
                case 'REQUEST_RETAKE':
                    window.location.href = NAVIGATION.STUDENT_RETAKE_REQUEST
                    break
                case 'READ_ANNOUNCEMENTS':
                    window.location.href = NAVIGATION.EVENTS
                    break
                default:
                    toast.success(`Foi feita a requisição de: ${item.title}`)
            }
        }
    }

    if (!profile) {
        return null
    }

    return (
        <RolePanelCardLayout title="Painel do Estudante">
            <div className="space-y-6">
                <ButtonGridCard
                    header="Requisitar Documentos"
                    description="São as requisições que pode fazer à escola"
                    data={documentRequests}
                    handleClick={handleClick}
                />

                {profile.grades_details && (
                    <GradesTableCard data={profile.grades_details} />
                )}
            </div>
        </RolePanelCardLayout>
    )
}
