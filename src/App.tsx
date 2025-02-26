import './App.css'
import LoginPage from './app/login/page'
import Header from './components/header'
import Structure from './app/strucuture/structure'
import FormularioContainer from './components/form-controller/form-controller'

import { Routes, Route } from "react-router-dom";
import FormArrolamento from './app/forms/FormArrolamento'
import { useState } from 'react'

function App() {
  const [isLoginDone, setIsLoginDone] = useState(false);

  return (
    <>
      <div className="relative flex h-screen flex-col bg-background">
        <Routes>
          <Route path="/" element={<LoginPage setIsLoginDone={setIsLoginDone} />} />
        </Routes>
        {isLoginDone && (
          <>
            <Header />
            <Structure>
              <Routes>
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
