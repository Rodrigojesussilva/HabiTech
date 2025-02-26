import { Button, Grid, Collapse, Select, MenuItem, TextField, FormControl, InputLabel, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface CaractUnidaFormProps {
    id: string;
    selagem_id?: string;
    idLocal?: string;
    usoNaoIdentificado?: string,
    numComodos?: string,
    numPavimentos?: string,
    numSanitarios?: string,
    banheiroCompartilhado?: string,
    cozinhaCompartilhada?: string,
    tempoMoradiaAnos?: string,
    tempoMoradiaMeses?: string,
    tempoMoradiaNaoSabe?: boolean,
  }

const CaractUnidaForm:React.FC<CaractUnidaFormProps> = ({ 
    id,
    idLocal,
    selagem_id = id,
    usoNaoIdentificado,
    numComodos,
    numPavimentos,
    numSanitarios,
    banheiroCompartilhado,
    cozinhaCompartilhada,
    tempoMoradiaAnos,
    tempoMoradiaMeses,
    tempoMoradiaNaoSabe
}) => {
    const [dados, setDados] = useState({
        usoNaoIdentificado: usoNaoIdentificado ? usoNaoIdentificado : '',
        numComodos: numComodos ? numComodos : '',
        numPavimentos: numPavimentos ? numPavimentos : '',
        numSanitarios: numSanitarios ? numSanitarios : '',
        banheiroCompartilhado: banheiroCompartilhado ? banheiroCompartilhado : '',
        cozinhaCompartilhada: cozinhaCompartilhada ? cozinhaCompartilhada : '',
        tempoMoradiaAnos: tempoMoradiaAnos ? tempoMoradiaAnos : '',
        tempoMoradiaMeses: tempoMoradiaMeses ? tempoMoradiaMeses : '',
        tempoMoradiaNaoSabe: tempoMoradiaNaoSabe ? tempoMoradiaNaoSabe : false,
        selagem_id: id,
        idLocal: idLocal ? idLocal :  "not",
    });
    dados.selagem_id = id;
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [ok, setOk] = useState(false);

    let comercial = localStorage.getItem('comercial')

    

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
            await axios.post(`${URLs.DEV}/caract-uni-4-selagem/`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados salvos com sucesso!');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
        } else {
            await axios.put(`${URLs.DEV}/caract-uni-4-selagem/${dados.idLocal}`, dados, {
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
                {ok ? "✅- 3.1. CARACTERÍSTICAS DA UNIDADE" : "3.1. CARACTERÍSTICAS DA UNIDADE"}
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        backgroundColor: '#8b8b8b',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#797979',
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
                            label="Quantidade de Cômodos (exceto banheiro)"
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            fullWidth
                            value={dados.numComodos}
                            onChange={(e) => setDados({ ...dados, numComodos: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Quantidade de Pavimentos da Unidade"
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            fullWidth
                            value={dados.numPavimentos}
                            onChange={(e) => setDados({ ...dados, numPavimentos: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Quantidade de Sanitários na Unidade"
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            fullWidth
                            value={dados.numSanitarios}
                            onChange={(e) => setDados({ ...dados, numSanitarios: e.target.value })}
                        />
                    </Grid>

                    {comercial === "false" ? ( 
                        <>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="banheiro-compartilhado-label"
                                    sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                >O banheiro é compartilhado com outras famílias?</InputLabel>
                                <Select
                                    labelId="banheiro-compartilhado-label"
                                    value={dados.banheiroCompartilhado}
                                    onChange={(e) => setDados({ ...dados, banheiroCompartilhado: e.target.value })}
                                >
                                    <MenuItem value="Sim">Sim</MenuItem>
                                    <MenuItem value="Não">Não</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid><Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="cozinha-compartilhada-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >A cozinha é compartilhada com outras famílias?</InputLabel>
                                    <Select
                                        labelId="cozinha-compartilhada-label"
                                        value={dados.cozinhaCompartilhada}
                                        onChange={(e) => setDados({ ...dados, cozinhaCompartilhada: e.target.value })}
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Não">Não</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            </>
                    ) : <></>}
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

export default CaractUnidaForm;
