import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col flex-grow text-[var(--foreground)] p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-[var(--foreground)]">
					Bem-vindo ao School Secretary
				</h1>
				<p className="text-[var(--light-gray)]">
					Sua plataforma completa para gestão escolar.
				</p>
			</div>

			<div className="grid grid-cols-1 mb-8 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Link
					href="/dashboard"
					className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-color)] font-bold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center text-xl transition-colors duration-200"
				>
					Dashboard
				</Link>
				<Link
					href="/documents"
					className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-color)] font-bold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center text-xl transition-colors duration-200"
				>
					Documentos
				</Link>
				<Link
					href="/messages"
					className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-color)] font-bold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center text-xl transition-colors duration-200"
				>
					Mensagens
				</Link>
				<Link
					href="/professors"
					className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-color)] font-bold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center text-xl transition-colors duration-200"
				>
					Professores
				</Link>
				<Link
					href="/students"
					className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-color)] font-bold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center text-xl transition-colors duration-200"
				>
					Alunos
				</Link>
				<Link
					href="/groups"
					className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-color)] font-bold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center text-xl transition-colors duration-200"
				>
					Turmas
				</Link>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
					Últimas Atualizações da Agenda
				</h2>
				<div className="bg-[var(--dark-gray)] p-6 rounded-lg shadow-lg">
					<p className="text-[var(--light-gray)]">
						Nenhuma atualização recente na agenda.
					</p>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
					Últimos Eventos
				</h2>
				<div className="bg-[var(--dark-gray)] p-6 rounded-lg shadow-lg">
					<p className="text-[var(--light-gray)]">
						Nenhum evento recente.
					</p>
				</div>
			</div>
		</div>
	);
}
