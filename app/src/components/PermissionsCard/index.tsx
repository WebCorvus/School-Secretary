import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { PermissionProps } from "@/types/permission";

export function PermissionsCard({ data }: { data: PermissionProps[] }) {
	return (
		<Card className="w-1/2">
			<CardHeader>
				<CardTitle>Suas Permissões no Sistema</CardTitle>
				<CardDescription>
					Identificam as operações que tem permissão de realizar
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{data}</p>
			</CardContent>
		</Card>
	);
}
