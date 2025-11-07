import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import { FakeUser, type UserProps } from '@/types/user'

export function useUser() {
    const [data, setData] = useState<UserProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const generateMockUser = useCallback((): UserProps => {
        return FakeUser
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<UserProps>(`${ROUTES.USER_INFO}`)
            const payload = response.data || null

            if (process.env.NODE_ENV === 'development' && !payload) {
                setData(generateMockUser())
            } else {
                setData(payload)
            }
        } catch {
            if (process.env.NODE_ENV === 'development') {
                setData(generateMockUser())
                setError(null)
            } else {
                setData(null)
                setError('Não foi possível carregar as informações do usuário.')
            }
        } finally {
            setLoading(false)
        }
    }, [generateMockUser])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
