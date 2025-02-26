/* eslint-disable no-self-assign */
import { Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Collapse } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface IdentRespFormProps {
    id: string;
    responsavel?: string;
    nomeCompleto?: string;
    nomeSocial?: string;
    dataNascimento?: string;
    naoSeAplica?: boolean;
    relacaoResponsavel?: string;
    idade?: any;
    DescrevParentesco?: string;
    arrolamento_id?: string;
    idLocal?: string;
}

const IdentRespFormEDIT: React.FC<IdentRespFormProps> = ({
    id,
    responsavel,
    nomeCompleto,
    nomeSocial,
    dataNascimento,
    naoSeAplica,
    relacaoResponsavel,
    idade,
    DescrevParentesco,
    arrolamento_id = id, // O id padrão é o arrolamento_id
    idLocal
}) => {
    const [dados, setDados] = useState({
        responsavel: responsavel ? responsavel : '',
        nomeCompleto: nomeCompleto ? nomeCompleto : '',
        nomeSocial: nomeSocial ? nomeSocial : '',
        dataNascimento: dataNascimento ? dataNascimento : '',
        naoSeAplica: naoSeAplica ? naoSeAplica : false,
        relacaoResponsavel: relacaoResponsavel ? relacaoResponsavel : '',
        idade: idade ? idade : 0,
        DescrevParentesco: DescrevParentesco ? DescrevParentesco : '',
        arrolamento_id: id,
        idLocal: idLocal ? idLocal : "not",
    });
    dados.arrolamento_id = id;
    const [ok, setOk] = useState(false);
    // useEffect(() => {
    //     calcularIdade(dataNascimento ? dataNascimento : "")
    // }, [dataNascimento])
        localStorage.setItem('idade', JSON.stringify(idade));

    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        if (name === "dataNascimento") {
            const idadeCalculada = calcularIdade(value);

            if (idadeCalculada >= 0) {
                setDados((prevState) => ({
                    ...prevState,
                    [name]: value,
                    idade: idadeCalculada,
                }));
            }
        } else {
            setDados((prevState) => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const calcularIdade = (dataNascimento: string | number | Date) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);

        // Valida se a data de nascimento é maior que a data atual
        if (nascimento > hoje) {
            alert("A data de nascimento não pode ser maior que a data atual.");
            return 99999; // Retorna 0 para idades inválidas
        }

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        localStorage.setItem('idade', JSON.stringify(idade));

        return idade < 0 ? 0 : idade; // Garante que a idade nunca seja negativa
    };

    const handleSave = async () => {
        try {
            console.log(localStorage.getItem('idade AKI???'));

            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/ident-resp-1-arrolamento/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
            } else {
                await axios.put(`${URLs.DEV}/ident-resp-1-arrolamento/${dados.idLocal}`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados editados com sucesso!');
                setMostrarIdentificacao(!mostrarIdentificacao)
                setOk(!ok)
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
                {ok ? "✅- 1. IDENTIFICAÇÃO DA(O) RESPONSÁVEL" : "1. IDENTIFICAÇÃO DA(O) RESPONSÁVEL"}
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
                    <Grid container spacing={2} item xs={12} sm={6}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel id="responsavel-label"
                                    sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                >
                                    Você é a pessoa responsável da unidade residencial?
                                </InputLabel>
                                <Select
                                    labelId="responsavel-label"
                                    name="responsavel"
                                    value={dados.responsavel}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Selecione uma opção</em>
                                    </MenuItem>
                                    <MenuItem value="sim">Sim</MenuItem>
                                    <MenuItem value="nao">Não</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} visibility={dados.responsavel === "nao" ? "visible" : "collapse"}>
                        <FormControl fullWidth required>
                            <InputLabel id="relacaoResponsavel-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >
                                Qual a sua relação de parentesco com a pessoa responsável?
                            </InputLabel>
                            <Select
                                labelId="relacaoResponsavel-label"
                                name="relacaoResponsavel"
                                value={dados.relacaoResponsavel}
                                onChange={handleChange}
                                required
                            >
                                {dados.responsavel === "nao" ? dados.relacaoResponsavel = dados.relacaoResponsavel : dados.relacaoResponsavel = ''}
                                <MenuItem value="">
                                    <em>Selecione uma opção</em>
                                </MenuItem>
                                <MenuItem value="conjuge_campanheiro">Conjugê/Campanheiro</MenuItem>
                                <MenuItem value="filho">Filho</MenuItem>
                                <MenuItem value="filha">Filha</MenuItem>
                                <MenuItem value="enteado">Enteado</MenuItem>
                                <MenuItem value="enteada">Enteada</MenuItem>
                                <MenuItem value="irmao">Irmão</MenuItem>
                                <MenuItem value="irma">Irmã</MenuItem>
                                <MenuItem value="pai">Pai</MenuItem>
                                <MenuItem value="mae">Mãe</MenuItem>
                                <MenuItem value="sogra">Sogra</MenuItem>
                                <MenuItem value="sogro">Sogro</MenuItem>
                                <MenuItem value="neta">Neta</MenuItem>
                                <MenuItem value="neto">Neto</MenuItem>
                                <MenuItem value="genro">Genro</MenuItem>
                                <MenuItem value="madrasta">Madrasta</MenuItem>
                                <MenuItem value="padrasto">Padrasto</MenuItem>
                                <MenuItem value="bisneta">Bisneta</MenuItem>
                                <MenuItem value="bisneto">Bisneto</MenuItem>
                                <MenuItem value="sobrinha">Sobrinha</MenuItem>
                                <MenuItem value="sobrinho">Sobrinho</MenuItem>
                                <MenuItem value="sem_parentesco">Sem Relação de Parentesco</MenuItem>
                                <MenuItem value="nsi">Não Sabe Informar</MenuItem>
                                <MenuItem value="outro">Outra Relação de Parentesco</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nome completo do responsável"
                            name="nomeCompleto"
                            value={dados.nomeCompleto}
                            onChange={handleChange}
                            // className="form-field"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} visibility={dados.relacaoResponsavel === "outro" ? "visible" : "collapse"}>
                        <TextField
                            label="Descreva a relação de parentensco"
                            name="DescrevParentesco"
                            value={dados.DescrevParentesco}
                            onChange={handleChange}
                            // className="form-field"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nome Social"
                            name="nomeSocial"
                            value={dados.nomeSocial}
                            onChange={handleChange}
                            disabled={dados.naoSeAplica} // Desabilita o campo se o checkbox estiver marcado
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="naoSeAplica"
                                    checked={dados.naoSeAplica}
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (e.target.checked) {
                                            setDados(prevState => ({
                                                ...prevState,
                                                nomeSocial: '',
                                            }));
                                        }
                                    }}
                                />
                            }
                            label="Não se aplica"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Data de Nascimento"
                            type="date"
                            name="dataNascimento"
                            value={dados.dataNascimento}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true, // Garante que o label esteja sempre acima do campo
                            }}
                            fullWidth
                            required
                        />
                        <Grid item xs={12}>
                            {dados.idade !== 99999 ? (
                                <p>Idade: {dados.idade} anos</p>
                            ) : (
                                <p style={{ color: 'red' }}>Por favor, insira uma data de nascimento válida.</p>
                            )}
                        </Grid>
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

export default IdentRespFormEDIT;