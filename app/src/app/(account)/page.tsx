'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { login } from '@/services/auth'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string>('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const form = event.currentTarget
        const formData = new FormData(form)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            await login(email, password)
            router.push('/dashboard')
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
