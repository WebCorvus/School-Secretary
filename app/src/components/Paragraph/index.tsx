export function Paragraph({ text }: { text: string }) {
	return <p className="leading-7 [&:not(:first-child)]:mt-6">{text}</p>;
}
