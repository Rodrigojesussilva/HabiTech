import React, { useRef, useState } from "react";
import { Card, } from "../ui/card";
import FormSidebar from "./FormSidebar";
// Componente principal

interface FormContainerProps {
	FormComponent: React.ComponentType<any>; // Um componente React sem props específicas
}

const FormContainer: React.FC<FormContainerProps> = ({ FormComponent }) => {
	// React.RefObject<HTMLDivElement> to match FormSidebar's type expectation
	const formRef = useRef<HTMLDivElement>(null);
	const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(true);
	const [activeFamilyIndex, setActiveFamilyIndex] = useState(0);
	const [mostrarSecoes, setMostrarSecoes] = useState(true); // Estado para mostrar/ocultar seções

	const handleFamilyIndexChange = (index: number) => {
		setActiveFamilyIndex(index);
	}

	const handleChangeMostrarSecoes = (value: boolean) => {
		setMostrarSecoes(value);
	};

	return (
		<>
			<div className="flex gap-4">
				{/* Sidebar controlando as famílias e as seções */}
				<FormSidebar
					formRef={formRef}
					handleFamilyIndexChange={handleFamilyIndexChange}
					activeFamilyIndex={activeFamilyIndex}
					isMetadataModalOpen={isMetadataModalOpen}
					setIsMetadataModalOpen={setIsMetadataModalOpen}
					mostrarSecoes={mostrarSecoes} // Passar o estado para o Sidebar
				/>
				{/* Card com o formulário */}
				<Card className="w-full md:w-3/4 lg:w-3/4 h-full p-4 lg:ml-94 md:ml-70 m-4">
					<FormComponent
						ref={formRef}
						isMetadataModalOpen={isMetadataModalOpen}
						setIsMetadataModalOpen={setIsMetadataModalOpen}
						activeFamilyIndex={activeFamilyIndex}
						mostrarSecoes={mostrarSecoes} // Passar o estado para o FormComponent
						onChangeMostrarSecoes={handleChangeMostrarSecoes} // Passar o handler para o FormComponent
					/>
				</Card>
			</div>
		</>
	);
};

export default FormContainer;