export function Header3({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<h3
			className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
		>
			{text}
		</h3>
	);
}
