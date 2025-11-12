import { useUser as useUserContext } from '@/contexts/UserContext'

/**
 * @deprecated Use `useUser` from '@/contexts/UserContext' directly instead.
 * This hook exists for backward compatibility but will be removed in future versions.
 */
export function useUser() {
    const context = useUserContext()

    // Maintain the same API as the original hook for backward compatibility
    return {
        data: context.user,
        loading: context.loading,
        error: context.error,
        refetch: context.refetch,
    }
}
