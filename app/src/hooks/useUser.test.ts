import { renderHook, waitFor } from '@testing-library/react'
import { getCookie } from 'cookies-next'
import React from 'react'
import { ROUTES } from '@/config'
import { UserProvider } from '@/contexts/UserContext'
import api from '@/services/api'
import { FakeUser } from '@/types/user'
import { useUser } from './useUser'

// Mock the API service
vi.mock('@/services/api')
// Mock cookies-next
vi.mock('cookies-next')

// Create a wrapper component to provide the UserContext
const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(UserProvider, null, children)

describe('useUser', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks()
        vi.mocked(getCookie).mockReturnValue('dummy-access-token')
        vi.stubEnv('NODE_ENV', 'development') // Default to development for most tests
        // Default mock for api.get to return FakeUser
        vi.mocked(api.get).mockResolvedValue({ data: FakeUser })
    })

    afterEach(() => {
        // No need to unstubAllEnvs if NODE_ENV is consistently set in beforeEach
    })

    it('should return initial loading state', () => {
        // For this test, we don't want the default mock to resolve immediately
        vi.mocked(api.get).mockReturnValue(new Promise(() => {})) // Pending promise
        const { result } = renderHook(() => useUser(), { wrapper })

        expect(result.current.loading).toBe(true)
        expect(result.current.data).toBeNull()
        expect(result.current.error).toBeNull()
    })

    it('should fetch user data successfully', async () => {
        const { result } = renderHook(() => useUser(), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(FakeUser))

        expect(result.current.data).toEqual(FakeUser)
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

    it('should handle empty data in development by returning FakeUser', async () => {
        process.env.NODE_ENV = 'development'
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: null })

        const { result } = renderHook(() => useUser(), { wrapper })

        await waitFor(() => expect(result.current.data).toEqual(FakeUser))

        expect(result.current.data).toEqual(FakeUser)
        expect(result.current.error).toBeNull()
    })

    it('should refetch user data when refetch is called', async () => {
        vi.mocked(api.get).mockResolvedValue({ data: FakeUser })
        const { result } = renderHook(() => useUser(), { wrapper })

        await waitFor(() => expect(result.current.data).toEqual(FakeUser))
        expect(result.current.data).toEqual(FakeUser)

        result.current.refetch()

        await waitFor(() => expect(result.current.data).toEqual(FakeUser))
        expect(result.current.data).toEqual(FakeUser)
    })
})
