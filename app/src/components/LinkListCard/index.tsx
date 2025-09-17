import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { LinkObjectProps } from "@/types/linkObject";

export function LinkListCard({
	header,
	description,
	data,
	className,
}: {
	header: string;
	description?: string;
	data: LinkObjectProps[];
	className?: string;
}) {
	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle>{header}</CardTitle>
				{description && (
					<CardDescription>{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent>
				<ul>
					{data.map((item, index) => (
						<li key={index}>
							<a
								href={item.url}
								className={`className="text-blue-500 hover:text-blue-700 hover:underline`}
							>
								{item.title}
							</a>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
