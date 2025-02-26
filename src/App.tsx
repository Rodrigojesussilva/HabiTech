import './App.css'
import LoginPage from './app/login/page'
import Header from './components/header'
import Structure from './app/strucuture/structure'
import FormularioContainer from './components/form-controller/form-controller'

import { Routes, Route } from "react-router-dom";
import FormArrolamento from './app/forms/FormArrolamento'
import { useState, useEffect } from 'react'

function App() {
  const [isLoginDone, setIsLoginDone] = useState(() => {
    // Initialize state from localStorage
    return localStorage.getItem('isAuthenticated') === 'true'
  });

  useEffect(() => {
    // Update localStorage when isLoginDone changes
    if (isLoginDone) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
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
              </Routes>
            </Structure>
          </>
        )}
      </div>
    </>
  )
}

export default App
