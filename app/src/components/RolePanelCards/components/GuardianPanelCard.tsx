import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION, ROUTES } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DashboardLink } from '@/types/dashboardLink'
import type { GuardianProps } from '@/types/guardian'
import { openPdfInline } from '@/utils/download-file'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const guardianActions: DashboardLink[] = [
    { title: 'Crianças Matriculadas', url: NAVIGATION.PROFILE },
    { title: 'Boletim de Notas', url: ROUTES.MY_GRADES },
    { title: 'Relatório de Frequência', url: ROUTES.MY_PRESENCE },
    { title: 'Aulas das Crianças', url: NAVIGATION.LESSONS },
    { title: 'Comunicados', url: NAVIGATION.INBOX },
    { title: 'Recursos de Aprendizagem', url: NAVIGATION.RESOURCES },
    { title: 'Agenda Escolar', url: NAVIGATION.AGENDA },
]

export function GuardianPanelCard() {
    const { data: userInfo } = useUser()
    const profile = userInfo?.profile_details as GuardianProps | undefined

    const handleClick = async (item: DashboardLink) => {
        if (!profile?.student) {
            toast.error(
                'Informações do estudante não encontradas para gerar o link.',
            )
            return
        }

        let url = item.url

        if (url.includes('{id}')) {
            url = url.replace('{id}', String(profile.student))
        }

        if (url.includes('/pdf')) {
            await openPdfInline(
                url,
                `${item.title}-${profile.student_details?.full_name}.pdf`,
            )
        } else {
            window.location.href = url
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
