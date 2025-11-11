'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { DashboardLink } from '@/types/dashboardLink'

interface ButtonGridCardProps {
    header: string
    description?: string
    data: DashboardLink[]
    handleClick: (item: DashboardLink) => void
    className?: string
}

export function ButtonGridCard({
    header,
    description,
    data,
    handleClick,
    className,
}: ButtonGridCardProps) {
    return (
        <Card className={`w-full ${className}`}>
            <CardHeader>
                <CardTitle>{header}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <ul className="grid grid-cols-2 gap-2">
                    {data.map((item) => (
                        <li key={item.url}>
                            <Button
                                variant="outline"
                                className="w-full text-blue-500 hover:bg-blue-100"
                                onClick={() => handleClick(item)}
                            >
                                {item.title}
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
