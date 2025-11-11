import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DashboardLink } from '@/types/dashboardLink'
import type { ProfessorProps } from '@/types/professor'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const professorActions: DashboardLink[] = [
    { title: 'Eventos', url: NAVIGATION.EVENTS },
    { title: 'Horários', url: NAVIGATION.LESSONS },
    {
        title: 'Planejamento Semanal',
        url: NAVIGATION.WEEK_PLANNING,
    },
    { title: 'Notificações', url: NAVIGATION.INBOX },
    { title: 'Atividades', url: NAVIGATION.AGENDA },
    { title: 'Meu Perfil', url: NAVIGATION.PROFILE },
]

export function ProfessorPanelCard() {
    const { data: userInfo } = useUser()
    const profile = userInfo?.profile_details as ProfessorProps | undefined

    const handleClick = (item: DashboardLink) => {
        if (!userInfo) {
            toast.error('Não foi possível acessar as informações do usuário')
            return
        }
        window.location.href = item.url
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
