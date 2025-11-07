'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FullScreenErrorProps {
    error: string
    onRetry?: () => void
}

export function FullScreenError({ error, onRetry }: FullScreenErrorProps) {
    if (!error) return null

    return (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4 text-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-lg font-medium text-destructive">{error}</p>

                {onRetry && (
                    <Button variant="outline" onClick={onRetry}>
                        Tentar novamente
                    </Button>
                )}
            </div>
        </div>
    )
}
