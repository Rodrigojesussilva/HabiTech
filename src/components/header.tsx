import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="text-xl font-bold">MinhaLogo</div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-black">Início</a>
          <a href="#" className="text-gray-700 hover:text-black">Sobre</a>
          <a href="#" className="text-gray-700 hover:text-black">Contato</a>
        </nav>

        {/* Botão de Ação */}
        <Button>Entrar</Button>

        {/* Menu Mobile */}
        <button className="md:hidden">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </header>
  );
}