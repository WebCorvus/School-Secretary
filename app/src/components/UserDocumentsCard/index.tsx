import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function UserDocumentsCard() {
	// TODO implement all get logic
	return (
		<Card className="w-1/2">
			<CardHeader>
				<CardTitle>Documentos auxiliares</CardTitle>
				<CardDescription>
					Esses são alguns documentos utilizados, impressos, pela
					escola
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p></p>
			</CardContent>
		</Card>
	);
}
