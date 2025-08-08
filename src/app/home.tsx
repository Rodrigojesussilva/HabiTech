
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="flex flex-col text-left px-4 md:ml-20 mt-10 min-h-screen">
			<h1 className="text-2xl font-bold">Bem-vindo ao sistema de Instrumentos de Pesquisa</h1>
			<p className="text-sm text-gray-500 mt-4">
				Acompanhe e gerencie formulários para ajudar a melhorar as condições em moradias precárias.
			</p>
			<p className="text-sm text-gray-500">
				Inicie um novo formulário ou revise os dados coletados.
			</p>

			<div className="mt-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 place-items-center sm:place-items-start mx-auto">
					<Link to="/create-selagem" className="w-full max-w-[220px]">
						<div className="group w-full text-center sm:text-left">
							<img
								src="/pesquisa7.jpg"
								alt="Nova Selagem"
								className="cursor-pointer w-full aspect-square object-cover border-2 border-gray-300 rounded-md transition-transform duration-300 group-hover:scale-105"
							/>
							<p className="mt-2 text-sm text-gray-600">Iniciar nova Selagem</p>
						</div>
					</Link>

					<Link to="/lista-selagens" className="w-full max-w-[220px]">
						<div className="group w-full text-center sm:text-left">
							<img
								src="/pesquisa6.jpg"
								alt="Listar Selagens"
								className="cursor-pointer w-full aspect-square object-cover border-2 border-gray-300 rounded-md transition-transform duration-300 group-hover:scale-105"
							/>
							<p className="mt-2 text-sm text-gray-600">Visualizar Selagens</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}