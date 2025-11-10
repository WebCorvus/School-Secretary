'use client'

import type React from 'react'
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { ROUTES } from '@/config'
import api from '@/services/api'
import { FakeUser, type UserProps } from '@/types/user'

interface UserContextType {
    user: UserProps | null
    loading: boolean
    error: string | null
    setUser: (user: UserProps | null) => void
    getUser: (forceRefetch?: boolean) => Promise<UserProps | null>
    refetch: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProps | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const getUser = useCallback(
        async (forceRefetch: boolean = false): Promise<UserProps | null> => {
            if (user && !forceRefetch) {
                // If user data already exists and we're not forcing a refetch, return it without making a new request
                return user
            }

            try {
                setLoading(true)
                setError(null)

                const response = await api.get<UserProps>(`${ROUTES.USER_INFO}`)
                const payload = response.data || null

                if (process.env.NODE_ENV === 'development' && !payload) {
                    // In development, use the exported FakeUser for consistency
                    setUser(FakeUser)
                    return FakeUser
                } else {
                    setUser(payload)
                    return payload
                }
            } catch (err) {
                console.error('Error fetching user data:', err)
                if (process.env.NODE_ENV === 'development') {
                    // In development, use the exported FakeUser for consistency
                    setUser(FakeUser)
                    setError(null)
                    return FakeUser
                } else {
                    setUser(null)
                    setError(
                        'Não foi possível carregar as informações do usuário.',
                    )
                    return null
                }
            } finally {
                setLoading(false)
            }
        },
        [user],
    )

    const refetch = useCallback(() => {
        setUser(null)
        void getUser(true) // force refetch
    }, [getUser])

    // Initialize user data on mount
    useEffect(() => {
        void getUser(false)
    }, [getUser])

    const value = {
        user,
        loading,
        error,
        setUser,
        getUser,
        refetch,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
