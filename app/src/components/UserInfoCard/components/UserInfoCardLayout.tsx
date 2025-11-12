import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserInfoCardLayoutProps {
    title: string
    children: ReactNode
    className?: string
}

export function UserInfoCardLayout({
    title,
    children,
    className = '',
}: UserInfoCardLayoutProps) {
    return (
        <Card className={`w-full ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
