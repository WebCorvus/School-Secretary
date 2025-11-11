import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DashboardLink } from '@/types/dashboardLink'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const staffActions: DashboardLink[] = [
    { title: 'Gerenciar Usuários', url: NAVIGATION.ADMIN_USERS },
    { title: 'Configurações do Sistema', url: NAVIGATION.ADMIN },
    { title: 'Controle de Acesso', url: NAVIGATION.ADMIN_AUTH_GROUP },
    { title: 'Gestão de Alunos', url: NAVIGATION.ADMIN_STUDENTS_STUDENT },
    { title: 'Gestão de Professores', url: NAVIGATION.ADMIN_SCHOOL_PROFESSOR },
    { title: 'Gestão de Turmas', url: NAVIGATION.ADMIN_SCHOOL_GROUP },
    { title: 'Gestão de Aulas', url: NAVIGATION.ADMIN_SCHOOL_LESSON },
    { title: 'Notas de Alunos', url: NAVIGATION.ADMIN_STUDENTS_GRADE },
    {
        title: 'Frequência de Alunos',
        url: NAVIGATION.ADMIN_STUDENTS_PRESENCE,
    },
    { title: 'Relatórios', url: NAVIGATION.ADMIN },
]

export function StaffPanelCard() {
    const { data: userInfo } = useUser()

    const handleClick = (item: DashboardLink) => {
        if (!userInfo) {
            toast.error('Não foi possível acessar as informações do usuário')
            return
        }
        window.location.href = item.url
    }

    if (!userInfo) {
        return null
    }

    return (
        <RolePanelCardLayout title="Painel Administrativo">
            <ButtonGridCard
                header="Ações Administrativas"
                description="Funcionalidades administrativas"
                data={staffActions}
                handleClick={handleClick}
            />
        </RolePanelCardLayout>
    )
}
