import { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import { FakeNotification, type NotificationProps } from '@/types/notification'

export function useNotification() {
    const [data, setData] = useState<NotificationProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const generateMockNotifications = useCallback((): NotificationProps[] => {
        return Array.from({ length: 5 }, (_, i) => ({
            ...FakeNotification,
            id: i + 1,
            title: `Notificação #${i + 1}`,
            message: `Mensagem da notificação #${i + 1}`,
            notification_type: ['GRADE', 'ABSENCE', 'EVENT', 'GENERAL'][
                i % 4
            ] as 'GRADE' | 'ABSENCE' | 'EVENT' | 'GENERAL',
            read: i % 2 === 0,
        }))
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<NotificationProps[]>(
                `${ROUTES.NOTIFICATIONS}`,
            )
            let payload = Array.isArray(response.data) ? response.data : []

            if (
                process.env.NODE_ENV === 'development' &&
                payload.length === 0
            ) {
                payload = generateMockNotifications()
            }

            setData(payload)
        } catch {
            if (process.env.NODE_ENV === 'development') {
                setData(generateMockNotifications())
                setError(null)
            } else {
                setData([])
                setError('Não foi possível carregar as notificações.')
            }
        } finally {
            setLoading(false)
        }
    }, [generateMockNotifications])

    const markAsRead = useCallback(
        async (id: number) => {
            try {
                const url = ROUTES.NOTIFICATIONS_MARK_READ.replace(
                    '{id}',
                    id.toString(),
                )
                await api.post(url)
                await fetchData() // Refresh data
            } catch (err) {
                console.error('Error marking notification as read:', err)
            }
        },
        [fetchData],
    )

    const markAllAsRead = useCallback(async () => {
        try {
            await api.post(ROUTES.NOTIFICATIONS_MARK_ALL_READ)
            await fetchData() // Refresh data
        } catch (err) {
            console.error('Error marking all notifications as read:', err)
        }
    }, [fetchData])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        markAsRead,
        markAllAsRead,
    }
}
