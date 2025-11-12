import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeProfessor } from '@/types/professor'
import { createFakeUser, UserRole } from '@/types/user'
import { ProfessorInfoCard } from './ProfessorInfoCard'

describe('ProfessorInfoCard', () => {
    it('deve renderizar as informações do professor', () => {
        const mockProfessor = createFakeProfessor()
        const mockProfessorData = {
            ...createFakeUser(),
            role: UserRole.PROFESSOR,
            profile_details: mockProfessor,
        }

        render(<ProfessorInfoCard data={mockProfessorData} />)

        expect(screen.getByText('Informações do Professor')).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.full_name)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.phone_number)).toBeInTheDocument()
        expect(screen.getByText(mockProfessorData.email)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.cpf)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.birthday)).toBeInTheDocument()
        expect(screen.getByText(mockProfessor.address)).toBeInTheDocument()
        if (mockProfessor.subject_details) {
            expect(
                screen.getByText(mockProfessor.subject_details.id),
            ).toBeInTheDocument()
        }
        expect(screen.getByText(UserRole.PROFESSOR)).toBeInTheDocument()
    })
})
