import { Button, Grid, Collapse, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface StatusNotasFormProps {
    id: string;
    idLocal?: string,
    arrolamento_id?: string
    status?: string
    justificativa?: string
    nomeSupervisor?: string
    observacao?: string
  }


const StatusNotasForm: React.FC<StatusNotasFormProps> = ({ 
    id,
    idLocal,
    arrolamento_id = id,
    status,
    justificativa,
    nomeSupervisor,
    observacao
 }) => {
    const [dados, setDados] = useState({
        status: status ? status : '',
        justificativa: justificativa ? justificativa : '',
        nomeSupervisor: nomeSupervisor ? nomeSupervisor : '',
        observacao: observacao ? observacao : '',
        arrolamento_id: id,
        idLocal: idLocal ? idLocal : "not"
    });
    dados.arrolamento_id = id;    
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [ok, setOk] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setDados((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
            await axios.post(`${URLs.DEV}/status-notas-10-arrolamento/`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados salvos com sucesso!');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
        } else {
            await axios.put(`${URLs.DEV}/status-notas-10-arrolamento/${dados.idLocal}`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados editados com sucesso!');
        }
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
            alert('Erro ao salvar os dados');
        }
    };
    return (
        <>
            <div
                className="section-header"
                onClick={() => setMostrarIdentificacao(!mostrarIdentificacao)}
                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', borderRadius: '15px' }}
            >
                {ok ? "✅- 10. STATUS E NOTAS": "10. STATUS E NOTAS"}
                <Button
                    variant="contained"
                    //   onClick={toggleSidebar}
                    size="small"
                    sx={{
                        backgroundColor: '#8b8b8b', // Cor personalizada de fundo
                        color: '#FFFFFF',           // Cor do texto
                        '&:hover': {
                            backgroundColor: '#797979', // Cor ao passar o mouse
                        },
                        minWidth: '30px',
                        padding: '5px',
                        fontSize: '12px',
                        marginLeft: '15px',
                    }}
                >
                    {mostrarIdentificacao ? 'Esconder Formulário' : 'Mostrar Formulário'}
                </Button>
            </div>
            <Collapse in={mostrarIdentificacao}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel id="status-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >
                                Status
                            </InputLabel>
                            <Select
                                labelId="status-label"
                                name="status"
                                value={dados.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Selecione uma opção</em>
                                </MenuItem>
                                <MenuItem value="concluida">Concluída</MenuItem>
                                <MenuItem value="incompleta">Concluída Incompleta</MenuItem>
                                <MenuItem value="morador ausente">Concluída Morador Ausente</MenuItem>
                                <MenuItem value="recusa">Concluída Recusa</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Justificativa"
                            name="justificativa"
                            multiline
                            minRows={3} // Quantidade mínima de linhas
                            value={dados.justificativa}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Nome do Supervisor"
                            name="nomeSupervisor"
                            value={dados.nomeSupervisor}
                            onChange={handleChange}
                            // className="form-field"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Observação"
                            name="observacao"
                            multiline
                            minRows={3} // Quantidade mínima de linhas
                            value={dados.observacao}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Salvar
                        </Button>
                    </Grid>
                </Grid>
            </Collapse>
        </>
    );
};

export default StatusNotasForm;