import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { GradesTableCard } from '@/components/GradesTableCard'
import { NAVIGATION, ROUTES } from '@/config'
import { useUser } from '@/hooks/useUser'
import api from '@/services/api'
import type { DashboardLink } from '@/types/dashboardLink'
import type { StudentProps } from '@/types/student'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const studentActions: DashboardLink[] = [
    { title: 'Meu Perfil', url: NAVIGATION.PROFILE },
    { title: 'Minhas Aulas', url: NAVIGATION.LESSONS },
    { title: 'Minha Frequência', url: ROUTES.MY_PRESENCE },
    { title: 'Recursos de Aprendizagem', url: NAVIGATION.RESOURCES },
    { title: 'Eventos', url: NAVIGATION.EVENTS },
    { title: 'Plano Semanal', url: NAVIGATION.WEEK_PLANNING },
]

export function StudentPanelCard() {
    const { data: userInfo } = useUser()
    const profile = userInfo?.profile_details as StudentProps | undefined

    const handleClick = async (item: DashboardLink) => {
        if (!profile?.id) {
            toast.error(
                'Informações do estudante não encontradas para gerar o link.',
            )
            return
        }

        let url = item.url

        if (url.includes('{id}')) {
            url = url.replace('{id}', String(profile.id))
        }

        if (url.includes('/pdf')) {
            try {
                const response = await api.get(url, { responseType: 'blob' })
                const blob = new Blob([response.data], {
                    type: 'application/pdf',
                })
                const fileURL = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = fileURL
                link.setAttribute(
                    'download',
                    `${item.title}-${profile.full_name}.pdf`,
                )
                document.body.appendChild(link)
                link.click()
                link.remove()
                URL.revokeObjectURL(fileURL)
            } catch (error) {
                toast.error(
                    'Não foi possível baixar o PDF. Tente novamente mais tarde.',
                )
                console.error('Error downloading PDF:', error)
            }
        } else {
            window.location.href = url
        }
    }

    if (!userInfo) {
        toast.error('Não foi possível acessar as informações do usuário')
        return
    }

    if (!profile) {
        return null
    }

    return (
        <RolePanelCardLayout title="Painel do Estudante">
            <div className="space-y-6">
                <ButtonGridCard
                    header="Ações do Estudante"
                    description="Funcionalidades disponíveis para estudantes"
                    data={studentActions}
                    handleClick={handleClick}
                />

                {profile.grades_details && (
                    <GradesTableCard data={profile.grades_details} />
                )}
            </div>
        </RolePanelCardLayout>
    )
}
