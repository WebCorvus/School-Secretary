"use client";

import { useEffect, useState } from "react";
import { Header1 } from "@/components/Header1";
import { Paragraph } from "@/components/Paragraph";
import { LinkGrid } from "@/components/LinkGrid";
import { UserInfoCard } from "@/components/UserInfoCard";
import { FakeLinkObject, type LinkObjectProps } from "@/types/linkObject";
import { FakeStudent, type StudentProps } from "@/types/student";
import { toast } from "sonner";
import api from "@/services/api";
import { EXTERNAL_API_HOST, USERS_INFO_ROUTE } from "@/config";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";

const handleClick = (title: string, url: string) => {
	toast.success(`Foi feita a requisição de: ${title}`);
};

export default function DashboardPage() {
	const [userInfo, setUserInfo] = useState<StudentProps | null>(null);
	const requisitionsUrl: LinkObjectProps[] = Array(10).fill(FakeLinkObject);
	const [loading, setLoading] = useState(true);

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
		return <FullScreenLoading loading={loading} />;
	}

	if (!userInfo) {
		return <FullScreenError error="Nenhuma informação encontrada." />;
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
					<LinkGrid
						header="Requisitar Documentos"
						description="São as requisições que pode fazer à escola"
						data={requisitionsUrl}
						handleClick={handleClick}
						className="w-1/2"
					/>
					{/* TODO: adicionar outros cards futuramente */}
				</div>
			</div>
		</div>
	);
}
