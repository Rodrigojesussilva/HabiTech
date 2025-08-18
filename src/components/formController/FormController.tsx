import React, { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import FormSidebar from "./FormSidebar";
import { useLocation } from "react-router-dom"; // Importa hook de rota

// Mobile Components
import { MobileFormHeader } from "./mobile/MobileFormHeader";

interface FormContainerProps {
	FormComponent: React.ComponentType<any>;
	openModalOnMount?: boolean;
	viewMode?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({ FormComponent, openModalOnMount = true, viewMode = false }) => {
	const formRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(openModalOnMount);
	const [activeFamilyIndex, setActiveFamilyIndex] = useState(0);
	const [mostrarSecoes, setMostrarSecoes] = useState(true);
	
	// Mobile detection and states
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
	const [formName, setFormName] = useState("");

	const handleFamilyIndexChange = (index: number) => {
		setActiveFamilyIndex(index);
	};

	const handleChangeMostrarSecoes = (value: boolean) => {
		setMostrarSecoes(value);
	};

	// 🔁 Sempre que mudar de rota, reabrir o modal (se permitido)
	useEffect(() => {
		setIsMetadataModalOpen(openModalOnMount);
		setActiveFamilyIndex(0); 
	}, [location.pathname, openModalOnMount]);

	// Mobile detection
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1024);
		};
		
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Extract form name from DOM when form is mounted  
	useEffect(() => {
		const form = formRef?.current;
		if (form) {
			const formNameAttr = form.getAttribute("nome-form");
			if (formNameAttr) {
				setFormName(formNameAttr);
			}
		}
	}, [location.pathname]);

	return (
		<>
			<div className="flex flex-wrap lg:flex-nowrap md:flex-nowrap gap-0">
				{/* SIDEBAR DESKTOP */}
				{!isMobile && (
					<FormSidebar
						formRef={formRef}
						handleFamilyIndexChange={handleFamilyIndexChange}
						activeFamilyIndex={activeFamilyIndex}
						isMetadataModalOpen={isMetadataModalOpen}
						setIsMetadataModalOpen={setIsMetadataModalOpen}
						mostrarSecoes={mostrarSecoes}
					/>
				)}

				<Card className={`flex-1 ${isMobile ? 'w-full' : 'min-w-[60%]'} h-full p-4 my-4 mr-4 ${isMobile ? 'ml-4' : 'ml-4'}`}>
					{/* MOBILE HEADER */}
					{isMobile && (
						<MobileFormHeader
							activeFamilyIndex={activeFamilyIndex}
							handleFamilyIndexChange={handleFamilyIndexChange}
							setIsMetadataModalOpen={setIsMetadataModalOpen}
							formName={formName}
						/>
					)}

					<FormComponent
						key={location.pathname} // Garante que remonta componente ao trocar de formulário
						ref={formRef}
						isMetadataModalOpen={isMetadataModalOpen}
						setIsMetadataModalOpen={setIsMetadataModalOpen}
						activeFamilyIndex={activeFamilyIndex}
						mostrarSecoes={mostrarSecoes}
						onChangeMostrarSecoes={handleChangeMostrarSecoes}
						viewMode={viewMode}
						isMobile={isMobile}
					/>
				</Card>
			</div>


		</>
	);
};

export default FormContainer;
