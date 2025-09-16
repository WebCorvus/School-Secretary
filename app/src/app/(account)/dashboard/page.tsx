import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Header1 } from "@/components/Header1";
import { Header2 } from "@/components/Header2";
import { Paragraph } from "@/components/Paragraph";

export default function Page() {
	// TODO request api to give required informations: role, permissions, auxiliary documents
	const userRole = "Desenvolvedor(a)";
	return (
		<div>
			<Header1 text="Dasboard" />
			<Paragraph
				text={`Bem vindo(a), você é: ${userRole}`}
				className={"text-2xl font-semibold my-5"}
			/>
			<Header2 text="Suas informações" />
			<div className="flex flex-row gap-3">
				<Card className="w-1/2">
					<CardHeader>
						<CardTitle>Suas Permissões no Sistema</CardTitle>
						<CardDescription>
							Identificam as operações que tem permissão de
							realizar
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p></p>
					</CardContent>
				</Card>
				<Card className="w-1/2">
					<CardHeader>
						<CardTitle>Documentos auxiliares</CardTitle>
						<CardDescription>
							Esses são alguns documentos utilizados, impressos,
							pela escola
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p></p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
