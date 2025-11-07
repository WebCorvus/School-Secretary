import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import { FakeStudent, type StudentProps } from '@/types/student'

export function useStudent() {
    const [data, setData] = useState<StudentProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const generateMockStudents = useCallback((): StudentProps => {
        return { ...FakeStudent }
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<StudentProps>(`${ROUTES.USER_INFO}`)
            const payload = response.data || null

            if (process.env.NODE_ENV === 'development' && !payload) {
                setData(generateMockStudents())
            } else {
                setData(payload)
            }
        } catch {
            if (process.env.NODE_ENV === 'development') {
                setData(generateMockStudents())
                setError(null)
            } else {
                setData(null)
                setError(
                    'Não foi possível carregar as informações do estudante.',
                )
            }
        } finally {
            setLoading(false)
        }
    }, [generateMockStudents])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
