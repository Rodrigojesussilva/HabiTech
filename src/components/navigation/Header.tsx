import { useNavigate } from "react-router-dom";
import { useState, CSSProperties } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, CirclePlus } from "lucide-react";

type LogoVars = CSSProperties & {
  ["--logo-w"]?: string;
  ["--logo-w-md"]?: string;
};

interface HeaderProps {
  children?: React.ReactNode;
  logoWidth?: { base?: number; md?: number };
}

export default function Header({ children, logoWidth }: HeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const base = logoWidth?.base ?? 110; // px no mobile
  const md = logoWidth?.md ?? 150;     // px no md+

  const logoStyle: LogoVars = {
    "--logo-w": `${base}px`,
    "--logo-w-md": `${md}px`,
  };

  const formOptions = [
    { name: "Selagem", path: "/create-selagem" },
    { name: "Arrolamento", path: "/create-arrolamento" },
    { name: "Residencial", path: "/create-residencial" },
    { name: "Não Residencial", path: "/create-nao-residencial" },
    { name: "Ocupação Predial", path: "/create-ocupacao-predial" },
  ];

  const go = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 w-full h-14 border-b bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80 shadow-sm">
        <div className="mx-auto max-w-[1400px] h-full px-3 sm:px-4 flex items-center justify-between">
          {/* Logo + Título */}
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src="/logo-habitasampa.png"
              alt="HabitaSampa"
              style={logoStyle}
               className="h-16 w-auto md:h-18 lg:h-20 object-contain select-none transition-all"
              loading="eager"
            />
            <span className="text-[14px] sm:text-lg md:text-xl font-semibold text-[var(--habitasampa-blue,#0F62AC)] whitespace-nowrap leading-tight">
              Instrumentos de Pesquisa
            </span>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Botão Novo Formulário */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                 className="h-9 px-3 md:px-4 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all flex items-center gap-2 cursor-pointer shadow-sm border-2 border-[#0A66C2] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0A66C2]/30"
              >
                <CirclePlus className="h-4 w-4" />
                <span className="hidden md:block">Novo Formulário</span>
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 z-50 transition-opacity duration-200 ${
                  isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <div className="py-1">
                  {formOptions.map((f) => (
                    <button
                      key={f.path}
                      onClick={() => go(f.path)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Avatar */}
            <Avatar className="size-8">
              <AvatarImage src="/avatar1.jpg" />
              <AvatarFallback>EU</AvatarFallback>
            </Avatar>

            {/* Logout — visível no mobile também */}
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

      <div className="h-14" aria-hidden="true" />
      {children}
    </>
  );
}
