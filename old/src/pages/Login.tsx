import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, InputAdornment, IconButton } from '@mui/material';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLs } from '../env';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();  // Hook para navegação

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async () => {
    // Dados a serem enviados para a API (sem criptografar a senha aqui)
    const userData = {
      email: formData.email,
      password: formData.password, // Envia a senha sem criptografar
    };
  
    try {
      // Envia uma requisição POST para realizar o login
      const response = await axios.post(`${URLs.DEV}/login`, userData);
  
      // Verifica se o login foi bem-sucedido
      if (response.status === 200) {
        // Caso o login seja bem-sucedido, armazena o nome no localStorage
        localStorage.setItem('username', response.data.name); // Supondo que a resposta tenha o campo 'name'
        navigate('/home');
      } else {
        setError('Senha ou e-mail incorretos.');
      }
    } catch (error) {
      console.error('Erro ao realizar o login:', error);
      setError('Ocorreu um erro ao tentar realizar o login.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
      <Typography variant="h6" gutterBottom>
        Login
      </Typography>

      {error && <Typography color="error" variant="body2">{error}</Typography>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />
 <TextField
          label="Senha"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? 'Esconder' : 'Mostrar'}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        style={{ marginTop: '20px', width: '100%' }}
      >
        Entrar
      </Button>
    </Paper>
  );
};

export default Login;
