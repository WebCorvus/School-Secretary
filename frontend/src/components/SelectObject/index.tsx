import React from "react";
import { useState } from "react";

export default function SelectObject({
	options,
	onSelect,
}: {
	options:
		| { id: number; short_name?: string; full_name?: string }[]
		| undefined;
	onSelect: (value: number | undefined) => void;
}) {
	const [selected, setSelected] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelected(e.target.value);
		onSelect(Number(e.target.value));
	};
	return (
		<div className="form-container ">
			<form className="form flex-row">
				<select
					className="max-w-96"
					value={selected}
					onChange={handleChange}
					required
				>
					<option value="" disabled>
						Selecione uma opção
					</option>
					{(options ?? []).map((elm) => (
						<option key={elm.id} value={elm.id}>
							{elm.short_name}
						</option>
					))}
				</select>
				<button type="submit">Enviar</button>
			</form>
		</div>
	);
}
