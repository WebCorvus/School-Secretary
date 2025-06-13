"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ItineraryProps } from "@/types/itinerary";
import { GroupProps } from "@/types/group";
import { GROUP_BASE_URL, ITINERARY_BASE_URL } from "@/config";

type GroupPostProps = Omit<GroupProps, "id" | "created_at">;

export default function AddGroup() {
	const router = useRouter();
	const [itinerary, setItinerary] = useState<number>();
	const [itineraries, setItineraries] = useState<ItineraryProps[]>([]);
	const [year, setYear] = useState("");
	const [level, setLevel] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios.get(ITINERARY_BASE_URL).then((response) => {
			setItineraries(response.data);
		});
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!year || !level || !itinerary) {
			alert("Selecione o ano, o nível e o itinerário.");
			return;
		}
		setLoading(true);
		const group: GroupPostProps = {
			short_name: `${year}${level}-${
				itineraries.find((elm) => elm.id === itinerary)?.short_name ||
				"Não encontrado"
			}`,
			full_name: `${year}º Ano do Ensino ${
				level === "M" ? "Médio" : "Fundamental"
			}`,
			itinerary: itinerary,
		};
		try {
			await axios.post(GROUP_BASE_URL, group);
			alert("Turma cadastrada com sucesso!");
			router.push("/groups");
		} catch (error) {
			alert(`Erro ao cadastrar turma: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Turma</h1>
			<div className="form-container ">
				<form
					onSubmit={handleSubmit}
					className="form p-6 border border-[var(--divide)] rounded  w-full max-w-sm"
				>
					<div className="mb-4">
						<label htmlFor="year" className="block mb-2 font-bold">
							Ano
						</label>
						<select
							id="year"
							name="year"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione o ano</option>
							<option value="1">1º</option>
							<option value="2">2º</option>
							<option value="3">3º</option>
							<option value="4">4º</option>
							<option value="5">5º</option>
							<option value="6">6º</option>
							<option value="7">7º</option>
							<option value="8">8º</option>
							<option value="9">9º</option>
						</select>
					</div>
					<div className="mb-4">
						<label htmlFor="level" className="block mb-2 font-bold">
							Nível
						</label>
						<select
							id="level"
							name="level"
							value={level}
							onChange={(e) => setLevel(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione o nível</option>
							<option value="F">Fundamental</option>
							<option value="M">Médio</option>
						</select>
					</div>
					<div className="mb-4">
						<label
							htmlFor="itinerary"
							className="block mb-2 font-bold"
						>
							Itinerário
						</label>
						<select
							id="itinerary"
							name="itinerary"
							value={itinerary}
							onChange={(e) =>
								setItinerary(Number(e.target.value))
							}
							className="form select"
							required
						>
							<option value="">Selecione o itinerário</option>
							{itineraries.map((itinerary) => (
								<option key={itinerary.id} value={itinerary.id}>
									{itinerary.full_name}
								</option>
							))}
						</select>
					</div>
					<button
						type="submit"
						className="btn btn-common w-full"
						disabled={loading}
					>
						{loading ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
