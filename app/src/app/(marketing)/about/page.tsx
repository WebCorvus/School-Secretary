import Link from 'next/link'

export default function About() {
    return (
        <div className="container mx-auto p-10 bg-[var(--background)] min-h-screen">
            <h1 className="text-5xl font-extrabold mb-6 text-center text-blue-900 dark:text-blue-300 drop-shadow">
                Secretaria Escolar - Escola Exemplo
            </h1>
            <p className="mb-10 text-center text-2xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
                Este é o site oficial da Secretaria da Escola Exemplo. Aqui você
                encontra informações institucionais, dados de contato e acesso
                aos principais serviços administrativos da escola. Utilize o
                menu abaixo para navegar entre as áreas disponíveis e facilitar
                seu atendimento.
            </p>

            <section className="mb-12 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-200">
                    Sobre a Escola
                </h2>
                <p className="text-xl text-gray-900 dark:text-gray-100 max-w-2xl mx-auto">
                    A Escola Exemplo é uma instituição de ensino comprometida
                    com a formação acadêmica e cidadã de seus alunos. Oferecemos
                    ensino fundamental e médio, com uma equipe de profissionais
                    qualificados e infraestrutura moderna para proporcionar o
                    melhor ambiente de aprendizagem. Nosso objetivo é promover o
                    desenvolvimento integral dos estudantes, preparando-os para
                    os desafios do futuro.
                </p>
            </section>

            <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link href="/students" className="btn text-2xl text-center">
                    Consultar Alunos
                </Link>
                <Link href="/professors" className="btn text-2xl text-center">
                    Consultar Professores
                </Link>
                <Link href="/groups" className="btn text-2xl text-center">
                    Ver Turmas
                </Link>
                <Link href="/subjects" className="btn text-2xl text-center">
                    Disciplinas Oferecidas
                </Link>
                <Link href="/itineraries" className="btn text-2xl text-center">
                    Itinerários Formativos
                </Link>
                <Link href="/lessons" className="btn text-2xl text-center">
                    Horários de Aula
                </Link>
            </section>
        </div>
    )
}
