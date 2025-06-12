"use client";

import React, { useState } from "react";
import axios from "axios";

const STUDENT_BASE_URL: string = "http://127.0.0.1:8000/students/data/";

interface StudentProps {
	id: number;
	full_name: string;
	registration_number: string;
	phone_number: string;
	email: string;
	cpf: string;
	birthday: string;
	address: string;
	group: string;
	itinerary: string;
	created_at: string;
}

// Tipo para o formulário, sem id e created_at
type StudentPostProps = Omit<StudentProps, "id" | "created_at">;

export default function Add() {
	const [student, setStudent] = useState<StudentPostProps>({
		full_name: "",
		email: "",
		registration_number: "",
		phone_number: "",
		cpf: "",
		birthday: "",
		address: "",
		group: "",
		itinerary: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setStudent((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		try {
			await axios.post(STUDENT_BASE_URL, student);
			alert("Aluno cadastrado com sucesso!");
			setStudent({
				full_name: "",
				registration_number: "",
				phone_number: "",
				email: "",
				cpf: "",
				birthday: "",
				address: "",
				group: "",
				itinerary: "",
			});
		} catch (error) {
			alert(`Erro ao Cadastrar: ${error}`);
		}
	};

	return (
		<div className=" justify-items-center">
			<div className="title-container">
				<h1 className="title">Adicionar Aluno</h1>
			</div>
			<div className="form-container">
				<form className="form" method="post" onSubmit={handleSubmit}>
					<input
						type="text"
						name="full_name"
						placeholder="Nome do aluno"
						value={student.full_name}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="registration_number"
						placeholder="Matrícula"
						value={student.registration_number}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="phone_number"
						placeholder="Telefone"
						value={student.phone_number}
						onChange={handleChange}
					/>
					<input
						type="email"
						name="email"
						placeholder="E-mail do aluno"
						value={student.email}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="cpf"
						placeholder="CPF"
						value={student.cpf}
						onChange={handleChange}
					/>
					<input
						type="date"
						name="birthday"
						placeholder="Data de nascimento"
						value={student.birthday}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="address"
						placeholder="Endereço"
						value={student.address}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="group"
						placeholder="Turma"
						value={student.group}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="itinerary"
						placeholder="Itinerário"
						value={student.itinerary}
						onChange={handleChange}
					/>
					<button type="submit" className="btn btn-gray w-full">
						Adicionar
					</button>
				</form>
			</div>
		</div>
	);
}
