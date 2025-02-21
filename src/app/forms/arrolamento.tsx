import { useState, useEffect} from "react";
import type { Ref } from "react";

interface FormArrolamentoProps {
	ref: Ref<HTMLDivElement>;
  }
const FormArrolamento = ({ref} : FormArrolamentoProps) => {
	return (
		<div ref={ref} nome-form="Arrolamento">
			<div data-secao="Identificação do proprietário paralelepipedo"></div>
			<div data-secao="Documentação"></div>
			<div data-secao="Características da Unidade"></div>
			<div data-secao="Deficiências"></div>
		</div>
	)
};
export default FormArrolamento;