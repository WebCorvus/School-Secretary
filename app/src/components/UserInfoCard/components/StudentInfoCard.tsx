import type { StudentProps } from '@/types/student'
import type { UserProps } from '@/types/user'
import { UserDetailItem } from './UserDetailItem'
import { UserDetailSection } from './UserDetailSection'
import { UserImage } from './UserImage'
import { UserInfoCardLayout } from './UserInfoCardLayout'

export function StudentInfoCard({
    data,
    className,
}: {
    data: UserProps
    className?: string
}) {
    const profile = data.profile_details as StudentProps

    return (
        <UserInfoCardLayout title="Informações do Aluno" className={className}>
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
                            label="Matrícula"
                            value={profile?.registration_number}
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
                        {profile?.group_details && (
                            <UserDetailItem
                                label="Turma"
                                value={profile.group_details.full_name}
                            />
                        )}
                        <UserDetailItem label="Função" value={data.role} />
                    </ul>
                </div>
            </div>

            {/* Additional student-specific info */}
            {profile?.guardians_details &&
                profile.guardians_details.length > 0 && (
                    <UserDetailSection title="Responsáveis">
                        <div className="space-y-2">
                            {profile.guardians_details.map(
                                (guardian, index) => (
                                    <div
                                        key={`guardian-${index}-${guardian.full_name}`}
                                        className="p-2 border rounded"
                                    >
                                        <div>
                                            <strong>Nome:</strong>{' '}
                                            {guardian.full_name}
                                        </div>
                                        <div>
                                            <strong>Telefone:</strong>{' '}
                                            {guardian.phone_number}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </UserDetailSection>
                )}
        </UserInfoCardLayout>
    )
}
