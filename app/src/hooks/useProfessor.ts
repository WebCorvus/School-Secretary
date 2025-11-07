import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import { FakeProfessor, type ProfessorProps } from '@/types/professor'

export function useProfessor() {
    const [data, setData] = useState<ProfessorProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const generateMockProfessors = useCallback((): ProfessorProps => {
        return { ...FakeProfessor }
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<ProfessorProps>(
                `${ROUTES.PROFESSORS}`,
            )
            const payload = response.data || null

            if (process.env.NODE_ENV === 'development' && !payload) {
                setData(generateMockProfessors())
            } else {
                setData(payload)
            }
        } catch {
            if (process.env.NODE_ENV === 'development') {
                setData(generateMockProfessors())
                setError(null)
            } else {
                setData(null)
                setError(
                    'Não foi possível carregar as informações do professor.',
                )
            }
        } finally {
            setLoading(false)
        }
    }, [generateMockProfessors])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
