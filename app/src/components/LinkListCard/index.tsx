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

interface LinkListCardProps {
	header: string;
	description?: string;
	data: LinkObjectProps[];
	handleClick: (title: string) => void;
}

export function LinkListCard({
	header,
	description,
	data,
	handleClick,
}: LinkListCardProps) {
	return (
		<Card className="w-full">
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
							<Button
								variant={"outline"}
								onClick={() => handleClick(item.title)}
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
