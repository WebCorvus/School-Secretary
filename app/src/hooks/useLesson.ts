import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import {
    FakeLesson,
    type LessonPostProps,
    type LessonProps,
} from '@/types/lesson'

export function useLessons() {
    const [data, setData] = useState<LessonProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const generateMockLessons = useCallback((): LessonProps[] => {
        return Array.from({ length: 5 }, (_, idx) => ({
            ...FakeLesson,
            id: idx + 1,
        }))
    }, [])

    const fetchLessons = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<LessonProps[]>(`${ROUTES.LESSONS}`)
            let payload = Array.isArray(response.data) ? response.data : []

            if (
                process.env.NODE_ENV === 'development' &&
                (!payload || payload.length === 0)
            ) {
                payload = generateMockLessons()
            }

            setData(payload)
        } catch {
            if (process.env.NODE_ENV === 'development') {
                setData(generateMockLessons())
                setError(null)
            } else {
                setData([])
                setError('Não foi possível carregar as aulas.')
            }
        } finally {
            setLoading(false)
        }
    }, [generateMockLessons])

    const createLesson = useCallback(async (lesson: LessonPostProps) => {
        try {
            const response = await api.post<LessonProps>(
                `${ROUTES.LESSONS}`,
                lesson,
            )
            setData((prev) => [...prev, response.data])
            return response.data
        } catch (err) {
            setError('Não foi possível criar a aula.')
            throw err
        }
    }, [])

    const updateLesson = useCallback(
        async (id: number, lesson: Partial<LessonPostProps>) => {
            try {
                const response = await api.patch<LessonProps>(
                    `${ROUTES.LESSONS}${id}/`,
                    lesson,
                )
                setData((prev) =>
                    prev.map((item) => (item.id === id ? response.data : item)),
                )
                return response.data
            } catch (err) {
                setError('Não foi possível atualizar a aula.')
                throw err
            }
        },
        [],
    )

    const deleteLesson = useCallback(async (id: number) => {
        try {
            await api.delete(`${ROUTES.LESSONS}${id}/`)
            setData((prev) => prev.filter((item) => item.id !== id))
        } catch (err) {
            setError('Não foi possível excluir a aula.')
            throw err
        }
    }, [])

    useEffect(() => {
        fetchLessons()
    }, [fetchLessons])

    return {
        data,
        loading,
        error,
        refetch: fetchLessons,
        createLesson,
        updateLesson,
        deleteLesson,
    }
}
