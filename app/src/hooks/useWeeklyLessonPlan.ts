import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import {
    FakeWeeklyLessonPlan,
    type WeeklyLessonPlanPostProps,
    type WeeklyLessonPlanProps,
} from '@/types/weeklyLessonPlan'

export function useWeeklyLessonPlans() {
    const [data, setData] = useState<WeeklyLessonPlanProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const generateMockWeeklyLessonPlans =
        useCallback((): WeeklyLessonPlanProps[] => {
            return Array.from({ length: 3 }, (_, idx) => ({
                ...FakeWeeklyLessonPlan,
                id: idx + 1,
            }))
        }, [])

    const fetchWeeklyLessonPlans = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<WeeklyLessonPlanProps[]>(
                `${ROUTES.WEEKLY_PLANS}`,
            )
            let payload = Array.isArray(response.data) ? response.data : []

            if (
                process.env.NODE_ENV === 'development' &&
                (!payload || payload.length === 0)
            ) {
                payload = generateMockWeeklyLessonPlans()
            }

            setData(payload)
        } catch {
            if (process.env.NODE_ENV === 'development') {
                setData(generateMockWeeklyLessonPlans())
                setError(null)
            } else {
                setData([])
                setError('Não foi possível carregar os planejamentos semanais.')
            }
        } finally {
            setLoading(false)
        }
    }, [generateMockWeeklyLessonPlans])

    const createWeeklyLessonPlan = useCallback(
        async (weeklyLessonPlan: WeeklyLessonPlanPostProps) => {
            try {
                const response = await api.post<WeeklyLessonPlanProps>(
                    `${ROUTES.WEEKLY_PLANS}`,
                    weeklyLessonPlan,
                )
                setData((prev) => [...prev, response.data])
                return response.data
            } catch (err) {
                setError('Não foi possível criar o planejamento semanal.')
                throw err
            }
        },
        [],
    )

    const updateWeeklyLessonPlan = useCallback(
        async (
            id: number,
            weeklyLessonPlan: Partial<WeeklyLessonPlanPostProps>,
        ) => {
            try {
                const response = await api.patch<WeeklyLessonPlanProps>(
                    `${ROUTES.WEEKLY_PLANS}${id}/`,
                    weeklyLessonPlan,
                )
                setData((prev) =>
                    prev.map((item) => (item.id === id ? response.data : item)),
                )
                return response.data
            } catch (err) {
                setError('Não foi possível atualizar o planejamento semanal.')
                throw err
            }
        },
        [],
    )

    const deleteWeeklyLessonPlan = useCallback(async (id: number) => {
        try {
            await api.delete(`${ROUTES.WEEKLY_PLANS}${id}/`)
            setData((prev) => prev.filter((item) => item.id !== id))
        } catch (err) {
            setError('Não foi possível excluir o planejamento semanal.')
            throw err
        }
    }, [])

    useEffect(() => {
        fetchWeeklyLessonPlans()
    }, [fetchWeeklyLessonPlans])

    return {
        data,
        loading,
        error,
        refetch: fetchWeeklyLessonPlans,
        createWeeklyLessonPlan,
        updateWeeklyLessonPlan,
        deleteWeeklyLessonPlan,
    }
}
