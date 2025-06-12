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
					<Link href="/professor">Professores</Link>
				</li>
				<li>
					<Link href="/schedule">Horários</Link>
				</li>
				<li>
					<Link href="/subject">Disciplinas</Link>
				</li>
				<li>
					<Link href="/itinerary">Itinerários</Link>
				</li>
				<li>
					<Link href="/group">Turmas</Link>
				</li>
				<li>
					<Link href="/book">Livros</Link>
				</li>
			</ul>
		</div>
	);
}
