import { Button, Grid, TextField, Collapse } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { URLs } from "../../env";

interface IdentUnidadeFormProps {
    id: string;
    selagem_id?: string;
    idLocal?: string;
    nomeEspacoHabitado?: string,
    identificacaoSeloSetor?: string,
    identificacaoSeloLote?: string,
    identificacaoSeloUnidade?: string,
    identificacaoSeloComplemento?: string,
    numeroSelo?: string,
  }
  
const IdentUnidadeForm: React.FC<IdentUnidadeFormProps> = ({ 
    id,
    identificacaoSeloComplemento,
    identificacaoSeloLote,
    identificacaoSeloSetor,
    identificacaoSeloUnidade,
    nomeEspacoHabitado,
    numeroSelo,
    idLocal,
    selagem_id = id
 }) => {
    const [dados, setDados] = useState({
        nomeEspacoHabitado: nomeEspacoHabitado ? nomeEspacoHabitado : '',
        identificacaoSeloSetor: identificacaoSeloSetor ? identificacaoSeloSetor : '',
        identificacaoSeloLote: identificacaoSeloLote ? identificacaoSeloLote : '',
        identificacaoSeloUnidade: identificacaoSeloUnidade ? identificacaoSeloUnidade : '',
        identificacaoSeloComplemento: identificacaoSeloComplemento ? identificacaoSeloComplemento : '',
        numeroSelo: numeroSelo ? numeroSelo : '',
        selagem_id: id,
        idLocal: idLocal ? idLocal :  "not",
    });
    dados.selagem_id = id;
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [ok, setOk] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        dados.numeroSelo = `${dados.identificacaoSeloSetor}/${dados.identificacaoSeloLote}${dados.identificacaoSeloUnidade} - ${dados.identificacaoSeloComplemento}`;
        
        setDados((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
            await axios.post(`${URLs.DEV}/ident-unidade-1-selagem/`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados salvos com sucesso!');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
        } else {
            await axios.put(`${URLs.DEV}/ident-unidade-1-selagem/${dados.idLocal}`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados editados com sucesso!');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
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
                {ok ? "✅- 1. IDENTIFICAÇÃO DO ESPAÇO HABITADO" : "1. IDENTIFICAÇÃO DO ESPAÇO HABITADO" }
                <Button
                    variant="contained"
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nome do espaço habitado"
                            name="nomeEspacoHabitado"
                            value={dados.nomeEspacoHabitado}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Identificação do Selo - Setor"
                            name="identificacaoSeloSetor"
                            value={dados.identificacaoSeloSetor}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{
                                maxLength: 3, // Limita a digitação a 3 caractere
                            }}
                            onBlur={(e) => {
                                // Adiciona zeros à esquerda para completar 3 dígitos
                                const value = e.target.value.padStart(3, '0');
                                handleChange({
                                    target: {
                                        name: 'identificacaoSeloSetor',
                                        value,
                                    },
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Identificação do Selo - Lote"
                            name="identificacaoSeloLote"
                            // type="number" inputProps={{ min: 0 }} //verificar isso depois
                            value={dados.identificacaoSeloLote}
                            onChange={handleChange}
                            required
                            inputProps={{
                                maxLength: 4, // Limita a digitação a 4 caractere
                            }}
                            InputLabelProps={{
                                shrink: true, // Garante que o label esteja sempre acima do campo
                            }}
                            fullWidth
                            onBlur={(e) => {
                                // Adiciona zeros à esquerda para completar 3 dígitos
                                const value = e.target.value.padStart(4, '0');
                                handleChange({
                                    target: {
                                        name: 'identificacaoSeloLote',
                                        value,
                                    },
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Identificação do Selo - Unidade"
                            name="identificacaoSeloUnidade"
                            type="text"
                            value={dados.identificacaoSeloUnidade}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true, // Garante que o label esteja sempre acima do campo
                            }}
                            fullWidth
                            required
                            inputProps={{
                                maxLength: 2, // Limita a digitação a 1 caractere
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Identificação do Selo – Complemento"
                            name="identificacaoSeloComplemento"
                            type="text"
                            value={dados.identificacaoSeloComplemento}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true, // Garante que o label esteja sempre acima do campo
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Número do Selo"
                            type="text"
                            name="numeroSelo"
                            value={`${dados.identificacaoSeloSetor}/${dados.identificacaoSeloLote}${dados.identificacaoSeloUnidade}-${dados.identificacaoSeloComplemento}`}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true, // Garante que o label esteja sempre acima do campo
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} >
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

export default IdentUnidadeForm;