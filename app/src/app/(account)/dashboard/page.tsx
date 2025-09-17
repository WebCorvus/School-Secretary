import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { LinkListCard } from "@/components/LinkListCard";
import { UserInfoCard } from "@/components/UserInfoCard";
import type { LinkObjectProps } from "@/types/linkObject";
import { FakeStudent, type StudentProps } from "@/types/student";

export default function Page() {
	// TODO get this informations from backend
	const userName: string = "Nome do Aluno";
	const userInfo: StudentProps = FakeStudent;

	const usefulLinks: LinkObjectProps[] = [
		{
			title: "Test Document",
			url: "https://testurl.com",
		},
	];
	return (
		<div>
			<Header1 text="Dasboard" />
			<Paragraph
				text={`Bem vindo(a), ${userName}`}
				className={"text-2xl font-semibold my-5"}
			/>
			<div className="flex flex-col gap-3">
				<UserInfoCard data={userInfo} />
				<div className="flex flex-row gap-3">
					<LinkListCard
						header="Requisitar Documentos"
						data={usefulLinks}
						className="w-1/2"
					/>
				</div>
			</div>
		</div>
	);
}
