import React, { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import FormSidebar from "./FormSidebar";
import { useLocation } from "react-router-dom"; // Importa hook de rota

// Mobile Components
import { MobileFormHeader } from "./mobile/MobileFormHeader";
import { MobileBottomNav } from "./mobile/MobileBottomNav";
import { MobileMetadataFAB } from "./mobile/MobileMetadataFAB";
import { MobileMetadataDrawer } from "./mobile/MobileMetadataDrawer";

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
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
	const [formDomSections, setFormDomSections] = useState<{id: string; label: string}[]>([]);
	const [activeSection, setActiveSection] = useState<string | null>(null);
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

	// Listen for custom events to handle mobile metadata actions
	useEffect(() => {
		const handleOpenMetadataModal = () => {
			setIsMetadataModalOpen(true);
		};

		window.addEventListener('openMetadataModal', handleOpenMetadataModal);
		return () => window.removeEventListener('openMetadataModal', handleOpenMetadataModal);
	}, []);

	// Extract form sections and metadata from DOM when form is mounted
	useEffect(() => {
		const form = formRef?.current;
		if (form) {
			const formNameAttr = form.getAttribute("nome-form");
			if (formNameAttr) {
				setFormName(formNameAttr);
			}

			// Extract sections from DOM
			const sections = Array.from(form.querySelectorAll("[data-secao]"))
				.map((el) => ({
					id: el.getAttribute("data-secao") || "",
					label: el.getAttribute("data-label") || ""
				}))
				.filter((section) => section.id);

			setFormDomSections(sections);
		}
	}, [location.pathname]);

	// Handle section navigation
	const handleSectionClick = (sectionId: string) => {
		const element = document.querySelector(`[data-secao="${sectionId}"]`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			setActiveSection(sectionId);
		}
	};

	// Mobile-specific metadata handler
	const handleMobileMetadataOpen = () => {
		if (isMobile) {
			setIsMobileDrawerOpen(true);
		} else {
			setIsMetadataModalOpen(true);
		}
	};

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
							setIsMetadataModalOpen={handleMobileMetadataOpen}
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

			{/* MOBILE COMPONENTS */}
			{isMobile && (
				<>
					{/* Bottom Navigation */}
					<MobileBottomNav
						formDomSections={formDomSections}
						activeSection={activeSection}
						handleSectionClick={handleSectionClick}
					/>

					{/* Floating Action Button */}
					<MobileMetadataFAB
						setIsMetadataModalOpen={handleMobileMetadataOpen}
						hasUnsavedChanges={false} // TODO: implement dirty form detection
					/>

					{/* Mobile Metadata Drawer */}
					<MobileMetadataDrawer
						open={isMobileDrawerOpen}
						onClose={() => setIsMobileDrawerOpen(false)}
						formName={formName}
					/>
				</>
			)}
		</>
	);
};

export default FormContainer;
