import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    window.location.reload(); // This will force a re-render and reset the isLoginDone state
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToForm = (formPath: string) => {
    navigate(formPath);
    setIsMenuOpen(false);
  };

  // List of available forms
  const formOptions = [
    { name: "Arrolamento", path: "/create-arrolamento" },
    { name: "Selagem", path: "/create-selagem" },
    { name: "Residencial", path: "/create-residencial" },
    { name: "Não Residencial", path: "/create-nao-residencial" },
    { name: "Ocupação Predial", path: "/create-ocupacao-predial" },
   ];

  return (
    <>
      <header className="fixed z-12 w-full border-b bg-secondary shadow-sm">
        <div className="flex mx-auto h-12 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex flex-row items-center gap-8">
            <div className="">
              <img
                src="/psp.png"
                alt="Image"
                className="h-12 w-28"
              />
            </div>
            <div className="text-xl font-bold text-primary">Instrumentos de Pesquisa</div>
          </div>
          
          {/* Form Selection Menu */}
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span>Novo Formulário</span>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="py-1">
                  {formOptions.map((form, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToForm(form.path)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {form.name}
                    </button>
                  ))}
                </div>
                
              </div>
            )}
          </div>
        </div>
      </header>

      {children}
    </>
  );
}