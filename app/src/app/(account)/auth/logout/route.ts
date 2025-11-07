import { deleteCookie } from 'cookies-next'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const res = new NextResponse(
        JSON.stringify({ message: 'Logout bem-sucedido' }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        },
    )

    deleteCookie('access', { req, res, path: '/' })
    deleteCookie('refresh', { req, res, path: '/' })

    return res
}
