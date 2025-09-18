"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ButtonGridProps {
	header: string;
	description?: string;
	data: any[];
	handleClick: (item: any) => void;
	className?: string;
}

export function LinkGrid({
	header,
	description,
	data,
	handleClick,
	className,
}: ButtonGridProps) {
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
								onClick={() => handleClick(item)}
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
