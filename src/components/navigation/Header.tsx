import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, CirclePlus } from "lucide-react";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const navigateToForm = (formPath: string) => {
    navigate(formPath);
    setIsMenuOpen(false);
  };

  const formOptions = [
    { name: "Selagem", path: "/create-selagem" },
    { name: "Arrolamento", path: "/create-arrolamento" },
    { name: "Residencial", path: "/create-residencial" },
    { name: "Não Residencial", path: "/create-nao-residencial" },
    { name: "Ocupação Predial", path: "/create-ocupacao-predial" },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 w-full h-14 border-b bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80 shadow-sm">
        <div className="flex mx-auto h-full items-center justify-between px-4 max-w-[1400px]">
          {/* Logo e título */}
          <div className="flex flex-row items-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded-md"
              title="Ir para página inicial"
            >
              <img
                src="/logo-habitasampa.png"
                alt="Logo HabitaSampa"
                className="h-16 w-auto md:h-18 lg:h-20 object-contain select-none transition-all"
              />
            </button>
            <span className="text-[14px] sm:text-lg md:text-xl font-semibold text-[var(--habitasampa-blue,#0F62AC)] whitespace-nowrap leading-tight">
              Instrumentos de Pesquisa
            </span>

          </div>

          {/* Menu e Avatar */}
          <div className="flex flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <button
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                className="h-9 px-3 md:px-4 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all flex items-center gap-2 cursor-pointer shadow-sm border-2 border-[#0A66C2] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0A66C2]/30"
              >
                <CirclePlus className="h-4 w-4" />
                <span className="hidden md:block font-medium">Novo Formulário</span>
              </button>

              {/* Dropdown do menu */}
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 z-50 transform transition-all duration-200 ease-in-out ${isMenuOpen
                    ? "opacity-100 visible scale-100"
                    : "opacity-0 invisible scale-95 pointer-events-none"
                  }`}
              >
                <div className="py-1">
                  {formOptions.map((form, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToForm(form.path)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors"
                    >
                      {form.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Avatar */}
            <Avatar className="size-8 border border-gray-300 shadow-sm">
              <AvatarImage src="/avatar1.jpg" />
              <AvatarFallback>EU</AvatarFallback>
            </Avatar>

            {/* Botão sair */}
            <button
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                window.location.href = "/login";
              }}
              className="bg-blue-600 flex cursor-pointer items-center justify-center p-2 rounded-full text-white hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 shadow-sm"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Espaço para não cobrir conteúdo */}
      <div className="h-14" aria-hidden="true" />
      {children}
    </>
  );
}
