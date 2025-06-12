"use client";

import React, { useState } from "react";
import axios from "axios";
import { ProfessorProps } from "@/types/professor";
import { GROUP_BASE_URL, SUBJECT_BASE_URL, PROFESSOR_BASE_URL } from "@/config";
import { GroupProps } from "@/types/group";
import { SubjectProps } from "@/types/subject";

type ProfessorPostProps = Omit<ProfessorProps, "id" | "created_at">;

export default function AddProfessor() {
	const [groups, setGroups] = useState<GroupProps[]>([]);
	const [subjects, setSubjects] = useState<SubjectProps[]>([]);
	const [professor, setProfessor] = useState<ProfessorPostProps>({
		full_name: "",
		phone_number: "",
		email: "",
		cpf: "",
		birthday: "",
		address: "",
		subject: 0,
		group: 0,
	});

	React.useEffect(() => {
		axios.get(GROUP_BASE_URL).then((response) => setGroups(response.data));
		axios
			.get(SUBJECT_BASE_URL)
			.then((response) => setSubjects(response.data));
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setProfessor((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axios.post(PROFESSOR_BASE_URL, professor);
			alert("Professor cadastrado com sucesso!");
			setProfessor({
				full_name: "",
				phone_number: "",
				email: "",
				cpf: "",
				birthday: "",
				address: "",
				subject: 0,
				group: 0,
			});
		} catch (error) {
			alert(`Erro ao cadastrar: ${error}`);
		}
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Adicionar Professor</h1>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="form-container">
					<form
						className="form"
						method="post"
						onSubmit={handleSubmit}
					>
						<input
							type="text"
							name="full_name"
							placeholder="Nome do professor"
							value={professor.full_name}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="phone_number"
							placeholder="Telefone"
							value={professor.phone_number}
							onChange={handleChange}
						/>
						<input
							type="email"
							name="email"
							placeholder="E-mail do professor"
							value={professor.email}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="cpf"
							placeholder="CPF"
							value={professor.cpf}
							onChange={handleChange}
						/>
						<input
							type="date"
							name="birthday"
							placeholder="Data de nascimento"
							value={professor.birthday}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="address"
							placeholder="Endereço"
							value={professor.address}
							onChange={handleChange}
						/>
						<select
							name="group"
							value={professor.group}
							onChange={handleChange}
						>
							<option value="">Selecione a turma</option>
							{groups.map((group) => (
								<option key={group.id} value={group.id}>
									{group.name}
								</option>
							))}
						</select>
						<select
							name="subject"
							value={professor.subject}
							onChange={handleChange}
						>
							<option value="">Selecione a matéria</option>
							{subjects.map((subject) => (
								<option key={subject.id} value={subject.id}>
									{subject.name}
								</option>
							))}
						</select>
						<button
							type="submit"
							className="btn btn-gray w-full py-1"
						>
							Concluir
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
