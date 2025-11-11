import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { GradesTableCard } from '@/components/GradesTableCard'
import { NAVIGATION, ROUTES } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DashboardLink } from '@/types/dashboardLink'
import type { StudentProps } from '@/types/student'
import { openPdfInline } from '@/utils/download-file'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const studentActions: DashboardLink[] = [
    { title: 'Meu Perfil', url: NAVIGATION.PROFILE },
    { title: 'Minhas Aulas', url: NAVIGATION.LESSONS },
    { title: 'Baixar Frequência', url: ROUTES.MY_PRESENCE },
    { title: 'Baixar Notas', url: ROUTES.MY_GRADES },
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

        if (item.url === ROUTES.MY_GRADES || item.url === ROUTES.MY_PRESENCE) {
            await openPdfInline(url, `${item.title}-${profile.full_name}.pdf`)
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
