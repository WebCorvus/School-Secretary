import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeGuardian } from '@/types/guardian'
import { createFakeProfessor } from '@/types/professor'
import { createFakeStudent } from '@/types/student'
import { createFakeUser, UserRole } from '@/types/user'
import { UserInfoCard } from './index'

describe('UserInfoCard', () => {
    it('deve renderizar as informações do aluno', () => {
        const mockStudent = createFakeStudent()
        const mockStudentData = {
            ...createFakeUser(),
            role: UserRole.STUDENT,
            profile_details: mockStudent,
        }

        render(<UserInfoCard data={mockStudentData} />)

        expect(screen.getByText('Suas Informações')).toBeInTheDocument()
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

    it('deve renderizar as informações do responsável', () => {
        const mockGuardian = createFakeGuardian()
        const mockGuardianData = {
            ...createFakeUser(),
            role: UserRole.GUARDIAN,
            profile_details: mockGuardian,
        }

        render(<UserInfoCard data={mockGuardianData} />)

        expect(screen.getByText('Suas Informações')).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.full_name)).toBeInTheDocument()
        expect(screen.getByText('Responsável por:')).toBeInTheDocument()
        if (mockGuardian.student_details) {
            expect(
                screen.getByText(mockGuardian.student_details.full_name),
            ).toBeInTheDocument()
        }
        expect(screen.getByText(mockGuardian.phone_number)).toBeInTheDocument()
        expect(screen.getByText(mockGuardianData.email)).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.cpf)).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.birthday)).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.address)).toBeInTheDocument()
        expect(screen.getByText(UserRole.GUARDIAN)).toBeInTheDocument()
    })

    it('deve renderizar as informações do professor', () => {
        const mockProfessor = createFakeProfessor()
        const mockProfessorData = {
            ...createFakeUser(),
            role: UserRole.PROFESSOR,
            profile_details: mockProfessor,
        }

        render(<UserInfoCard data={mockProfessorData} />)

        expect(screen.getByText('Suas Informações')).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.full_name)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.phone_number)).toBeInTheDocument()
        expect(screen.getByText(mockProfessorData.email)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.cpf)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.birthday)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.address)).toBeInTheDocument()
        if (mockProfessor.subject_details) {
            expect(
                screen.getByText(mockProfessor.subject_details.full_name),
            ).toBeInTheDocument()
        }
        expect(screen.getByText(UserRole.PROFESSOR)).toBeInTheDocument()
    })
})
