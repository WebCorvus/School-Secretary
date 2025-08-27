"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ItineraryPostProps } from "@/types/itinerary";
import { ITINERARY_BASE_URL } from "@/config";

export default function AddItinerary() {
	const router = useRouter();
	const [itinerary, setItinerary] = useState<ItineraryPostProps>({
		short_name: "",
		full_name: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setItinerary((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			await axios.post(ITINERARY_BASE_URL, itinerary);
			alert("Itinerário cadastrado com sucesso!");
			router.push("/itineraries");
		} catch (error: any) {
			alert(`Erro ao cadastrar itinerário: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Itinerário</h1>
			<div className="form-container ">
				<form
					onSubmit={handleSubmit}
					className="form flex-col p-6 border border-[var(--divide)] rounded-md w-full max-w-sm"
				>
					<input
						type="text"
						name="short_name"
						placeholder="Abreviação..."
						value={itinerary.short_name}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="full_name"
						placeholder="Nome completo..."
						value={itinerary.full_name}
						onChange={handleChange}
					/>
					<button
						type="submit"
						className="btn w-full"
						disabled={loading}
					>
						{loading ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
