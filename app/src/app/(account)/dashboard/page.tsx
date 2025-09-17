"use client";

import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { LinkListCard } from "@/components/LinkListCard";
import { UserInfoCard } from "@/components/UserInfoCard";
import { FakeLinkObject, type LinkObjectProps } from "@/types/linkObject";
import { FakeStudent, type StudentProps } from "@/types/student";
import { toast } from "sonner";

const handleClick = (title: string) => {
	toast.success(`Foi feita a requisição de: ${title}`);
};

export default function DashboardPage() {
	const userInfo: StudentProps = FakeStudent;
	const usefulLinks: LinkObjectProps[] = [FakeLinkObject];

	return (
		<div className="space-y-6">
			<Header1 text="Dashboard" />
			<Paragraph
				text={`Bem-vindo(a), ${userInfo.full_name}`}
				className="text-2xl font-semibold my-5"
			/>
			<div className="flex flex-col gap-3">
				<UserInfoCard data={userInfo} />
				<LinkListCard
					header="Requisitar Documentos"
					description="São as requisições que pode fazer à escola"
					data={usefulLinks}
					handleClick={handleClick}
				/>
			</div>
		</div>
	);
}
