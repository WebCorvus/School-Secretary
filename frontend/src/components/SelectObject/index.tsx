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
		<div className="form-container w-full flex justify-center">
			<form className="form w-full flex justify-center">
				<select
					className="max-w-56"
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
			</form>
		</div>
	);
}
