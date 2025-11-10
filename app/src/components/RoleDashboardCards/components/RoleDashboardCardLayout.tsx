import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RoleDashboardCardLayoutProps {
    title: string
    children: ReactNode
    className?: string
}

export function RoleDashboardCardLayout({
    title,
    children,
    className = '',
}: RoleDashboardCardLayoutProps) {
    return (
        <Card className={`w-full ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
