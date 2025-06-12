import Link from "next/link";

export default function Header() {
	return (
		<div className="header-container">
			<ul className="header">
				<li>
					<Link href="/">Início</Link>
				</li>
				<li>
					<Link href="/students">Estudantes</Link>
				</li>
				<li>
					<Link href="/professors">Professores</Link>
				</li>
				<li>
					<Link href="/schedule">Horários</Link>
				</li>
				<li>
					<Link href="/subjects">Disciplinas</Link>
				</li>
				<li>
					<Link href="/itineraries">Itinerários</Link>
				</li>
				<li>
					<Link href="/groups">Turmas</Link>
				</li>
				<li>
					<Link href="/books">Livros</Link>
				</li>
			</ul>
		</div>
	);
}
