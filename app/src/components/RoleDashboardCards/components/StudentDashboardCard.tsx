import { toast } from 'sonner'
import { NAVIGATION, ROUTES } from '@/config'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { GradesTableCard } from '@/components/GradesTableCard'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import type { StudentProps } from '@/types/student'
import { RoleDashboardCardLayout } from './RoleDashboardCardLayout'

const documentRequests: DocumentRequest[] = [
    { id: 1, title: 'Boletim', type: 'BULLETIN' },
    { id: 2, title: 'Presenças', type: 'PRESENCE' },
    { id: 3, title: 'Declaração de Matrícula', type: 'DECLARATION' },
    { id: 4, title: 'Histórico Acadêmico', type: 'HISTORY' },
]

export function StudentDashboardCard() {
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
                default:
                    toast.success(`Foi feita a requisição de: ${item.title}`)
            }
        } else {
            // For students, make API request for document
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
                default:
                    toast.success(`Foi feita a requisição de: ${item.title}`)
            }
        }
    }

    if (!profile) {
        return null
    }

    return (
        <RoleDashboardCardLayout title="Painel do Estudante">
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
        </RoleDashboardCardLayout>
    )
}
