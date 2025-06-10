import axios from "axios";

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

export async function getData(url: string) {
	const response = await axios.get<StudentProps[]>(url);
	return response.data;
}

export default async function Home() {
	const data = await getData("http://localhost:8000/students/data/");
	return (
		<div>
			<div className="justify-items-center">
				<h1 className="m-5 text-3xl">Dados dos Alunos Cadastrados</h1>
				<ul>
					{data.map((register) => (
						<li key={register.id}>
							<ul>
								<li className="text-2xl">
									<b>{register.full_name}</b>
								</li>
								<li>
									Matrícula: {register.registration_number}
								</li>
								<li>Telefone: {register.phone_number}</li>
								<li>Email: {register.email}</li>
								<li>CPF: {register.cpf}</li>
								<li>Data de Narcimento: {register.birthday}</li>
							</ul>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
