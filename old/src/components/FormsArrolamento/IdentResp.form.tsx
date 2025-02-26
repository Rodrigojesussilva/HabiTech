/* eslint-disable no-self-assign */
import { Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Collapse } from "@mui/material";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { URLs } from "../../env";
import InputMask from 'react-input-mask';
import { isValid, parse, isBefore, isAfter, differenceInYears } from 'date-fns';


interface IdentRespFormProps {
    id: string;
    responsavel?: string;
    nomeCompleto?: string;
    nomeSocial?: string;
    dataNascimento?: string;
    naoSeAplica?: boolean;
    relacaoResponsavel?: string;
    nomeCompletoEntrevistado?: string;
    nomeSocialEntrevistado?: string;
    naoSeAplicaEntrevistado?: boolean;
    idade?: any;
    DescrevParentesco?: string;
    arrolamento_id?: string;
    idLocal?: string;
    handleShowSectsResp: (show: boolean) => void;
}
const IdentRespForm: React.FC<IdentRespFormProps> = ({
    id,
    responsavel,
    nomeCompleto,
    nomeSocial,
    dataNascimento,
    naoSeAplica,
    relacaoResponsavel,
    nomeCompletoEntrevistado,
    nomeSocialEntrevistado,
    naoSeAplicaEntrevistado,
    idade,
    DescrevParentesco,
    arrolamento_id = id, // O id padrão é o arrolamento_id
    idLocal,
    handleShowSectsResp,
}) => {
    const [dados, setDados] = useState({
        responsavel: responsavel ? responsavel : '',
        nomeCompleto: nomeCompleto ? nomeCompleto : '',
        nomeSocial: nomeSocial ? nomeSocial : '',
        dataNascimento: dataNascimento ? dataNascimento : '',
        naoSeAplica: naoSeAplica ? naoSeAplica : false,
        relacaoResponsavel: relacaoResponsavel ? relacaoResponsavel : '',
        nomeCompletoEntrevistado: nomeCompletoEntrevistado ? nomeCompletoEntrevistado : '',
        nomeSocialEntrevistado: nomeSocialEntrevistado ? nomeSocialEntrevistado : '',
        naoSeAplicaEntrevistado: naoSeAplicaEntrevistado ? naoSeAplicaEntrevistado : false,
        idade: idade ? idade : 0,
        DescrevParentesco: DescrevParentesco ? DescrevParentesco : '',
        arrolamento_id: id,
        idLocal: idLocal ? idLocal : "not",
    });
    dados.arrolamento_id = id;
    const [ok, setOk] = useState(false);
    const [errorBirthDate, setErrorBirthDate] = useState('Digite a data no formato DD/MM/AAAA');

    useEffect(() => {
        localStorage.setItem('idade', JSON.stringify(idade));
        if (dados.responsavel === 'nao') {
            handleShowSectsResp(false);
        }
    }, [idade, dados.responsavel]);

    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        if (name === "responsavel") {
            if (value === "nao") {
                handleShowSectsResp(false);
            } else {
                handleShowSectsResp(true);
            }
        }

        if (name === "dataNascimento") {
            let idadeCalculada = 0;
            try {
                idadeCalculada = calcularIdade(value);
                setErrorBirthDate("");
            }
            catch (error:any) {
                setErrorBirthDate(error.message);
            }
            if (idadeCalculada >= 0) {
                setDados((prevState) => ({
                    ...prevState,
                    idade: idadeCalculada,
                }));
            }
            setDados((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            setDados((prevState) => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };


    const calcularIdade = (dataNascimento: string) => {
        const dataParse = parse(dataNascimento, 'dd/MM/yyyy', new Date());

        // Valida se a data é válida
        if (!isValid(dataParse)) {
            throw new Error('Data inválida. Por favor, use o formato DD/MM/AAAA.');
        }

        const hoje = new Date();

        let idade = 0;
        // Verifica se a data de nascimento é maior que a data atual
        if (isBefore(dataParse, hoje)) {
            idade = differenceInYears(new Date(), dataParse);
            localStorage.setItem('idade', JSON.stringify(idade));
        } else if (isAfter(dataParse, hoje)) {
            throw new Error('Data inválida. Por favor informe uma data anterior a atual.');
        } else { // data informada é igual a data atual
            throw new Error('Data inválida. Por favor informe uma data anterior a atual.');
        }

        return idade; 
    };

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/ident-resp-1-arrolamento/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
                setMostrarIdentificacao(!mostrarIdentificacao)
                setOk(!ok)
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
                    {dados.responsavel === "nao" && (
                        <>
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
                                    label="Nome Completo da Pessoa Entrevistada"
                                    name="nomeCompletoEntrevistado"
                                    value={dados.nomeCompletoEntrevistado}
                                    onChange={handleChange}
                                    // className="form-field"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nome Social Pessoa Entrevistada"
                                    name="nomeSocialEntrevistado"
                                    value={dados.nomeSocialEntrevistado}
                                    onChange={handleChange}
                                    disabled={dados.naoSeAplicaEntrevistado} // Desabilita o campo se o checkbox estiver marcado
                                    fullWidth
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="naoSeAplicaEntrevistado"
                                            checked={dados.naoSeAplicaEntrevistado}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (e.target.checked) {
                                                    setDados(prevState => ({
                                                        ...prevState,
                                                        nomeSocialEntrevistado: '',
                                                    }));
                                                }
                                            }}
                                        />
                                    }
                                    label="Não se aplica"
                                />
                            </Grid>

                        </>
                    )}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nome Completo do Responsável"
                            name="nomeCompleto"
                            value={dados.nomeCompleto}
                            onChange={handleChange}
                            // className="form-field"
                            fullWidth
                            required
                        />
                    </Grid>
                    {dados.relacaoResponsavel === "outro" && (
                        <Grid item xs={12} sm={6} visibility={dados.relacaoResponsavel === "outro" ? "visible" : "collapse"}>
                            <TextField
                                label="Descreva a Relação de Parentesco"
                                name="DescrevParentesco"
                                value={dados.DescrevParentesco}
                                onChange={handleChange}
                                // className="form-field"
                                fullWidth
                                required
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nome Social Responsável"
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
                        <InputMask
                            mask="99/99/9999"
                            value={dados.dataNascimento}
                            onChange={handleChange}
                        >
                            {(inputProps: any) => (

                                <TextField
                                    {...inputProps}
                                    label="Data de Nascimento"
                                    type="text"
                                    name="dataNascimento"
                                    InputLabelProps={{
                                        shrink: true, // Garante que o label esteja sempre acima do campo
                                    }}
                                    placeholder="DD/MM/AAAA" // Exibe um placeholder no formato desejado
                                    fullWidth
                                    required
                                    helperText={errorBirthDate}
                                />
                            )}
                        </InputMask>
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
            </Collapse >
        </>
    );
};

export default IdentRespForm;