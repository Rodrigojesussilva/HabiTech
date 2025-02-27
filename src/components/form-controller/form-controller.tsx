import React, { useState, useEffect, useRef } from "react";
import { Card, } from "../ui/card";
import { Button } from "../ui/button";
import { SquareCheckBig, Square } from "lucide-react";

// Componente principal

interface FormContainerProps {
	FormComponent: React.ComponentType<any>; // Um componente React sem props específicas
}

const FormContainer: React.FC<FormContainerProps> = ({FormComponent}) => {

	const [secoes, setSecoes] = useState<{ nomeForm: string; descrForm: string; nomeSecao: { id: string; label: string }[] }>({
		nomeForm: "",
		descrForm: "",
		nomeSecao: [],
	});
	const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement | null>(null);

	// Quando o formulário for montado, ele vai nos dizer quais seções existem
	useEffect(() => {
		if (formRef.current) {
			const nomeForm = formRef.current.getAttribute("nome-form");
			const descrForm = formRef.current.getAttribute("descr-form");
			const secoesDetectadas = Array.from(formRef.current?.querySelectorAll("[data-secao]") as NodeListOf<HTMLElement>)
				.map((el: HTMLElement) => (
					{
						id: el.getAttribute("data-secao") || "",
						label: el.dataset.label || ""
					}
				));
			setSecoes({ nomeForm: nomeForm || "", descrForm: descrForm || "", nomeSecao: secoesDetectadas });
			if (secoesDetectadas.length > 0) setSecaoAtiva(secoesDetectadas[0].id);
			console.log(nomeForm);
		}
	}, []);

	function sectIsChecked(secao: string) {
		if (secao === "Documentação") return true
	}
	return (
		<>
			{/* Sidebar controlando as seções */}
			<div className="flex space-x-4">
				<Card className="hidden lg:block md:block w-1/4 h-4/5 fixed pl-4 pr-4 m-4 overflow-y-auto">
					<h1 className="text-primary text-lg p-4 mt-6 mb-2 font-bold text-left">Formulário: {secoes.nomeForm}</h1>
					<p className="ml-7 mb-2 text-left text-muted-foreground text-sm">Descrição do formulário:</p>
					<Card className="ml-6 mb-8 p-4 w-auto mr-4 h-auto">
						<h4 className="text-sm text-left text-muted-foreground line-clamp-4">
						{secoes.descrForm}
						</h4>
					</Card>
					{secoes.nomeSecao.length > 0 && (
						<div className="flex flex-col w-[95%] space-x-4">
							{secoes.nomeSecao.map((el, index) => (
								<Button className="flex flex-row group ml-4 w-full hover:bg-primary hover:text-primary-foreground text-primary bg-secondary mb-4">
									<div className="w-full flex flex-row">
										{sectIsChecked(el.id) ? (
											<SquareCheckBig className="h-6 w-6 text-left text-primary group-hover:text-primary-foreground"></SquareCheckBig>
										)
											:
											<Square className="h-6 w-6 text-left text-primary/70 group-hover:text-primary-foreground"></Square>
										}
										<span className="text-xs ml-2 text-left truncate">{index + 1}. {el.id} </span>
									</div>

								</Button>
							))}
						</div>
					)}
				</Card>
				<Card className="w-full md:w-3/4 lg:w-3/4 h-full p-4 lg:ml-94 md:ml-70 m-4">
					<FormComponent ref={formRef}></FormComponent>
				</Card>
			</div>
		</>
	);
};

export default FormContainer;