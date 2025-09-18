"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { ButtonGrid } from "@/components/ButtonGrid";
import { UserInfoCard } from "@/components/UserInfoCard";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";
import { EXTERNAL_API_HOST, USERS_INFO_ROUTE } from "@/config";
import { type StudentProps } from "@/types/student";
import { DocumentRequest } from "@/types/documentRequest";
import api from "@/services/api";

const handleClick = (item: DocumentRequest) => {
	toast.success(`Foi feita a requisição de: ${item.title}`);
};

export default function DashboardPage() {
	const [userInfo, setUserInfo] = useState<StudentProps | null>(null);
	const [loading, setLoading] = useState(true);
	const documentRequests: DocumentRequest[] = [
		{ title: "Boletim", type: "BULLETIN" },
		{ title: "Presenças", type: "PRESENCE" },
		{ title: "Declaração de Matrícula", type: "DECLARATION" },
		{ title: "Histórico Acadêmico", type: "HISTORY" },
	];

	useEffect(() => {
		api.get<StudentProps>(`${EXTERNAL_API_HOST}${USERS_INFO_ROUTE}`)
			.then((response) => {
				setUserInfo(response.data);
			})
			.catch((error) => {
				console.error("Erro ao buscar informações:", error);
				toast.error("Não foi possível carregar suas informações.");
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return <FullScreenLoading />;
	}

	if (!userInfo) {
		return <FullScreenError error="Nenhuma informação econtrada." />;
	}

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
