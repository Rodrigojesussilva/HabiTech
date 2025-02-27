import './App.css'
import LoginPage from './app/login/page'
import Header from './components/header'
import Structure from './app/strucuture/structure'
import FormularioContainer from './components/form-controller/form-controller'
import ThemeEditor from './components/theme-editor'

import { Routes, Route } from "react-router-dom";
import FormArrolamento from './app/forms/FormArrolamento'
import { useState, useEffect } from 'react'

function App() {
  const [isLoginDone, setIsLoginDone] = useState(() => {
    // Initialize state from localStorage
    return localStorage.getItem('isAuthenticated') === 'true'
  });
  
  const [showThemeEditor, setShowThemeEditor] = useState(false);

  useEffect(() => {
    // Update localStorage when isLoginDone changes
    if (isLoginDone) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
    
    // Add keyboard shortcut to show/hide theme editor (Ctrl+Shift+T)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        setShowThemeEditor(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginDone]);

  return (
    <>
      <div className="relative flex h-screen flex-col bg-background">
        {!isLoginDone && (<Routes>
          <Route path="/" element={<LoginPage setIsLoginDone={setIsLoginDone} />} />
          <Route path="/login" element={<LoginPage setIsLoginDone={setIsLoginDone} />} />
        </Routes>
        )}
        {isLoginDone && (
          <>
            <Header />
            <Structure>
              <Routes>
                <Route path="/" element={<FormularioContainer FormComponent={FormArrolamento} />} />
                <Route path="/home" element={<FormularioContainer FormComponent={FormArrolamento} />} />
                <Route path="/create-arrolamento" element={<FormularioContainer FormComponent={FormArrolamento} />} />
                <Route path="/theme-editor" element={<ThemeEditor />} />
              </Routes>
            </Structure>
          </>
        )}
        
        {/* Floating theme editor - toggle with Ctrl+Shift+T */}
        {showThemeEditor && (
          <div className="fixed top-4 right-4 z-50 w-96 max-h-[90vh] overflow-auto">
            <ThemeEditor />
          </div>
        )}
      </div>
    </>
  )
}

export default App
