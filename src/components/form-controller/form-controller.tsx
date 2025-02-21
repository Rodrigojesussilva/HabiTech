import FormArrolamento from "@/app/forms/arrolamento";
import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";

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
				<Card className="w-1/4 h-1/3 fixed p-4 m-4 ">
					<p>{secoes.nomeForm}</p>
					{secoes.secoes.length > 0 && (
						<>
							{secoes.secoes.map((el, index) => (
								<p>{el.id} {index + 1}/{secoes.secoes.length}</p>
							))}
						</>
					)}
				</Card>
				<Card className="w-3/4 h-screen p-4 ml-94 mt-4 mr-4 ">
					<FormArrolamento ref={formRef}	></FormArrolamento>
				</Card>

			</div>



		</>
	);
}
