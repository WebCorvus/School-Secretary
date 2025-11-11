import axios from 'axios'
import { NAVIGATION } from '@/config'

export async function login(email: string, password: string): Promise<void> {
    try {
        await axios.post(NAVIGATION.AUTH_LOGIN, { email, password })

        // Dispatch a custom event to notify the app about login
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('loginCompleted'))
        }
        
        // Reload the page to ensure a fresh state after login
        // The middleware will handle redirecting to the appropriate page based on 'from' parameter
        if (typeof window !== 'undefined') {
            window.location.reload()
        }
    } catch (_error) {
        throw new Error('Login falhou. Verifique email e senha.')
    }
}

export async function logout(): Promise<void> {
    try {
        await axios.post(NAVIGATION.AUTH_LOGOUT)

        // Dispatch a custom event to notify the app about logout
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('logoutCompleted'))
        }
    } catch (error) {
        console.error('Falha no logout:', error)
    }
}
