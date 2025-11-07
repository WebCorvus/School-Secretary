import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import { FakeGroup, type GroupProps } from '@/types/group'

export function useGroups() {
    const [groups, setGroups] = useState<GroupProps[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generateMockGroups = useCallback((): GroupProps[] => {
        return Array.from({ length: 5 }, (_, i) => ({
            ...FakeGroup,
            id: i + 1,
            full_name: `Turma mock #${i + 1}`,
            short_name: `TM${i + 1}`,
        }))
    }, [])

    const fetchGroups = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<GroupProps[]>(`${ROUTES.GROUPS}`)
            let payload = response.data

            if (
                process.env.NODE_ENV === 'development' &&
                (!payload || payload.length === 0)
            ) {
                payload = generateMockGroups()
            }

            setGroups(payload)
        } catch {
            if (process.env.NODE_ENV === 'development') {
                setGroups(generateMockGroups())
            } else {
                setError('Não foi possível carregar as turmas.')
                setGroups([])
            }
        } finally {
            setLoading(false)
        }
    }, [generateMockGroups])

    useEffect(() => {
        fetchGroups()
    }, [fetchGroups])

    return { groups, loading, error, refetchGroups: fetchGroups }
}
