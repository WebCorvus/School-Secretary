import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { LinkObjectProps } from "@/types/linkObject";

export function LinkListCard({ data }: { data: LinkObjectProps[] }) {
	return (
		<Card className="w-1/2">
			<CardHeader>
				<CardTitle>Suas Permissões no Sistema</CardTitle>
				<CardDescription>
					Identificam as operações que tem permissão de realizar
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul>
					{data.map((item, index) => (
						// TODO add stilization
						<li key={index}>
							<a href={item.url}>{item.title}</a>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
