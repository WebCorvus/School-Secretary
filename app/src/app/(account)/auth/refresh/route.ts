import axios from 'axios'
import { getCookie } from 'cookies-next'
import { type NextRequest, NextResponse } from 'next/server'
import { ROUTES_INTERNAL } from '@/config'

const DJANGO_REFRESH_URL = ROUTES_INTERNAL.REFRESH

export async function POST(req: NextRequest) {
    try {
        const refreshToken = getCookie('refresh', { req })

        if (!refreshToken) {
            return new NextResponse(
                JSON.stringify({ error: 'Refresh token not found.' }),
                { status: 401 },
            )
        }

        const response = await axios.post(DJANGO_REFRESH_URL, {
            refresh: refreshToken,
        })

        const { access } = response.data

        return new NextResponse(JSON.stringify({ access }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error: unknown) {
        console.error('Erro na rota /api/auth/refresh:', error)
        // Type guard to handle axios error properties
        const status =
            error &&
            typeof error === 'object' &&
            'response' in error &&
            error.response &&
            typeof error.response === 'object' &&
            'status' in error.response
                ? (error.response as { status?: number }).status || 500
                : 500
        const message =
            error &&
            typeof error === 'object' &&
            'response' in error &&
            error.response &&
            typeof error.response === 'object' &&
            'data' in error.response &&
            error.response.data &&
            typeof error.response.data === 'object' &&
            'detail' in error.response.data
                ? (error.response.data as { detail?: string }).detail ||
                  'Erro interno do servidor.'
                : 'Erro interno do servidor.'
        return new NextResponse(JSON.stringify({ error: message }), { status })
    }
}
