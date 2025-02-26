import { Button, Grid, Collapse, RadioGroup, FormControlLabel, Radio, FormLabel, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface NupcidadeFormProps {
    id: string;
    idLocal?: string,
    arrolamento_id?: string
    estadoCivil?: string
    viveComCompanheiro?: string
    nomeCompanheiro?: string
  }

const NupcidadeForm: React.FC<NupcidadeFormProps> = ({ 
    id,
    estadoCivil,
    viveComCompanheiro,
    nomeCompanheiro,
    idLocal,
    arrolamento_id = id
 }) => {
    const [dados, setDados] = useState({
        estadoCivil: estadoCivil ? estadoCivil : '',
        viveComCompanheiro: viveComCompanheiro ? viveComCompanheiro : '',
        nomeCompanheiro: nomeCompanheiro ? nomeCompanheiro : '',
        arrolamento_id: id,
        idLocal: idLocal ? idLocal : "not"
    });
    dados.arrolamento_id = id;    
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [ok, setOk] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDados((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
            await axios.post(`${URLs.DEV}/nupcidade-6-arrolamento/`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados salvos com sucesso!');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
        } else {
            await axios.put(`${URLs.DEV}/nupcidade-6-arrolamento/${dados.idLocal}`, dados, {
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
               {ok ? "✅- 6. NUPCIALIDADE" : "6. NUPCIALIDADE"}
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
                    {/* Campo Estado Civil */}
                    <Grid item xs={12}>
                        <FormLabel component="legend">Qual o estado civil?</FormLabel>
                        <RadioGroup
                            name="estadoCivil"
                            value={dados.estadoCivil}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="solteiro" control={<Radio />} label="Solteiro" />
                            <FormControlLabel value="casado" control={<Radio />} label="Casado(a)" />
                            <FormControlLabel value="viuvo" control={<Radio />} label="Viúvo(a)" />
                            <FormControlLabel value="separado" control={<Radio />} label="Separado(a) Judicialmente" />
                            <FormControlLabel value="divorciado" control={<Radio />} label="Divorciado(a)" />
                        </RadioGroup>
                    </Grid>

                    {/* Campo vive em companhia do cônjuge ou companheiro */}
                    {dados.estadoCivil &&  (
                        <Grid item xs={12}>
                            <FormLabel component="legend">Vive em companhia do(a) cônjuge ou companheiro(a)?</FormLabel>
                            <RadioGroup
                                name="viveComCompanheiro"
                                value={dados.viveComCompanheiro}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                                <FormControlLabel value="nao" control={<Radio />} label="Não" />
                            </RadioGroup>
                        </Grid>
                    )}

                    {/* Campo nome completo do cônjuge ou companheiro */}
                    { dados.viveComCompanheiro === 'sim' && (
                        <Grid item xs={12}>
                            <TextField
                                name="nomeCompanheiro"
                                label="Nome completo do(a) cônjuge ou companheiro(a)"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={dados.nomeCompanheiro}
                                onChange={handleChange}
                            />
                        </Grid>
                    )}

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

export default NupcidadeForm;
