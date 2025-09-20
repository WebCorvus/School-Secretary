"use client";

import { toast } from "sonner";
import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { ButtonGridCard } from "@/components/ButtonGridCard";
import { UserInfoCard } from "@/components/UserInfoCard";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";
import { type DocumentRequest } from "@/types/documentRequest";
import { useUser } from "@/hooks/useUser";
import { UserRole, UserProps } from "@/types/user";
import type { GradesByYear, StudentProps } from "@/types/student";
import { GradesTableCard } from "@/components/GradesTableCard";

const documentRequests: DocumentRequest[] = [
	{ title: "Boletim", type: "BULLETIN" },
	{ title: "Presenças", type: "PRESENCE" },
	{ title: "Declaração de Matrícula", type: "DECLARATION" },
	{ title: "Histórico Acadêmico", type: "HISTORY" },
];

export default function DashboardPage() {
	const { data: userInfo, loading, error } = useUser();

	const handleClick = (item: DocumentRequest) => {
		toast.success(`Foi feita a requisição de: ${item.title}`);
	};

	if (loading) return <FullScreenLoading />;
	if (error || !userInfo)
		return (
			<FullScreenError
				error={error || "Nenhuma informação encontrada."}
			/>
		);

	let grades: GradesByYear[] =
		userInfo.role === UserRole.STUDENT
			? (userInfo.profile_details as StudentProps)?.grades_details ?? []
			: [];

	return (
		<div className="space-y-6">
			<Header1 text="Dashboard" />
			<Paragraph
				text={`Bem-vindo(a), ${
					userInfo.profile_details?.full_name || userInfo.name
				}`}
				className="text-2xl font-semibold my-5"
			/>
			<div className="flex flex-col gap-3 ">
				<UserInfoCard data={userInfo} />
				<div className="grid grid-cols-2 gap-3">
					{userInfo.role === UserRole.STUDENT ? (
						<>
							<ButtonGridCard
								header="Requisitar Documentos"
								description="São as requisições que pode fazer à escola"
								data={documentRequests}
								handleClick={handleClick}
							/>
							<GradesTableCard
								grades={{
									"Matéria 1": [8.5, 7.2, 9.0, 6.8],
									"Matéria 2": [7.0, 6.5, 8.0, 7.2],
								}}
							/>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}
