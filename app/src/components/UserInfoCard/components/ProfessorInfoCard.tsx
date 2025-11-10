import type { ProfessorProps } from '@/types/professor'
import type { UserProps } from '@/types/user'
import { UserDetailItem } from './UserDetailItem'
import { UserDetailSection } from './UserDetailSection'
import { UserImage } from './UserImage'
import { UserInfoCardLayout } from './UserInfoCardLayout'

export function ProfessorInfoCard({
    data,
    className,
}: {
    data: UserProps
    className?: string
}) {
    const profile = data.profile_details as ProfessorProps

    return (
        <UserInfoCardLayout
            title="Informações do Professor"
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
                        {profile?.subject_details && (
                            <UserDetailItem
                                label="Disciplina"
                                value={profile.subject_details.full_name}
                            />
                        )}
                        <UserDetailItem label="Função" value={data.role} />
                    </ul>
                </div>
            </div>

            {/* Additional professor-specific info */}
            {profile?.subject_details && (
                <UserDetailSection title="Informações da Disciplina">
                    <div className="space-y-1">
                        <div>
                            <strong>Nome:</strong>{' '}
                            {profile.subject_details.full_name}
                        </div>
                        <div>
                            <strong>Código:</strong>{' '}
                            {profile.subject_details.id}
                        </div>
                    </div>
                </UserDetailSection>
            )}
        </UserInfoCardLayout>
    )
}
