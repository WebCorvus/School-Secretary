import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DashboardLink } from '@/types/dashboardLink'
import type { GuardianProps } from '@/types/guardian'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const guardianActions: DashboardLink[] = [
    { title: 'Crianças Matriculadas', url: NAVIGATION.PROFILE },
    { title: 'Notas das Crianças', url: NAVIGATION.AGENDA },
    { title: 'Frequência das Crianças', url: NAVIGATION.AGENDA },
    { title: 'Aulas das Crianças', url: NAVIGATION.LESSONS },
    { title: 'Comunicados', url: NAVIGATION.INBOX },
    { title: 'Recursos de Aprendizagem', url: NAVIGATION.RESOURCES },
    { title: 'Agenda Escolar', url: NAVIGATION.AGENDA },
]

export function GuardianPanelCard() {
    const { data: userInfo } = useUser()
    const profile = userInfo?.profile_details as GuardianProps | undefined

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
