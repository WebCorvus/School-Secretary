export function Paragraph({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
			{text}
		</p>
	);
}
