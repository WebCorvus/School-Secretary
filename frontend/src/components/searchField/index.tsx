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
		<div className="justify-items-center">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="search"
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
				/>
				<button type="submit" className="btn btn-gray">
					Buscar
				</button>
			</form>
		</div>
	);
}
