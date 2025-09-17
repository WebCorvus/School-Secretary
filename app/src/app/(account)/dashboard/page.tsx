import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { LinkListCard } from "@/components/LinkListCard";
import { UserInfoCard } from "@/components/UserInfoCard";
import { FakeLinkObject, type LinkObjectProps } from "@/types/linkObject";
import { FakeStudent, type StudentProps } from "@/types/student";

export default function Page() {
	// TODO get this information from backend
	const userInfo: StudentProps = FakeStudent;

	const usefulLinks: LinkObjectProps[] = [FakeLinkObject];
	return (
		<div>
			<Header1 text="Dasboard" />
			<Paragraph
				text={`Bem vindo(a), ${userInfo.full_name}`}
				className={"text-2xl font-semibold my-5"}
			/>
			<div className="flex flex-col gap-3">
				<UserInfoCard data={userInfo} />
				<div className="flex flex-row gap-3">
					<LinkListCard
						header="Requisitar Documentos"
						description="São as requisições que pode fazer á escola"
						data={usefulLinks}
						className="w-1/2"
					/>
				</div>
			</div>
		</div>
	);
}
