import FormArrolamento from "@/app/forms/arrolamento";
import { useState, useEffect, useRef } from "react";

// Componente principal
export default function FormularioContainer() {
	const [secoes, setSecoes] = useState<{ id: string; label: string }[]>([]);
	const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement | null>(null);

	// Quando o formulário for montado, ele vai nos dizer quais seções existem
	useEffect(() => {
		if (formRef.current) {
			const secoesDetectadas = Array.from(formRef.current?.querySelectorAll("[data-secao]") as NodeListOf<HTMLElement>)
				.map((el: HTMLElement) => (

					{
						id: el.getAttribute("data-secao") || "",
						label: el.dataset.label || ""
					}
				));
			console.log("ref:"+formRef.current?.querySelector("[data-secao]"));

			setSecoes(secoesDetectadas);
			if (secoesDetectadas.length > 0) setSecaoAtiva(secoesDetectadas[0].id);
		}
	}, []);

	return (
		<>
			{/* Sidebar controlando as seções */}
			<FormArrolamento ref={formRef}	></FormArrolamento>
			<p>{secoes.length > 0  ? secoes[0].id : ""}</p>

		</>
	);
}
