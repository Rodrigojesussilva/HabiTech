import FormArrolamento from "@/app/forms/arrolamento";
import { useState, useEffect, useRef } from "react";
import { Card, } from "../ui/card";
import { Button } from "../ui/button";

// Componente principal
export default function FormularioContainer() {
	const [secoes, setSecoes] = useState<{ nomeForm: string; secoes: { id: string; label: string }[] }>({
		nomeForm: "",
		secoes: [],
	});
	const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement | null>(null);

	// Quando o formulário for montado, ele vai nos dizer quais seções existem
	useEffect(() => {
		if (formRef.current) {
			const nomeForm = formRef.current.getAttribute("nome-form");
			const secoesDetectadas = Array.from(formRef.current?.querySelectorAll("[data-secao]") as NodeListOf<HTMLElement>)
				.map((el: HTMLElement) => (

					{
						id: el.getAttribute("data-secao") || "",
						label: el.dataset.label || ""
					}
				));


			setSecoes({ nomeForm: nomeForm || "oi", secoes: secoesDetectadas });
			if (secoesDetectadas.length > 0) setSecaoAtiva(secoesDetectadas[0].id);
		}
	}, []);

	return (
		<>
			{/* Sidebar controlando as seções */}
			{console.log(secoes.nomeForm)}
			<div className="flex space-x-4 ">
				<Card className="hidden lg:block md:block w-1/4 h-2/3 fixed pl-4 pr-4 m-4 overflow-y-auto">
					<h1 className="text-blue-600 text-lg p-4 font-bold text-left">{secoes.nomeForm}</h1>
					<br />
					{secoes.secoes.length > 0 && (
						<>
							<div className="flex flex-col w-full space-x-4">
								{secoes.secoes.map((el, index) => (
									<Button className="flex flex-row w-full bg-grey-800 mb-4">
										<span className="w-4/5 text-blue-500 text-xs text-left truncate ">{index + 1}. {el.id} </span>
										<span className="w-1/5 text-blue-500 text-xs ">{index + 1}/{secoes.secoes.length} </span>
									</Button>
								))}
							</div>
						</>
					)}
				</Card>
				<Card className="w-full md:w-3/4 lg:w-3/4 h-screen p-4 lg:ml-94 md:ml-70  m-4 ">
					<FormArrolamento ref={formRef}	></FormArrolamento>
				</Card>

			</div>



		</>
	);
}
