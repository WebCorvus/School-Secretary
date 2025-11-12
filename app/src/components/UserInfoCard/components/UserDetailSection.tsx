import type { ReactNode } from 'react'

interface UserDetailSectionProps {
    title: string
    children: ReactNode
    className?: string
}

export function UserDetailSection({
    title,
    children,
    className = '',
}: UserDetailSectionProps) {
    return (
        <div className={`mt-4 pt-4 border-t ${className}`}>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {children}
        </div>
    )
}
