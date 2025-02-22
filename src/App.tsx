import './App.css'
import LoginPage from './app/login/page'
import Header from './components/header'
import Structure from './app/strucuture/structure'
import FormularioContainer from './components/form-controller/form-controller'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


function App() {

  return (
    <>
      <div className="relative flex h-screen flex-col bg-background">

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={
            <Header>
              <Structure>
                <FormularioContainer />
              </Structure>
            </Header>} />
        </Routes>

      </div>
    </>

  )
}

export default App
