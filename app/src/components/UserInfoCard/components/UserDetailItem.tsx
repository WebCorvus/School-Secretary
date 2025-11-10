interface UserDetailItemProps {
    label: string
    value?: string | number | null
    className?: string
}

export function UserDetailItem({
    label,
    value,
    className = '',
}: UserDetailItemProps) {
    return (
        <li className={className}>
            <strong>{label}:</strong> {value || 'Não informado'}
        </li>
    )
}
