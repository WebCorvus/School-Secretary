"use client";

import Link from "next/link";
import { useState } from "react";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";
import SelectObject from "@/components/SelectObject";
import { useGroupLessons } from "@/hooks/useGroupLesson";
import { useGroups } from "@/hooks/useGroup";

export default function LessonsPage() {
	const [selectedGroup, setSelectedGroup] = useState<number>();
	const { groups, loading: loadingGroups, error: errorGroups } = useGroups();
	const {
		data: lessons,
		loading: loadingLessons,
		error: errorLessons,
		refetchLessons,
	} = useGroupLessons(selectedGroup);

	const handleSelectedGroup = (value?: number) => {
		setSelectedGroup(value);
		refetchLessons();
	};

	if (loadingGroups || loadingLessons) return <FullScreenLoading />;

	if (errorGroups) return <FullScreenError error={errorGroups} />;

	if (errorLessons) return <FullScreenError error={errorLessons} />;

	if (selectedGroup && (!lessons || lessons.length === 0))
		return <FullScreenError error="Nenhuma aula encontrada." />;

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Horários da Turma</h1>
				</div>
			</div>

			<div className="w-full flex justify-center items-center">
				<SelectObject options={groups} onSelect={handleSelectedGroup} />
			</div>

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
							{lessons.map(({ day, lessons }) => (
								<tr key={day}>
									<td>{day}</td>
									{lessons.map((lesson, idx) => (
										<td key={idx}>
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
	);
}
