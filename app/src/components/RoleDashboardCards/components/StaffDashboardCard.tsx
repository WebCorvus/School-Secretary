import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import { RoleDashboardCardLayout } from './RoleDashboardCardLayout'

const staffActions: DocumentRequest[] = [
    { id: 1, title: 'Gerenciar Usuários', type: 'MANAGE_USERS' },
    { id: 2, title: 'Configurações do Sistema', type: 'SYSTEM_SETTINGS' },
    { id: 3, title: 'Relatórios Gerais', type: 'GENERAL_REPORTS' },
    { id: 4, title: 'Controle de Acesso', type: 'ACCESS_CONTROL' },
]

export function StaffDashboardCard() {
    const { data: userInfo } = useUser()

    const handleClick = (item: DocumentRequest) => {
        if (!userInfo) {
            toast.error('Não foi possível acessar as informações do usuário')
            return
        }

        // For staff and superuser, link directly to Django admin
        if (userInfo.is_staff || userInfo.is_superuser) {
            switch (item.type) {
                case 'MANAGE_USERS':
                    window.location.href = NAVIGATION.ADMIN_USERS
                    break
                case 'SYSTEM_SETTINGS':
                    window.location.href = NAVIGATION.ADMIN
                    break
                case 'GENERAL_REPORTS':
                    window.location.href = NAVIGATION.ADMIN_REPORTS
                    break
                case 'ACCESS_CONTROL':
                    window.location.href = NAVIGATION.ADMIN_AUTH_GROUP
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        } else {
            // For non-staff users who somehow get this card, handle appropriately
            switch (item.type) {
                case 'MANAGE_USERS':
                    toast.info('Acesso restrito a administradores')
                    break
                case 'SYSTEM_SETTINGS':
                    toast.info('Acesso restrito a administradores')
                    break
                case 'GENERAL_REPORTS':
                    toast.info('Acesso restrito a administradores')
                    break
                case 'ACCESS_CONTROL':
                    toast.info('Acesso restrito a administradores')
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        }
    }

    if (!userInfo) {
        return null
    }

    return (
        <RoleDashboardCardLayout title="Painel Administrativo">
            <ButtonGridCard
                header="Ações Administrativas"
                description="Funcionalidades administrativas"
                data={staffActions}
                handleClick={handleClick}
            />
        </RoleDashboardCardLayout>
    )
}
