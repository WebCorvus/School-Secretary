"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LinkObjectProps } from "@/types/linkObject";

interface LinkGridProps {
	header: string;
	description?: string;
	data: LinkObjectProps[];
	handleClick: (title: string, url: string) => void;
	className?: string;
}

export function LinkGrid({
	header,
	description,
	data,
	handleClick,
	className,
}: LinkGridProps) {
	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle>{header}</CardTitle>
				{description && (
					<CardDescription>{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent>
				<ul className="grid grid-cols-2 gap-3">
					{data.map((item, index) => (
						<li key={index}>
							<Button
								variant="outline"
								onClick={() =>
									handleClick(item.title, item.url)
								}
								className="w-full text-blue-500 hover:bg-blue-100"
							>
								{item.title}
							</Button>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
