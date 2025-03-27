import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="flex flex-col text-left ml-20 mt-10 h-screen">
			<h1 className="text-2xl  font-bold">Bem-vindo ao sistema de Regularização Fundiária</h1>
			<p className="text-sm text-gray-500 mt-4">
				Acompanhe e gerencie formulários para ajudar a melhorar as condições em moradias precárias.
			</p>
			<p className="text-sm text-gray-500">
				Inicie um novo formulário ou revise os dados coletados.
			</p>

			<div className=" flex flex-col  mt-20 h-auto  ">
				
						<div className="flex flex-row gap-8">
						<Link to="/create-reg-fundiaria">
							<div className="group">
							
								<img 
									src="/pesquisa7.jpg" 
									alt="Pesquisa" 
									className="cursor-pointer h-40 w-40 scale-100 border-2 border-gray-300 rounded-md mr-2 transition-transform duration-300 hover:scale-110" 
								/>
								<p className="ml-2 cursor-pointer mt-2 text-sm text-gray-500">Iniciar novo formulário</p>
							</div>
						</Link>
						<Link to="/lista-reg-fundiaria">
							<div className="group">
								<img 
									src="/pesquisa6.jpg" 
									alt="Listagem" 
									className="cursor-pointer h-40 w-40 scale-100 border-2 border-gray-300 rounded-md mr-2 transition-transform duration-300 hover:scale-110" 
								/>
								<p className="ml-2 cursor-pointer mt-2 text-sm text-gray-500">Visualizar formulários</p>
							</div>
						</Link>
						</div>
				
			
			</div>
		</div>
	)
}