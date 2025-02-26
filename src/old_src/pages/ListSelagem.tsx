import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import { Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { URLs } from '../env';

const ListSelagem = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();
  
    const fetchData = async () => {
      const interviewer = localStorage.getItem("username");
      if (!interviewer) {
        alert("Usuário não encontrado no localStorage!");
        return;
      }
  
      if (!startDate || !endDate) {
        alert("Por favor, preencha as datas!");
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await axios.get(
          `${URLs.DEV}/selagem/list/${interviewer}/${startDate}/${endDate}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao buscar dados. Verifique a API.");
      } finally {
        setLoading(false);
      }
    };
  
    const handleEdit = (formNumber: string, selagem: string) => {
      localStorage.setItem("formNumber", formNumber);
      localStorage.setItem("selagem", selagem);
      navigate("/search");
    };
  
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2>Listagem de Formularios de Selagem</h2>
  
        {/* Filtros */}
        <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid item xs={6}>
            <TextField
              label="Data de Início"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Data de Fim"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchData}
              style={{ marginTop: "10px" }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
  
        {/* Conteúdo */}
        {loading ? (
          <p>Carregando...</p>
        ) : data.length > 0 ? (
          <Paper style={{ marginTop: "20px", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Número do Formulário</TableCell>
                  <TableCell>Número do Selo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Nome do Espaço Habitado</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item:any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.firstVisit || "N/A"}</TableCell>
                    <TableCell>{item.questionario}</TableCell>
                    <TableCell>{item.numeroSelo}</TableCell>
                    <TableCell>
                      {item.status}
                    </TableCell>
                    <TableCell>{item.nomeEspacoHabitado}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleEdit(item.questionario, item.selagem_id)
                        }
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <p>Nenhum dado encontrado. Faça uma busca.</p>
        )}
      </div>
    );
  }

export default ListSelagem;