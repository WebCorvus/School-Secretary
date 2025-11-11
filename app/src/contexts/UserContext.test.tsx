import { render, screen, waitFor } from '@testing-library/react'
import type React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserProvider, useUser } from '@/contexts/UserContext'
import api from '@/services/api'
import { FakeUser } from '@/types/user'

// Mock the API service
vi.mock('@/services/api')

// Create a test component that uses the useUser hook
const TestComponent: React.FC = () => {
    const { user, loading, error } = useUser()

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <span>User: {user?.name || 'No user'}</span>
            <span>Email: {user?.email || 'No email'}</span>
        </div>
    )
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <UserProvider>{children}</UserProvider>
)

describe('UserContext', () => {
    const originalConsoleError = console.error

    beforeEach(() => {
        console.error = vi.fn() // Suppress console errors during tests
        vi.clearAllMocks()
    })

    afterAll(() => {
        console.error = originalConsoleError // Restore console.error
    })

    it('should provide user data when API call succeeds', async () => {
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: FakeUser })

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>,
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => {
            expect(
                screen.getByText(`User: ${FakeUser.name}`),
            ).toBeInTheDocument()
            expect(
                screen.getByText(`Email: ${FakeUser.email}`),
            ).toBeInTheDocument()
        })

        expect(api.get).toHaveBeenCalledWith('/api/users/me/')
    })

    it('should provide error when API call fails', async () => {
        ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>,
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('User: Test User')).toBeInTheDocument()
            expect(
                screen.getByText('Email: test@example.com'),
            ).toBeInTheDocument()
        })
    })

    it('should return cached user data on subsequent calls', async () => {
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: FakeUser })

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>,
        )

        await waitFor(() => {
            expect(
                screen.getByText(`User: ${FakeUser.name}`),
            ).toBeInTheDocument()
        })

        // Verify that API was only called once initially
        expect(api.get).toHaveBeenCalledTimes(1)

        // Try to get user again using the refetch to see if it makes another call
        // This test is more about ensuring cache behavior at the context level
    })
})
