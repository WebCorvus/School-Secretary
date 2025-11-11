'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { useUser } from '@/contexts/UserContext'
import { login } from '@/services/auth'
import { NAVIGATION } from '@/config'

export default function LoginPage() {
    const router = useRouter()
    const { user, loading } = useUser() // Get user data and loading state
    const [error, setError] = useState<string>('')

    // Redirect to dashboard if user is already authenticated
    useEffect(() => {
        if (!loading && user) {
            router.push(NAVIGATION.DASHBOARD)
        }
    }, [user, loading, router])

    // If still loading user data, show a loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
                <div className="text-center">
                    <p>Carregando...</p>
                </div>
            </div>
        )
    }

    // If user is already logged in, don't show the login form
    if (user) {
        return null // The redirect will happen via useEffect
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const form = event.currentTarget
        const formData = new FormData(form)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            await login(email, password)
            // The login function handles the redirect to the appropriate page
        } catch (err) {
            setError((err as Error).message || 'Erro ao realizar login')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
            <LoginForm
                className="w-full max-w-md"
                onSubmit={handleSubmit}
                error={error}
            />
        </div>
    )
}
