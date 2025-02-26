import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Collapse, FormControlLabel, Checkbox } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface SituUsoUniFormProps {
    id: string;
    idLocal?: string,
    selagem_id?: string
    situacao?: string
    uso?: string
    quaisTipos?: string,
    qualUso?: string,
    usoNaoIdentificado?: string
    nomeResponsavel?: string
    telefoneResponsavel?: string
    responsavelIdentificado?: boolean
    usoTerreno?: string
    handleShowCaractUnidInfra: (show: boolean) => void;
}

const SituUsoUniForm: React.FC<SituUsoUniFormProps> = ({
    id,
    idLocal,
    selagem_id = id,
    situacao,
    uso,
    usoNaoIdentificado,
    quaisTipos,
    qualUso,
    nomeResponsavel,
    telefoneResponsavel,
    responsavelIdentificado,
    usoTerreno,
    handleShowCaractUnidInfra
}) => {
    const [dados, setDados] = useState({
        situacao: situacao ? situacao : '',
        uso: uso ? uso : '',
        usoNaoIdentificado: usoNaoIdentificado ? usoNaoIdentificado : '',
        idLocal: idLocal ? idLocal : "not",
        selagem_id: id,
        quaisTipos: quaisTipos ? quaisTipos : "",
        qualUso: qualUso ? qualUso : "",
        nomeResponsavel: nomeResponsavel ? nomeResponsavel : "",
        telefoneResponsavel: telefoneResponsavel ? telefoneResponsavel : "",
        responsavelIdentificado: responsavelIdentificado ? responsavelIdentificado : false,
        usoTerreno: usoTerreno ? usoTerreno : "",
    });
    dados.selagem_id = id;
    const [mostrarContatos, setMostrarContatos] = useState(false);
    const [ok, setOk] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, checked } = e.target;
        if (name === "situacao") {
            if (value === "Terreno cercado" || value === "Terreno sem cercamento") {
                handleShowCaractUnidInfra(false);
                setDados((prevState) => ({
                    ...prevState,
                    uso: '',
                }));
            } else {
                handleShowCaractUnidInfra(true);
            }
        }

        setDados((prevState) => ({
            ...prevState,
            [name]:  value 
        }));

    };
    const handleResponsavelCheckBoxChange = (e: any) => {
        const { checked } = e.target;
        setDados((prevState) => ({
            ...prevState,
            nomeResponsavel: "",
            telefoneResponsavel: "",
            responsavelIdentificado:  checked 
        }));

    };
    const formatarTelefone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');

        const limited = cleaned.slice(0, 12);

        if (limited.length <= 2) return `(${limited}`;
        if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 12)}`
    };

    const mostrarUsoNaoIdentificado = () => {
        return ['Em construção/(vazio)', 'Em reforma/(vazio)', 'Unidade vazia'].includes(dados.situacao);
    };
    const handleSave = async () => {
        try {

            if (dados.uso === "Comercial") {
                localStorage.setItem('comercial', JSON.stringify(true));
            } else {
                localStorage.setItem('comercial', JSON.stringify(false));
            }

            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/situ-uso-uni-3-selagem/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
                setMostrarContatos(!mostrarContatos);
                setOk(!ok);
            } else {
                await axios.put(`${URLs.DEV}/situ-uso-uni-3-selagem/${dados.idLocal}`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados editados com sucesso!');
                setMostrarContatos(!mostrarContatos);
                setOk(!ok);
            }
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
            alert('Erro ao salvar os dados');
        }
    };

    if (dados.situacao === "Terreno cercado" || dados.situacao === "Terreno sem cercamento") {
        handleShowCaractUnidInfra(false);
    }

    return (
        <>
            <div
                className="section-header"
                onClick={() => setMostrarContatos(!mostrarContatos)}
                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', marginTop: '5px', borderRadius: '15px' }}
            >
                {ok ? "✅- 3. SITUAÇÃO E USO DA UNIDADE" : "3. SITUAÇÃO E USO DA UNIDADE"}
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
                    {mostrarContatos ? 'Esconder Formulário' : 'Mostrar Formulário'}
                </Button>
            </div>
            <Collapse in={mostrarContatos}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="situacao-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >Situação e Uso da Unidade</InputLabel>
                            <Select
                                labelId="situacao-label"
                                name="situacao"
                                value={dados.situacao}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">
                                    <em>Selecione uma opção</em>
                                </MenuItem>
                                <MenuItem value="Ocupado(Habitado)">Ocupado (Habitado)</MenuItem>
                                <MenuItem value="Em construção/(vazio)">Em construção (vazio)</MenuItem>
                                <MenuItem value="Em construção/(habitado)">Em construção (habitado)</MenuItem>
                                <MenuItem value="Em reforma/(vazio)">Em reforma (vazio)</MenuItem>
                                <MenuItem value="Em reforma/(habitado)">Em reforma (habitado)</MenuItem>
                                <MenuItem value="Terreno cercado">Terreno cercado</MenuItem>
                                <MenuItem value="Terreno sem cercamento">Terreno sem cercamento</MenuItem>
                                <MenuItem value="Não identificado">Não identificado</MenuItem>
                                <MenuItem value="Unidade vazia">Unidade vazia</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {dados.situacao !== "Não identificado" &&
                        dados.situacao !== "Terreno cercado" &&
                        dados.situacao !== "Terreno sem cercamento" && (
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="usoUnidade-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Uso da Unidade</InputLabel>
                                    <Select
                                        labelId="usoUnidade-label"
                                        name="uso"
                                        value={dados.uso}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione uma opção</em>
                                        </MenuItem>
                                        <MenuItem value="Residencial">Residencial</MenuItem>
                                        <MenuItem value="Comercial">Comercial</MenuItem>
                                        <MenuItem value="Uso Misto">Uso Misto</MenuItem>
                                        <MenuItem value="Institucional">Institucional</MenuItem>
                                        <MenuItem value="Serviço">Serviço</MenuItem>
                                        <MenuItem value="Industrial">Industrial</MenuItem>
                                        {mostrarUsoNaoIdentificado() && (
                                            <MenuItem value="Uso não Identificado">Uso não Identificado</MenuItem>
                                        )}
                                        <MenuItem value="Outros">Outros</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                    {(dados.situacao === "Terreno cercado" ||
                        dados.situacao === "Terreno sem cercamento") && (
                            <>
                                <Grid item xs={12} style={{ flexBasis: '100%' }} />
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Nome pessoa responsável pelo terreno"
                                        name="nomeResponsavel"
                                        value={dados.nomeResponsavel}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        disabled={dados.responsavelIdentificado}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="responsavelIdentificado"
                                                checked={dados.responsavelIdentificado}
                                                onChange={handleResponsavelCheckBoxChange}
                                            />
                                        }
                                        label="Responsável Não Identificado"
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Telefone da pessoa responsável"
                                        name="telefoneResponsavel"
                                        value={formatarTelefone(dados.telefoneResponsavel)}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        type='text'
                                        inputProps={{ maxLength: 15 }}
                                        disabled={dados.responsavelIdentificado}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Uso do Terreno"
                                        name="usoTerreno"
                                        value={dados.usoTerreno}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                            </>
                        )}
                    {dados.uso === "Outros" && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Descreva o uso da unidade"
                                name="usoNaoIdentificado"
                                value={dados.usoNaoIdentificado}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                    )}

                    {dados.uso !== "Residencial" && dados.uso !== "Outros" && dados.uso !== "Uso não Identificado" && dados.uso !== "" && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Detalhamento do Uso"
                                name="qualUso"
                                value={dados.qualUso}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                    )}
                    {dados.uso === "Uso Misto" && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Quais tipos?"
                                name="quaisTipos"
                                value={dados.quaisTipos}
                                onChange={handleChange}
                                fullWidth
                                required
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
            </Collapse >
        </>
    );
};

export default SituUsoUniForm;
