import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { ROUTES } from '@/config' // Import directly
import { UserProvider } from '@/contexts/UserContext'
import api from '@/services/api'
import { createFakeUser, FakeUser } from '@/types/user'
import { useUser } from './useUser'

// Mock the API service
vi.mock('@/services/api')

// Create a wrapper component to provide the UserContext
const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(UserProvider, null, children)

describe('useUser', () => {
    const originalNodeEnv = process.env.NODE_ENV

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks()
        process.env.NODE_ENV = originalNodeEnv // Reset NODE_ENV
    })

    afterAll(() => {
        process.env.NODE_ENV = originalNodeEnv
    })

    it('should return initial loading state', () => {
        const { result } = renderHook(() => useUser(), { wrapper })

        expect(result.current.loading).toBe(true)
        expect(result.current.data).toBeNull()
        expect(result.current.error).toBeNull()
    })

    it('should fetch user data successfully', async () => {
        const mockUser = createFakeUser()
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: mockUser })

        const { result } = renderHook(() => useUser(), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toEqual(mockUser)
        expect(result.current.error).toBeNull()
        expect(api.get).toHaveBeenCalledWith(ROUTES.USER_INFO)
    })

    it('should handle API error in development by returning FakeUser', async () => {
        process.env.NODE_ENV = 'development'
        ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))

        const { result } = renderHook(() => useUser(), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toEqual(FakeUser)
        expect(result.current.error).toBeNull()
    })

    it('should handle API error in production by returning error message', async () => {
        process.env.NODE_ENV = 'production'
        ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))

        const { result } = renderHook(() => useUser(), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toBeNull()
        expect(result.current.error).toBe(
            'Não foi possível carregar as informações do usuário.',
        )
    })

    it('should handle empty data in development by returning FakeUser', async () => {
        process.env.NODE_ENV = 'development'
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: null })

        const { result } = renderHook(() => useUser(), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toEqual(FakeUser)
        expect(result.current.error).toBeNull()
    })

    it('should refetch user data when refetch is called', async () => {
        const mockUser1 = createFakeUser()
        const mockUser2 = createFakeUser()

        ;(api.get as vi.Mock)
            .mockResolvedValueOnce({ data: mockUser1 })
            .mockResolvedValueOnce({ data: mockUser2 })

        const { result } = renderHook(() => useUser(), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.data).toEqual(mockUser1)

        result.current.refetch()

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.data).toEqual(mockUser2)
    })
})
