import axios from 'axios'

export async function login(email: string, password: string): Promise<void> {
    try {
        await axios.post('/auth/login', { email, password })

        // Dispatch a custom event to notify the app about login
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('loginCompleted'))
        }
    } catch (_error) {
        throw new Error('Login falhou. Verifique email e senha.')
    }
}

export async function logout(): Promise<void> {
    try {
        await axios.post('/auth/logout')

        // Dispatch a custom event to notify the app about logout
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('logoutCompleted'))
        }
    } catch (error) {
        console.error('Falha no logout:', error)
    }
}
