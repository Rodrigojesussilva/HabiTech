import React, { useRef } from "react";
import { Card, } from "../ui/card";
import FormSidebar from "./FormSidebar";
// Componente principal

interface FormContainerProps {
	FormComponent: React.ComponentType<any>; // Um componente React sem props específicas
}

const FormContainer: React.FC<FormContainerProps> = ({ FormComponent }) => {
	// React.RefObject<HTMLDivElement> to match FormSidebar's type expectation
	const formRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<div className="flex space-x-4">
				{/* Sidebar controlando as seções */}
				<FormSidebar formRef={formRef} />
				<Card className="w-full md:w-3/4 lg:w-3/4 h-full p-4 lg:ml-94 md:ml-70 m-4">
					<FormComponent ref={formRef}></FormComponent>
				</Card>
			</div>
		</>
	);
};

export default FormContainer;