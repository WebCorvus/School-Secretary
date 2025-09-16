import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { PermissionsCard } from "@/components/PermissionsCard";
import { LinkListCard } from "@/components/LinkListCard";
import type { UserRoleProps } from "@/types/userRole";
import type { PermissionProps } from "@/types/permission";
import type { LinkObjectProps } from "@/types/linkObject";

export default function Page() {
	// TODO get all this informations from backend
	const userRole: UserRoleProps = "Desenvolvedor(a)";
	const permissions: PermissionProps[] = [];
	const documents: LinkObjectProps[] = [
		{
			title: "Test Document",
			url: "https://testurl.com",
		},
	];
	return (
		<div>
			<Header1 text="Dasboard" />
			<Paragraph
				text={`Bem vindo(a), você é: ${userRole}`}
				className={"text-2xl font-semibold my-5"}
			/>
			<div className="flex flex-row gap-3">
				<PermissionsCard data={permissions} />
				<LinkListCard data={documents} />
			</div>
		</div>
	);
}
