import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, CirclePlus } from "lucide-react"

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToForm = (formPath: string) => {
    navigate(formPath);
    setIsMenuOpen(false);
  };

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
        <div className="flex mx-auto h-14 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex flex-row items-center gap-8">
            <div className="hidden md:block">
              <img src="/psp.png" alt="Image" className="h-12 w-28" />
            </div>
            <div className="text-xl font-bold text-primary">Instrumentos de Pesquisa</div>
          </div>

          {/* Form Selection Menu */}
          <div className="flex flex-row items-center gap-6">
            <div className="relative">
              <button onClick={toggleMenu} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer">
                <CirclePlus className="text-secondary" />
                <span className="hidden md:block">Novo Formulário</span>
              </button>

              <div className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20 transition-opacity duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 visible pointer-events-none'}`}>
                <div className="py-1">
                  {formOptions.map((form, index) => (
                    <button key={index} onClick={() => navigateToForm(form.path)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
                      {form.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
            <Avatar>
              <AvatarImage src="/avatar1.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <button onClick={() => { localStorage.removeItem('isAuthenticated'); window.location.href = '/login'; }} className="flex cursor-pointer items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors" title="Sair">
              <LogOut />
            </button>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}