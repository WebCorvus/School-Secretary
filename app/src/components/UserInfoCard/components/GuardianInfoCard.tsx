import type { GuardianProps } from '@/types/guardian'
import type { UserProps } from '@/types/user'
import { UserDetailItem } from './UserDetailItem'
import { UserDetailSection } from './UserDetailSection'
import { UserImage } from './UserImage'
import { UserInfoCardLayout } from './UserInfoCardLayout'

export function GuardianInfoCard({
    data,
    className,
}: {
    data: UserProps
    className?: string
}) {
    const profile = data.profile_details as GuardianProps

    return (
        <UserInfoCardLayout
            title="Informações do Responsável"
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
                            value={profile?.phone_number}
                        />
                        <UserDetailItem label="Email" value={data.email} />
                        <UserDetailItem label="CPF" value={profile?.cpf} />
                        <UserDetailItem
                            label="Data de Nascimento"
                            value={profile?.birthday}
                        />
                        <UserDetailItem
                            label="Endereço"
                            value={profile?.address}
                        />
                        {profile?.student_details && (
                            <UserDetailItem
                                label="Responsável por"
                                value={profile.student_details.full_name}
                            />
                        )}
                        <UserDetailItem label="Função" value={data.role} />
                    </ul>
                </div>
            </div>

            {/* Additional guardian-specific info */}
            {profile?.student_details && (
                <UserDetailSection title="Informações do Aluno">
                    <div className="space-y-1">
                        <div>
                            <strong>Nome:</strong>{' '}
                            {profile.student_details.full_name}
                        </div>
                        <div>
                            <strong>Matrícula:</strong>{' '}
                            {profile.student_details.registration_number}
                        </div>
                    </div>
                </UserDetailSection>
            )}
        </UserInfoCardLayout>
    )
}
