"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

import SearchField from "@/components/searchField";
import { GROUP_BASE_URL } from "@/config";
import { DailyLessonsView } from "@/types/group";

export default function LessonsPage() {
	const [data, setData] = useState<DailyLessonsView[]>([]);
	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		axios
			.get<DailyLessonsView[]>(`${GROUP_BASE_URL}14/get-lessons/`)
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				alert(`Erro ao carregar aulas: ${error}`);
			});
	}, [search]);

	const handleSearch = (value: string) => {
		setSearch(value);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Horários da Turma</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar turma..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link
					className="link link-common w-50 text-center"
					href="/lessons/add"
				>
					Adicionar
				</Link>
			</div>
			<div>
				<div className="flex justify-center items-center">
					<div className="table-container">
						<table className="m-3 table table-border">
							<thead>
								<tr>
									<th>Dia</th>
									<th>1° Horário</th>
									<th>2° Horário</th>
									<th>3° Horário</th>
									<th>4° Horário</th>
									<th>5° Horário</th>
									<th>6° Horário</th>
								</tr>
							</thead>
							<tbody>
								{data.map(({ day, lessons }) => (
									<tr key={day}>
										<td>{day}</td>
										{lessons.map((lesson) => (
											<td>
												{lesson?.subject_details
													?.short_name || "-"}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
