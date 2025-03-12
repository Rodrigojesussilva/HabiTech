import React, { useEffect, useState } from 'react';

import { LoginForm } from "@/app/login/LoginForm"

interface LoginPageProps {
  setIsLoginDone: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoginDone }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Set a small timeout to ensure the initial opacity-0 is applied first
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`grid h-screen lg:grid-cols-2 bg-secondary transition-all duration-2000 ease-in-out ${
      isVisible 
        ? 'opacity-100 transform scale-100' 
        : 'opacity-0 transform scale-90'
    }`}>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 ">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img
              src="/psp.png"
              alt="Image"
              className="h-24 w-50"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm setIsLoginDone={setIsLoginDone} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/sehab-heliopolis-foto-nelson-kon-3.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default LoginPage;
