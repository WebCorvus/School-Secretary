import { toast } from 'sonner'
import { ButtonGridCard } from '@/components/ButtonGridCard'
import { NAVIGATION } from '@/config'
import { useUser } from '@/hooks/useUser'
import type { DocumentRequest } from '@/types/documentRequest'
import { RolePanelCardLayout } from './RolePanelCardLayout'

const staffActions: DocumentRequest[] = [
    { id: 1, title: 'Gerenciar Usuários', type: 'MANAGE_USERS' },
    { id: 2, title: 'Configurações do Sistema', type: 'SYSTEM_SETTINGS' },
    { id: 3, title: 'Relatórios Gerais', type: 'GENERAL_REPORTS' },
    { id: 4, title: 'Controle de Acesso', type: 'ACCESS_CONTROL' },
    { id: 5, title: 'Gestão de Alunos', type: 'MANAGE_STUDENTS' },
    { id: 6, title: 'Gestão de Professores', type: 'MANAGE_PROFESSORS' },
    { id: 7, title: 'Gestão de Turmas', type: 'MANAGE_CLASSES' },
    { id: 8, title: 'Gestão de Aulas', type: 'MANAGE_LESSONS' },
    { id: 9, title: 'Controle Financeiro', type: 'FINANCIAL_CONTROL' },
]

export function StaffPanelCard() {
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
                    window.location.href = NAVIGATION.ADMIN_AUTH_GROUP
                    break
                case 'GENERAL_REPORTS':
                    window.location.href = NAVIGATION.ADMIN_REPORTS
                    break
                case 'ACCESS_CONTROL':
                    window.location.href = NAVIGATION.ADMIN_AUTH_GROUP
                    break
                case 'MANAGE_STUDENTS':
                    window.location.href = NAVIGATION.ADMIN_STUDENTS_STUDENT
                    break
                case 'MANAGE_PROFESSORS':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_CLASS
                    break
                case 'MANAGE_CLASSES':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_CLASS
                    break
                case 'MANAGE_LESSONS':
                    window.location.href = NAVIGATION.ADMIN_SCHOOL_CLASS
                    break
                case 'FINANCIAL_CONTROL':
                    window.location.href = NAVIGATION.FINANCIAL
                    break
                default:
                    toast.success(`Ação selecionada: ${item.title}`)
            }
        } else {
            // For non-staff users who somehow get this card, handle appropriately
            switch (item.type) {
                case 'MANAGE_USERS':
                case 'MANAGE_STUDENTS':
                case 'MANAGE_PROFESSORS':
                case 'MANAGE_CLASSES':
                case 'MANAGE_LESSONS':
                case 'SYSTEM_SETTINGS':
                case 'GENERAL_REPORTS':
                case 'ACCESS_CONTROL':
                case 'FINANCIAL_CONTROL':
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
