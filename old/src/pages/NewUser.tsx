import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, Paper, Typography, Alert } from '@mui/material';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { URLs } from '../env';
import { formatCPF, isValidCPF } from '../components/validateCPF';

const CriarUsuario = () => {
  const [formData, setFormData] = useState({
    name: '',
    documentCPF: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
  const [errorCPF, setErrorCPF] = useState(false);

  const navigate = useNavigate();  // Hook para navegação


  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "documentCPF") {
      const formattedCPF = formatCPF(e.target.value);
      setFormData({ ...formData, documentCPF: formattedCPF });

      // Valida o CPF somente se estiver completo
      if (formattedCPF.length === 14) {
        setErrorCPF(!isValidCPF(formattedCPF));
        setError("")
      } else {
        setErrorCPF(false); // Enquanto o CPF está incompleto, não exibe erro
      }
    }

  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleCreateUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    if (errorCPF !== true) {
      if (userData.email && userData.name && userData.password) {        
      try {
        const response = await axios.post(`${URLs.DEV}/users`, userData);
        if (response.status === 200) {
          alert('Usuário criado com sucesso!');
          navigate('/');
        } else {
          setError('Erro ao criar o usuário.');
        }
      } catch (error) {
        console.error('Erro ao criar o usuário:', error);
        setError('Ocorreu um erro ao tentar criar o usuário.');
      }
    }else{
      setError("Preencher todos os campos")
      alert("Preencher todos os campos")
    }
      }else{
        setError("Cpf inválido")
        alert("Cpf inválido")
      }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
      <Typography variant="h6" gutterBottom>
        Criar Usuário
      </Typography>

      {error && <Typography color="error" variant="body2">{error}</Typography>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <TextField
          label="Nome"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="CPF"
          name="documentCPF"
          value={formData.documentCPF}
          onChange={handleChange}
          fullWidth
          helperText={error ? "CPF inválido" : "Digite apenas números, sem pontos ou traços. 123.456.789-09"}
          error={errorCPF}
        />
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
        <TextField
          label="Confirmar Senha"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
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
        onClick={handleCreateUser}
        style={{ marginTop: '20px', width: '100%' }}
      >
        Criar Conta
      </Button>
    </Paper>
  );
};

export default CriarUsuario;
