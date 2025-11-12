import type { UserProps } from '@/types/user'
import { UserDetailItem } from './UserDetailItem'
import { UserDetailSection } from './UserDetailSection'
import { UserImage } from './UserImage'
import { UserInfoCardLayout } from './UserInfoCardLayout'

// Define a type for profile details that includes common fields
type ProfileDetails = {
    full_name?: string
    photoUrl?: string
    phone_number?: string
    cpf?: string
    birthday?: string
    address?: string
}

export function StaffInfoCard({
    data,
    className,
}: {
    data: UserProps
    className?: string
}) {
    const profile = data.profile_details as ProfileDetails

    return (
        <UserInfoCardLayout
            title="Informações do Funcionário"
            className={className}
        >
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-1/2">
                    <UserImage
                        photoUrl={profile?.photoUrl}
                        fullName={profile?.full_name || 'User photo'}
                    />
                </div>

                <div className="w-full lg:w-1/2 flex justify-center items-center">
                    <ul className="space-y-2">
                        <UserDetailItem
                            label="Nome"
                            value={profile?.full_name || data.name}
                        />
                        <UserDetailItem
                            label="Telefone"
                            value={profile?.phone_number || null}
                        />
                        <UserDetailItem label="Email" value={data.email} />
                        <UserDetailItem
                            label="CPF"
                            value={profile?.cpf || null}
                        />
                        <UserDetailItem
                            label="Data de Nascimento"
                            value={profile?.birthday || null}
                        />
                        <UserDetailItem
                            label="Endereço"
                            value={profile?.address || null}
                        />
                        <UserDetailItem label="Função" value={data.role} />
                    </ul>
                </div>
            </div>

            {/* Additional staff-specific info */}
            <UserDetailSection title="Detalhes da Conta">
                <div className="space-y-1">
                    <div>
                        <strong>ID:</strong> {data.id}
                    </div>
                    <div>
                        <strong>É staff:</strong>{' '}
                        {data.is_staff ? 'Sim' : 'Não'}
                    </div>
                    <div>
                        <strong>Está ativo:</strong>{' '}
                        {data.is_active ? 'Sim' : 'Não'}
                    </div>
                </div>
            </UserDetailSection>
        </UserInfoCardLayout>
    )
}
