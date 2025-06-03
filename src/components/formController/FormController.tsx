import React, { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import FormSidebar from "./FormSidebar";
import { useLocation } from "react-router-dom"; // Importa hook de rota

interface FormContainerProps {
	FormComponent: React.ComponentType<any>;
}

const FormContainer: React.FC<FormContainerProps> = ({ FormComponent }) => {
	const formRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(true);
	const [activeFamilyIndex, setActiveFamilyIndex] = useState(0);
	const [mostrarSecoes, setMostrarSecoes] = useState(true);

	const handleFamilyIndexChange = (index: number) => {
		setActiveFamilyIndex(index);
	};

	const handleChangeMostrarSecoes = (value: boolean) => {
		setMostrarSecoes(value);
	};

	// 🔁 Sempre que mudar de rota, reabrir o modal
	useEffect(() => {
		setIsMetadataModalOpen(true);
		setActiveFamilyIndex(0); 
	}, [location.pathname]);

	return (
		<div className="flex flex-wrap lg:flex-nowrap md:flex-nowrap gap-0">
			<FormSidebar
				formRef={formRef}
				handleFamilyIndexChange={handleFamilyIndexChange}
				activeFamilyIndex={activeFamilyIndex}
				isMetadataModalOpen={isMetadataModalOpen}
				setIsMetadataModalOpen={setIsMetadataModalOpen}
				mostrarSecoes={mostrarSecoes}
			/>

			<Card className="flex-1 min-w-[60%] h-full p-4 my-4 mr-4 ml-4">
				<FormComponent
					key={location.pathname} // Garante que remonta componente ao trocar de formulário
					ref={formRef}
					isMetadataModalOpen={isMetadataModalOpen}
					setIsMetadataModalOpen={setIsMetadataModalOpen}
					activeFamilyIndex={activeFamilyIndex}
					mostrarSecoes={mostrarSecoes}
					onChangeMostrarSecoes={handleChangeMostrarSecoes}
				/>
			</Card>
		</div>
	);
};

export default FormContainer;
