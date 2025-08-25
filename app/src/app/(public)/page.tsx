import Link from 'next/link';

export default function Home() {
	return (
		<div className="flex w-screen h-screen text-gray-200 ">
			<div className="flex flex-col w-64 border-r border-gray-800 ">
				<button className="relative text-sm focus:outline-none group">
					<div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-800 hover: transition-colors duration-200">
						<div className="flex items-center">
							<svg
								className="w-8 h-8 mr-3 text-gray-500"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
							<span className="font-medium">Projeto X</span>
						</div>
						<svg
							className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-transform transform"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="absolute z-10 flex-col items-start hidden w-full pb-1  border border-gray-700 shadow-lg group-focus:flex top-16">
						<Link
							className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200"
							href="/dashboard"
						>
							Dashboard
						</Link>
						<Link
							className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200"
							href="/settings"
						>
							Configurações
						</Link>
						<Link
							className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200"
							href="/logout"
						>
							Sair
						</Link>
					</div>
				</button>

				<div className="flex flex-col flex-grow p-4 overflow-auto">
					<Link
						className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover: transition-colors duration-200"
						href="/dashboard"
					>
						<svg
							className="w-5 h-5 mr-3 text-gray-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						<span className="leading-none">Dashboard</span>
					</Link>
					<Link
						className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover: transition-colors duration-200"
						href="/documents"
					>
						<svg
							className="w-5 h-5 mr-3 text-gray-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<span className="leading-none">Documentos</span>
					</Link>
					<Link
						className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover: transition-colors duration-200"
						href="/messages"
					>
						<svg
							className="w-5 h-5 mr-3 text-gray-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
							/>
						</svg>
						<span className="leading-none">Mensagens</span>
					</Link>
					<Link
						className="flex items-center flex-shrink-0 h-10 px-3 mt-auto text-sm font-medium  rounded hover:bg-gray-700 transition-colors duration-200"
						href="/new-item"
					>
						<svg
							className="w-5 h-5 text-gray-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						<span className="ml-2 leading-none">Novo Item</span>
					</Link>
				</div>
			</div>

			<div className="flex flex-col flex-grow ">
				<div className="flex items-center flex-shrink-0 h-16 px-8  border-b border-gray-700">
					<h1 className="text-lg font-medium text-gray-300">
						Dashboard de Visão Geral
					</h1>
					<div className="flex ml-auto">
						<button className="flex items-center justify-center h-10 px-4 text-sm font-medium rounded hover:bg-gray-700 transition-colors duration-200">
							Ação 1
						</button>
						<button className="flex items-center justify-center h-10 px-4 ml-2 text-sm font-medium rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200">
							Ação 2
						</button>
						<button className="relative ml-2 text-sm focus:outline-none group">
							<div className="flex items-center justify-between w-10 h-10 rounded hover:bg-gray-700 transition-colors duration-200">
								<svg
									className="w-5 h-5 mx-auto text-gray-500 group-hover:text-gray-300"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
									/>
								</svg>
							</div>
							<div className="absolute right-0 flex-col items-start hidden w-40 pb-1  border border-gray-700 shadow-lg group-focus:flex">
								<Link
									className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200"
									href="/option1"
								>
									Opção 1
								</Link>
								<Link
									className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200"
									href="/option2"
								>
									Opção 2
								</Link>
								<Link
									className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200"
									href="/option3"
								>
									Opção 3
								</Link>
							</div>
						</button>
					</div>
				</div>

				<div className="flex-grow p-6 overflow-auto ">
					<div className="grid grid-cols-3 gap-6">
						<div className="h-48 col-span-1 p-4  border border-gray-700 rounded-lg">
							<h2 className="font-bold text-gray-300">
								Card de Resumo
							</h2>
							<p className="text-sm text-gray-400 mt-2">
								Aqui vai um resumo de dados importantes. Este
								card pode conter um gráfico ou métricas
								principais.
							</p>
						</div>
						<div className="h-48 col-span-2 p-4  border border-gray-700 rounded-lg">
							<h2 className="font-bold text-gray-300">
								Tabela de Dados Recentes
							</h2>
							<p className="text-sm text-gray-400 mt-2">
								Esta área é perfeita para uma tabela, lista ou
								qualquer dado que precise de mais espaço
								horizontal.
							</p>
						</div>
						<div className="h-48 col-span-3 p-4  border border-gray-700 rounded-lg">
							<h2 className="font-bold text-gray-300">
								Feed de Atividades
							</h2>
							<p className="text-sm text-gray-400 mt-2">
								Um componente que ocupa a largura total, ideal
								para um log de atividades ou timeline.
							</p>
						</div>
						<div className="h-48 col-span-2 p-4  border border-gray-700 rounded-lg"></div>
						<div className="h-48 col-span-1 p-4  border border-gray-700 rounded-lg"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
