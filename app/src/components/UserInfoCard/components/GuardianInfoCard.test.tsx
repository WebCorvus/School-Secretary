import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeGuardian } from '@/types/guardian'
import { createFakeUser, UserRole } from '@/types/user'
import { GuardianInfoCard } from './GuardianInfoCard'

describe('GuardianInfoCard', () => {
    it('deve renderizar as informações do responsável', () => {
        const mockGuardian = createFakeGuardian()
        const mockGuardianData = {
            ...createFakeUser(),
            role: UserRole.GUARDIAN,
            profile_details: mockGuardian,
        }

        render(<GuardianInfoCard data={mockGuardianData} />)

        expect(
            screen.getByText('Informações do Responsável'),
        ).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.full_name)).toBeInTheDocument()
        expect(screen.getByText('Responsável por:')).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.phone_number)).toBeInTheDocument()
        expect(screen.getByText(mockGuardianData.email)).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.cpf)).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.birthday)).toBeInTheDocument()
        expect(screen.getByText(mockGuardian.address)).toBeInTheDocument()
        expect(screen.getByText(UserRole.GUARDIAN)).toBeInTheDocument()
    })
})
