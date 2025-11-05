export default function StudentDetailPage({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div className="space-y-6">
			<div className="title-container">
				<h1 className="title">Detalhes do Aluno</h1>
				<p className="text-muted-foreground">
					Informações detalhadas do aluno (ID: {params.id})
				</p>
			</div>
		</div>
	);
}
