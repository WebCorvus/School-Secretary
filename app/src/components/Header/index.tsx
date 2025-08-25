import Link from "next/link";

export default function Header() {
	return (
		<div className="flex flex-col w-48 bg-[var(--dark-gray)] border-r border-[var(--divide)] p-4">
			<ul className="flex flex-col space-y-2">
				<li>
					<Link
						href="/"
						className="block p-2 rounded hover:bg-[var(--button-hover)]"
					>
						Início
					</Link>
				</li>
				<li>
					<Link
						href="/students"
						className="block p-2 rounded hover:bg-[var(--button-hover)]"
					>
						Estudantes
					</Link>
				</li>
				<li>
					<Link
						href="/professors"
						className="block p-2 rounded hover:bg-[var(--button-hover)]"
					>
						Professores
					</Link>
				</li>
				<li>
					<Link
						href="/subjects"
						className="block p-2 rounded hover:bg-[var(--button-hover)]"
					>
						Matérias
					</Link>
				</li>
				<li>
					<Link
						href="/itineraries"
						className="block p-2 rounded hover:bg-[var(--button-hover)]"
					>
						Itinerários
					</Link>
				</li>
				<li>
					<Link
						href="/groups"
						className="block p-2 rounded hover:bg-[var(--button-hover)]"
					>
						Turmas
					</Link>
				</li>
				<li>
					<Link
						href="/lessons"
						className="block p-2 rounded hover:bg-[var(--button-hover)]"
					>
						Horários
					</Link>
				</li>
			</ul>
		</div>
	);
}
