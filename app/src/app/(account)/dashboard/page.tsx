"use client";

import { toast } from "sonner";
import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { ButtonGrid } from "@/components/ButtonGrid";
import { UserInfoCard } from "@/components/UserInfoCard";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";
import { type DocumentRequest } from "@/types/documentRequest";
import { useStudent } from "@/hooks/useStudent";

// TODO adapt this page to handle it
// import { useProfessor } from "@/hooks/useProfessor";

const documentRequests: DocumentRequest[] = [
	{ title: "Boletim", type: "BULLETIN" },
	{ title: "Presenças", type: "PRESENCE" },
	{ title: "Declaração de Matrícula", type: "DECLARATION" },
	{ title: "Histórico Acadêmico", type: "HISTORY" },
];

export default function DashboardPage() {
	const { data: userInfo, loading, error, refetch } = useStudent();

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
				text={`Bem-vindo(a), ${userInfo.full_name}`}
				className="text-2xl font-semibold my-5"
			/>
			<div className="flex flex-col gap-3">
				<UserInfoCard data={userInfo} />
				<div className="flex flex-row gap-3">
					<ButtonGrid
						header="Requisitar Documentos"
						description="São as requisições que pode fazer à escola"
						data={documentRequests}
						handleClick={handleClick}
						className="w-1/2"
					/>
					{/* TODO: add new cards */}
				</div>
			</div>
		</div>
	);
}
