import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    window.location.reload(); // This will force a re-render and reset the isLoginDone state
  };

  return (
    <>
      <header className="fixed z-12 w-full border-b  bg-gray-100 shadow-sm">
        <div className="flex  mx-auto h-12  items-center justify-between px-4">
          {/* Logo */}
          <div className="">
            <img
              src="/psp.png"
              alt="Image"
              className="h-12 w-28"
            />
          </div>
          <div className="text-xl  font-bold text-purple-900 ">Sistema de Cadastro de Pesquisa</div>

       
       
          <div></div>
          
        </div>
      </header>
   
      {children}
    </>
  );
}