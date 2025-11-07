import { renderHook, waitFor } from '@testing-library/react'
import { ROUTES } from '../config'
import api from '../services/api'
import { createFakeEvent } from '../types/event'
import { useEvent } from './useEvent'

// Mock the API service
vi.mock('@/services/api')

describe('useEvent', () => {
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
        const { result } = renderHook(() => useEvent())

        expect(result.current.loading).toBe(true)
        expect(result.current.data).toEqual([])
        expect(result.current.error).toBeNull()
    })

    it('should fetch event data successfully', async () => {
        const mockEvents = Array.from({ length: 3 }, () => createFakeEvent())
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: mockEvents })

        const { result } = renderHook(() => useEvent())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toEqual(mockEvents)
        expect(result.current.error).toBeNull()
        expect(api.get).toHaveBeenCalledWith(ROUTES.EVENTS)
    })

    it('should handle API error in development by returning mock events', async () => {
        process.env.NODE_ENV = 'development'
        ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))

        const { result } = renderHook(() => useEvent())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data.length).toBe(10)
        expect(result.current.error).toBeNull()
    })

    it('should handle API error in production by returning error message', async () => {
        process.env.NODE_ENV = 'production'
        ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))

        const { result } = renderHook(() => useEvent())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toEqual([])
        expect(result.current.error).toBe(
            'Não foi possível carregar os eventos.',
        )
    })

    it('should handle empty data in development by returning mock events', async () => {
        process.env.NODE_ENV = 'development'
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: [] })

        const { result } = renderHook(() => useEvent())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data.length).toBe(10)
        expect(result.current.error).toBeNull()
    })

    it('should refetch event data when refetch is called', async () => {
        const mockEvents1 = Array.from({ length: 2 }, () => createFakeEvent())
        const mockEvents2 = Array.from({ length: 5 }, () => createFakeEvent())

        ;(api.get as vi.Mock)
            .mockResolvedValueOnce({ data: mockEvents1 })
            .mockResolvedValueOnce({ data: mockEvents2 })

        const { result } = renderHook(() => useEvent())

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.data).toEqual(mockEvents1)

        result.current.refetch()

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.data).toEqual(mockEvents2)
    })
})
