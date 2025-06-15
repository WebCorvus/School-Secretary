"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

import SearchField from "@/components/searchField";
import { LessonProps } from "@/types/lesson";
import { LESSON_BASE_URL } from "@/config";

export default function LessonsPage() {
	const [data, setData] = useState<LessonProps[]>([]);
	const [search, setSearch] = useState<string>("");
	useEffect(() => {
		axios
			.get<LessonProps[]>(LESSON_BASE_URL)
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				alert(`Erro ao carregar aulas: ${error}`);
			});
	}, [search]);

	const renderDay = (value: number) => {
		switch (value) {
			case 0:
				return "Domingo";
			case 1:
				return "Segunda-feira";
			case 2:
				return "Terça-feira";
			case 3:
				return "Quarta-feira";
			case 4:
				return "Quinta-feira";
			case 5:
				return "Sexta-feira";
			case 6:
				return "Sábado";
			default:
				return "Dia inválido";
		}
	};

	const renderTime = (value: number) => {
		return `${value}° Horário`;
	};

	const handleSearch = (value: string) => {
		setSearch(value);
	};

	const handleDelete = (value: number) => {
		axios.delete(`${LESSON_BASE_URL}${value}/`);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Itinerários</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar itinerário..."
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
									<th>Horário</th>
									<th>Matéria</th>
									<th>Professor</th>
									<th>Remover</th>
								</tr>
							</thead>
							<tbody>
								{data.map((lesson) => (
									<tr key={lesson.id}>
										<td>{renderDay(lesson.day)}</td>
										<td>{renderTime(lesson.time)}</td>
										<td>
											{lesson.subject_details.full_name}
										</td>
										<td>
											{lesson.professor_details.full_name}
										</td>
										<td>
											<button
												className="link link-blue"
												onClick={() =>
													handleDelete(lesson.id)
												}
											>
												Remover
											</button>
										</td>
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
