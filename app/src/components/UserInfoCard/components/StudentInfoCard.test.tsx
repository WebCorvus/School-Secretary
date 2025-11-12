import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeStudent } from '@/types/student'
import { createFakeUser, UserRole } from '@/types/user'
import { StudentInfoCard } from './StudentInfoCard'

describe('StudentInfoCard', () => {
    it('deve renderizar as informações do aluno', () => {
        const mockStudent = createFakeStudent()
        const mockStudentData = {
            ...createFakeUser(),
            role: UserRole.STUDENT,
            profile_details: mockStudent,
        }

        render(<StudentInfoCard data={mockStudentData} />)

        expect(screen.getByText('Informações do Aluno')).toBeInTheDocument()
        expect(screen.getByText(mockStudent.full_name)).toBeInTheDocument()
        expect(
            screen.getByText(mockStudent.registration_number),
        ).toBeInTheDocument()
        expect(screen.getByText(mockStudent.phone_number)).toBeInTheDocument()
        expect(screen.getByText(mockStudentData.email)).toBeInTheDocument()
        expect(screen.getByText(mockStudent.cpf)).toBeInTheDocument()
        expect(screen.getByText(mockStudent.birthday)).toBeInTheDocument()
        expect(screen.getByText(mockStudent.address)).toBeInTheDocument()
        if (mockStudent.group_details) {
            expect(
                screen.getByText(mockStudent.group_details.full_name),
            ).toBeInTheDocument()
        }
        expect(screen.getByText(UserRole.STUDENT)).toBeInTheDocument()
    })
})
