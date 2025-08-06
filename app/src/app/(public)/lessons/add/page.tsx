"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
	LESSON_BASE_URL,
	GROUP_BASE_URL,
	SUBJECT_BASE_URL,
	PROFESSOR_BASE_URL,
} from "@/config";
import { GroupProps } from "@/types/group";
import { SubjectProps } from "@/types/subject";
import { ProfessorProps } from "@/types/professor";

export default function AddLesson() {
	const router = useRouter();
	const [groups, setGroups] = useState<GroupProps[]>([]);
	const [subjects, setSubjects] = useState<SubjectProps[]>([]);
	const [professors, setProfessors] = useState<ProfessorProps[]>([]);
	const [group, setGroup] = useState("");
	const [subject, setSubject] = useState("");
	const [professor, setProfessor] = useState("");
	const [day, setDay] = useState("");
	const [time, setTime] = useState("");
	const [posting, setPosting] = useState(false);

	useEffect(() => {
		axios.get(GROUP_BASE_URL).then((res) => setGroups(res.data));
		axios.get(SUBJECT_BASE_URL).then((res) => setSubjects(res.data));
		axios.get(PROFESSOR_BASE_URL).then((res) => setProfessors(res.data));
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPosting(true);
		try {
			await axios.post(LESSON_BASE_URL, {
				group: Number(group),
				subject: Number(subject),
				professor: Number(professor),
				day: Number(day),
				time: Number(time),
			});
			alert("Aula cadastrada com sucesso!");
			router.push("/lessons");
		} catch (error: any) {
			alert(`Erro ao cadastrar aula: ${error.message}`);
		} finally {
			setPosting(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Aula</h1>
			<div className="form-container">
				<form
					onSubmit={handleSubmit}
					className="form flex-col p-6 border border-[var(--divide)] rounded max-w-sm"
				>
					<div className="mb-4">
						<label htmlFor="group" className="block mb-2 font-bold">
							Turma
						</label>
						<select
							id="group"
							name="group"
							value={group}
							onChange={(e) => setGroup(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione a turma</option>
							{groups.map((group) => (
								<option key={group.id} value={group.id}>
									{group.full_name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4">
						<label
							htmlFor="subject"
							className="block mb-2 font-bold"
						>
							Matéria
						</label>
						<select
							id="subject"
							name="subject"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione a matéria</option>
							{subjects.map((subject) => (
								<option key={subject.id} value={subject.id}>
									{subject.full_name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4">
						<label
							htmlFor="professor"
							className="block mb-2 font-bold"
						>
							Professor
						</label>
						<select
							id="professor"
							name="professor"
							value={professor}
							onChange={(e) => setProfessor(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione o professor</option>
							{professors.map((professor) => (
								<option key={professor.id} value={professor.id}>
									{professor.full_name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4">
						<label htmlFor="day" className="block mb-2 font-bold">
							Dia da Semana
						</label>
						<select
							id="day"
							name="day"
							value={day}
							onChange={(e) => setDay(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione o dia</option>
							<option value="0">Domingo</option>
							<option value="1">Segunda-feira</option>
							<option value="2">Terça-feira</option>
							<option value="3">Quarta-feira</option>
							<option value="4">Quinta-feira</option>
							<option value="5">Sexta-feira</option>
							<option value="6">Sábado</option>
						</select>
					</div>
					<div className="mb-4">
						<label htmlFor="time" className="block mb-2 font-bold">
							Horário
						</label>
						<select
							id="time"
							name="time"
							value={time}
							onChange={(e) => setTime(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione o horário</option>
							<option value="0">1º Horário</option>
							<option value="1">2º Horário</option>
							<option value="2">3º Horário</option>
							<option value="3">4º Horário</option>
							<option value="4">5º Horário</option>
							<option value="5">6º Horário</option>
						</select>
					</div>
					<button
						type="submit"
						className="btn btn-common w-full"
						disabled={posting}
					>
						{posting ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
