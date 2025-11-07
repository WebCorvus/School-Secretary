import { User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GroupCompactProps } from '@/types/group'
import type { GuardianProps } from '@/types/guardian'
import type { ProfessorProps } from '@/types/professor'
import type { StudentProps } from '@/types/student'
import { SubjectCompactProps } from '@/types/subject'
import { type UserProps, UserRole } from '@/types/user'

export function UserInfoCard({
    data,
    className,
}: {
    data: UserProps
    className?: string
}) {
    const profile = data.profile_details

    return (
        <Card className={`w-full ${className}`}>
            <CardHeader>
                <CardTitle>Suas Informações</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex w-full lg:w-1/2 justify-center items-center">
                        {profile?.photoUrl ? (
                            <img
                                src={profile.photoUrl}
                                alt="User Photo"
                                className="h-80 object-cover border-1 border-[var(--primary)] shadow-md"
                            />
                        ) : (
                            <User className="h-80 w-80 rounded-full border-4 border-[var(--primary)] shadow-md p-4" />
                        )}
                    </div>

                    <div className="flex w-full lg:w-1/2 justify-center items-center">
                        <ul className="space-y-2">
                            <li>
                                <strong>Nome:</strong>{' '}
                                {profile?.full_name || data.name}
                            </li>

                            {profile &&
                                'student_details' in profile &&
                                (profile as GuardianProps).student_details && (
                                    <li>
                                        <strong>Responsável por:</strong>{' '}
                                        {
                                            (profile as GuardianProps)
                                                .student_details?.full_name
                                        }
                                    </li>
                                )}

                            {profile && 'registration_number' in profile && (
                                <li>
                                    <strong>Matrícula:</strong>{' '}
                                    {
                                        (profile as StudentProps)
                                            .registration_number
                                    }
                                </li>
                            )}

                            {profile && 'phone_number' in profile && (
                                <li>
                                    <strong>Telefone:</strong>{' '}
                                    {
                                        (
                                            profile as
                                                | StudentProps
                                                | GuardianProps
                                                | ProfessorProps
                                        ).phone_number
                                    }
                                </li>
                            )}

                            <li>
                                <strong>Email:</strong> {data.email}
                            </li>

                            {profile && 'cpf' in profile && (
                                <li>
                                    <strong>CPF:</strong>{' '}
                                    {
                                        (
                                            profile as
                                                | StudentProps
                                                | GuardianProps
                                                | ProfessorProps
                                        ).cpf
                                    }
                                </li>
                            )}

                            {profile && 'birthday' in profile && (
                                <li>
                                    <strong>Data de Nascimento:</strong>{' '}
                                    {
                                        (
                                            profile as
                                                | StudentProps
                                                | GuardianProps
                                                | ProfessorProps
                                        ).birthday
                                    }
                                </li>
                            )}

                            {profile && 'address' in profile && (
                                <li>
                                    <strong>Endereço:</strong>{' '}
                                    {
                                        (
                                            profile as
                                                | StudentProps
                                                | GuardianProps
                                                | ProfessorProps
                                        ).address
                                    }
                                </li>
                            )}

                            {profile &&
                                'group_details' in profile &&
                                (profile as StudentProps).group_details && (
                                    <li>
                                        <strong>Turma:</strong>{' '}
                                        {
                                            (profile as StudentProps)
                                                .group_details?.full_name
                                        }
                                    </li>
                                )}

                            {profile &&
                                'subject_details' in profile &&
                                (profile as ProfessorProps).subject_details && (
                                    <li>
                                        <strong>Disciplina:</strong>{' '}
                                        {
                                            (profile as ProfessorProps)
                                                .subject_details?.full_name
                                        }
                                    </li>
                                )}

                            <li>
                                <strong>Função:</strong> {data.role}
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
