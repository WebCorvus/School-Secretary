import { renderHook, waitFor } from '@testing-library/react'
import { ROUTES } from '../config'
import api from '../services/api'
import { createFakeAgendaItem } from '../types/agendaItem'
import { useAgenda } from './useAgenda'

// Mock the API service
vi.mock('@/services/api')

describe('useAgenda', () => {
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
        const { result } = renderHook(() => useAgenda())

        expect(result.current.loading).toBe(true)
        expect(result.current.data).toEqual([])
        expect(result.current.error).toBeNull()
    })

    it('should fetch agenda data successfully', async () => {
        const mockAgenda = Array.from({ length: 3 }, () =>
            createFakeAgendaItem(),
        )
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: mockAgenda })

        const { result } = renderHook(() => useAgenda())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toEqual(mockAgenda)
        expect(result.current.error).toBeNull()
        expect(api.get).toHaveBeenCalledWith(ROUTES.AGENDA)
    })

    it('should handle API error in development by returning mock agenda', async () => {
        process.env.NODE_ENV = 'development'
        ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))

        const { result } = renderHook(() => useAgenda())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data.length).toBe(10)
        expect(result.current.error).toBeNull()
    })

    it('should handle API error in production by returning error message', async () => {
        process.env.NODE_ENV = 'production'
        ;(api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))

        const { result } = renderHook(() => useAgenda())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data).toEqual([])
        expect(result.current.error).toBe('Não foi possível carregar a agenda.')
    })

    it('should handle empty data in development by returning mock agenda', async () => {
        process.env.NODE_ENV = 'development'
        ;(api.get as vi.Mock).mockResolvedValueOnce({ data: [] })

        const { result } = renderHook(() => useAgenda())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.data.length).toBe(10)
        expect(result.current.error).toBeNull()
    })

    it('should refetch agenda data when refetch is called', async () => {
        const mockAgenda1 = Array.from({ length: 2 }, () =>
            createFakeAgendaItem(),
        )
        const mockAgenda2 = Array.from({ length: 5 }, () =>
            createFakeAgendaItem(),
        )

        ;(api.get as vi.Mock)
            .mockResolvedValueOnce({ data: mockAgenda1 })
            .mockResolvedValueOnce({ data: mockAgenda2 })

        const { result } = renderHook(() => useAgenda())

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.data).toEqual(mockAgenda1)

        result.current.refetch()

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.data).toEqual(mockAgenda2)
    })
})
