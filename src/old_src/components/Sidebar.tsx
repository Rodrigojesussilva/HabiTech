import React, { useState } from 'react';
import { List, ListItem, ListItemText, Button } from "@mui/material";
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };


  const handleLogout = () => {
    // Limpa o localStorage
    localStorage.clear();

    // Redireciona para a página inicial
    navigate('/');
  };
  return (
    <>
    <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <List style={{ flex: 1 }}>
        <ListItem component="a" href="/selagem">
          <ListItemText primary="Selagem" />
        </ListItem>
        <ListItem component="a" href="/arrolamento">
          <ListItemText primary="Arrolamento" />
        </ListItem>
        <ListItem component="a" href="/list/selagem">
          <ListItemText primary="Listagem de Selagem 📄" />
        </ListItem>
        <ListItem component="a" href="/list/arrolamento">
          <ListItemText primary="Listagem de Arrolamento 📄" />
        </ListItem>
          {/* <ListItem component="a" href="/nao-residencial">
            <ListItemText primary="Não Residencial" />
          </ListItem>
          <ListItem component="a" href="/ocupacao-predial">
            <ListItemText primary="Ocupação Predial" />
          </ListItem>
          <ListItem component="a" href="/residencial">
            <ListItemText primary="Residencial" />
          </ListItem> */}
        <ListItem component="a" href="/search">
          <ListItemText primary="Busca 🔎" />
        </ListItem>
      </List>
      <div className="logout-container">
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>

    <div className="button-container">
      <Button
        variant="contained"
        onClick={toggleSidebar}
        size="small"
        sx={{
          backgroundColor: '#91c6ff',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#6db2fc',
          },
          minWidth: '30px',
          padding: '5px',
          fontSize: '12px',
          marginLeft: '15px',
        }}
      >
        {isSidebarVisible ? '<' : '>'}
      </Button>
    </div>
  </>
);
};

export default Sidebar;
