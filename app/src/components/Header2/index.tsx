export function Header2({
    text,
    className,
}: {
    text: string
    className?: string
}) {
    return (
        <h2
            className={`scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 ${className}`}
        >
            {text}
        </h2>
    )
}
