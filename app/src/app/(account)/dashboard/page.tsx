'use client'

import { FullScreenError } from '@/components/FullScreenError'
import { FullScreenLoading } from '@/components/FullScreenLoading'
import { Header1 } from '@/components/Header1'
import { Paragraph } from '@/components/Paragraph'
import { RolePanelCards } from '@/components/RolePanelCards'
import { UserInfoCard } from '@/components/UserInfoCard'
import { useUser } from '@/hooks/useUser'

export default function DashboardPage() {
    const { data: userInfo, loading, error } = useUser()

    if (loading) return <FullScreenLoading />
    if (error || !userInfo)
        return (
            <FullScreenError
                error={error || 'Nenhuma informação encontrada.'}
            />
        )

    return (
        <div className="space-y-6">
            <Header1 text="Dashboard" />
            <Paragraph
                text={`Bem-vindo(a), ${
                    userInfo.profile_details?.full_name || userInfo.name
                }`}
                className="text-2xl font-semibold my-5"
            />
            <div className="flex flex-col gap-3 ">
                <UserInfoCard data={userInfo} />
                <RolePanelCards />
            </div>
        </div>
    )
}
