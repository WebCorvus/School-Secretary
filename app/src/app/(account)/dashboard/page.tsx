import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { UserPermissionsCard } from "@/components/UserPermissionsCard";
import { UserDocumentsCard } from "@/components/UserDocumentsCard";

export default function Page() {
	const userRole = "Desenvolvedor(a)";
	return (
		<div>
			<Header1 text="Dasboard" />
			<Paragraph
				text={`Bem vindo(a), você é: ${userRole}`}
				className={"text-2xl font-semibold my-5"}
			/>
			<div className="flex flex-row gap-3">
				<UserPermissionsCard />
				<UserDocumentsCard />
			</div>
		</div>
	);
}
