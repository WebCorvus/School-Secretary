import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeUser, UserRole } from '@/types/user'
import { StaffInfoCard } from './StaffInfoCard'

describe('StaffInfoCard', () => {
    it('deve renderizar as informações do funcionário', () => {
        const mockStaffData = {
            ...createFakeUser(),
            role: UserRole.STAFF,
            profile_details: undefined, // Ensure no profile_details to avoid name override
        }

        render(<StaffInfoCard data={mockStaffData} />)

        expect(
            screen.getByText('Informações do Funcionário'),
        ).toBeInTheDocument()
        expect(screen.getByText(mockStaffData.name)).toBeInTheDocument()
        expect(screen.getByText(mockStaffData.email)).toBeInTheDocument()
        expect(screen.getByText(mockStaffData.role)).toBeInTheDocument()
        expect(screen.getByText('ID:')).toBeInTheDocument()
        expect(screen.getByText('É staff:')).toBeInTheDocument()
        expect(screen.getByText('Está ativo:')).toBeInTheDocument()
    })
})
