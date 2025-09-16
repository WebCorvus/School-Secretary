import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function UserPermissionsCard() {
	// TODO implement all get logic
	return (
		<Card className="w-1/2">
			<CardHeader>
				<CardTitle>Suas Permissões no Sistema</CardTitle>
				<CardDescription>
					Identificam as operações que tem permissão de realizar
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p></p>
			</CardContent>
		</Card>
	);
}
