"use client";

import { toast } from "sonner";
import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { ButtonGrid } from "@/components/ButtonGrid";
import { UserInfoCard } from "@/components/UserInfoCard";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";
import { type DocumentRequest } from "@/types/documentRequest";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/user";
import { GradesChart } from "@/components/GradesChart";

const documentRequests: DocumentRequest[] = [
	{ title: "Boletim", type: "BULLETIN" },
	{ title: "Presenças", type: "PRESENCE" },
	{ title: "Declaração de Matrícula", type: "DECLARATION" },
	{ title: "Histórico Acadêmico", type: "HISTORY" },
];

export default function DashboardPage() {
	const { data: userInfo, loading, error, refetch } = useUser();

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

	return (
		<div className="space-y-6">
			<Header1 text="Dashboard" />
			<Paragraph
				text={`Bem-vindo(a), ${
					"profile" in userInfo && userInfo.profile
						? userInfo.profile.full_name
						: userInfo.name
				}`}
				className="text-2xl font-semibold my-5"
			/>
			<div className="flex flex-col gap-3">
				<UserInfoCard data={userInfo} />
				<div className="grid grid-cols-2 gap-3">
					{userInfo.role === UserRole.STUDENT ||
					userInfo.role === UserRole.GUARDIAN ? (
						<ButtonGrid
							header="Requisitar Documentos"
							description="São as requisições que pode fazer à escola"
							data={documentRequests}
							handleClick={handleClick}
						/>
					) : // Você pode adicionar mais cards específicos

					null}
					<GradesChart />
				</div>
			</div>
		</div>
	);
}
