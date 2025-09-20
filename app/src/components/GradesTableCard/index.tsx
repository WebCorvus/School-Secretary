"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface GradesTableCardProps {
	grades: Record<string, number[]>;
}

export function GradesTableCard({ grades }: GradesTableCardProps) {
	const bimesters = ["1º Bim", "2º Bim", "3º Bim", "4º Bim"];

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Boletim Escolar</CardTitle>
				<CardDescription>
					Notas por matéria e média anual
				</CardDescription>
			</CardHeader>
			<CardContent className="overflow-x-auto">
				<Table className="min-w-full">
					<TableHeader>
						<TableRow>
							<TableHead>Matéria</TableHead>
							{bimesters.map((bim) => (
								<TableHead key={bim}>{bim}</TableHead>
							))}
							<TableHead>Média</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(grades).map(([subject, notes]) => {
							const average =
								notes.reduce((acc, n) => acc + n, 0) /
								(notes.length || 1);
							return (
								<TableRow key={subject}>
									<TableCell>{subject}</TableCell>
									{notes.map((note, idx) => (
										<TableCell key={idx}>
											{note.toFixed(1)}
										</TableCell>
									))}
									<TableCell>{average.toFixed(1)}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
