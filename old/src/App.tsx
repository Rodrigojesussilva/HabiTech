import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Arrolamento from "./pages/Arrolamento";
import NaoResidencial from "./pages/NaoResidencial";
import OcupacaoPredial from "./pages/OcupacaoPredial";
import Residencial from "./pages/Residencial";
import Selagem from "./pages/Selagem";
import Header from "./components/Header";
import SearchForms from "./pages/Search";
import Login from "./pages/Login";
import CriarUsuario from "./pages/NewUser";
import ListSelagem from "./pages/ListSelagem";
import ListArrolamento from "./pages/ListArrolamento";
import "./App.css"

  function App() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';
    const isNewUserPage = location.pathname === '/new-user';
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <Header />
        <div style={{ display: 'flex' }}>
          {!(isLoginPage || isNewUserPage) && <Sidebar />}
          <div style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/arrolamento" element={<Arrolamento />} />
              <Route path="/nao-residencial" element={<NaoResidencial />} />
              <Route path="/ocupacao-predial" element={<OcupacaoPredial />} />
              <Route path="/residencial" element={<Residencial />} />
              <Route path="/selagem" element={<Selagem />} />
              <Route path="/search" element={<SearchForms />} />
              <Route path="/new-user" element={<CriarUsuario />} />
              <Route path="/list/selagem" element={<ListSelagem />} />
              <Route path="/list/arrolamento" element={<ListArrolamento />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
  
  export default App;