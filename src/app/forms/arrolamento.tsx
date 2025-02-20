import { useState, useEffect} from "react";
import type { Ref } from "react";

interface FormArrolamentoProps {
	ref: Ref<HTMLDivElement>;
  }
const FormArrolamento = ({ref} : FormArrolamentoProps) => {
	return (
		<div ref={ref}>
			<div data-secao="alow">Oi</div>
		</div>
	)
};
export default FormArrolamento;