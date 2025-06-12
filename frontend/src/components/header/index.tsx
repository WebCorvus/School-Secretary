import Link from "next/link";

export default function Header() {
	return (
		<div>
			<ul className="p-1.5">
				<li>
					<Link className="btn btn-normal" href="/">
						Início
					</Link>

					<Link className="btn btn-normal" href="/students">
						Estudantes
					</Link>

					<Link className="btn btn-normal" href="/professor">
						Professores
					</Link>
					<Link className="btn btn-normal" href="/subject">
						Disciplinas
					</Link>
					<Link className="btn btn-normal" href="/itinerary">
						Itinerários
					</Link>
					<Link className="btn btn-normal" href="/group">
						Turmas
					</Link>
					<Link className="btn btn-normal" href="/schoolrecord">
						Boletins
					</Link>
					<Link className="btn btn-normal" href="/book">
						Livros
					</Link>
					<Link className="btn btn-normal" href="/schedule">
						Horários
					</Link>
				</li>
			</ul>
		</div>
	);
}
