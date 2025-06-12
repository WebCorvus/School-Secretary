import React, { useState } from "react";

interface SearchFieldProps {
	placeholder?: string;
	onSearch: (value: string) => void;
}

export default function SearchField({
	placeholder = "Procurar...",
	onSearch,
}: SearchFieldProps) {
	const [value, setValue] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSearch(value);
	};

	return (
		<div className="search-form-container">
			<form className="search-form" onSubmit={handleSubmit}>
				<input
					type="text"
					name="search"
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					aria-label="Campo de busca"
					className="max-w-[400px] min-w-[200px] w-full"
				/>
				<button type="submit">Buscar</button>
			</form>
		</div>
	);
}
