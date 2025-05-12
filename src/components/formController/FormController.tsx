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
	const handleFamilyIndexChange = (index: number) => {
		setActiveFamilyIndex(index);
	}
	return (
		<>
			<div className="flex flex-wrap lg:flex-nowrap md:flex-nowrap gap-0">
				{/* Sidebar controlando as famílias e as seções */}
				<FormSidebar
					formRef={formRef}
					handleFamilyIndexChange={handleFamilyIndexChange}
					activeFamilyIndex={activeFamilyIndex}
					isMetadataModalOpen={isMetadataModalOpen}
					setIsMetadataModalOpen={setIsMetadataModalOpen}
				/>
				{/* Card com o formulário */}
				<Card className="flex-1 min-w-[60%] h-full p-4 my-4 mr-4 ml-4">
					<FormComponent
						ref={formRef}
						isMetadataModalOpen={isMetadataModalOpen}
						setIsMetadataModalOpen={setIsMetadataModalOpen}
						activeFamilyIndex={activeFamilyIndex}
					/>
				</Card>
			</div>
		</>
	);
};

export default FormContainer;