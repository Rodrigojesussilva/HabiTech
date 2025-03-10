import React, { useEffect, useState } from "react";
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Collapse,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { countries } from "countries-list";
import { estados, cidadesPorEstado } from "../estadosCidades";
import axios from "axios";
import { URLs } from "../../env";
import { formatCPF, isValidCPF } from "../validateCPF";
import InputMask from 'react-input-mask';
import { isValid, parse, isBefore, isAfter, differenceInYears } from 'date-fns';

type Estado = keyof typeof cidadesPorEstado;

interface IFormularioImigranteProps {
    id: string;
    paisOrigem?: string;
    documentacao?: string;
    numeroProtocolo?: string;
    numeroRnm?: string;
    statusRnm?: string;
    numeroCrnm?: string;
    statusCrnm?: string;
    numeroPassaporte?: string;
    uf?: string;
    cidade?: string;
    fonteRg?: string;
    rg?: string;
    orgaoExpedidor?: string;
    estadoEmissaoRg?: string;
    dataExpedicaoRg?: any;
    cpf?: string;
    fonteCpf?: string;
    arrolamento_id?: string;
    idLocal?: string;
}

const FormularioImigrante: React.FC<IFormularioImigranteProps> = ({
    id,
    arrolamento_id = id,
    paisOrigem,
    documentacao,
    numeroProtocolo,
    numeroRnm,
    statusRnm,
    numeroCrnm,
    statusCrnm,
    numeroPassaporte,
    uf,
    cidade,
    fonteRg,
    rg,
    orgaoExpedidor,
    estadoEmissaoRg,
    dataExpedicaoRg,
    cpf,
    fonteCpf,
    idLocal
}) => {
    const [dados, setDados] = useState({
        paisOrigem: paisOrigem ? paisOrigem : "Brazil",
        documentacao: documentacao ? documentacao : "",
        numeroProtocolo: numeroProtocolo ? numeroProtocolo : "",
        numeroRnm: numeroRnm ? numeroRnm : "",
        statusRnm: statusRnm ? statusRnm : "",
        numeroCrnm: numeroCrnm ? numeroCrnm : "",
        statusCrnm: statusCrnm ? statusCrnm : "",
        numeroPassaporte: numeroPassaporte ? numeroPassaporte : "",
        uf: uf ? uf : "",
        cidade: cidade ? cidade : "",
        fonteRg: fonteRg ? fonteRg : "",
        rg: rg ? rg : "",
        orgaoExpedidor: orgaoExpedidor ? orgaoExpedidor : "",
        estadoEmissaoRg: estadoEmissaoRg ? estadoEmissaoRg : "",
        dataExpedicaoRg: dataExpedicaoRg ? dataExpedicaoRg : "",
        cpf: cpf ? cpf : "",
        fonteCpf: fonteCpf ? fonteCpf : "",
        arrolamento_id: id,
        idLocal: idLocal ? idLocal : "not",
        tempoExpedicao: { anos: 0, meses: 0 },
        dataExpedicaoCpf: "",
        tempoExpedicaoCpf: { anos: 0, meses: 0 },
    });
    dados.arrolamento_id = id;
    const [naoAplica, setNaoAplica] = useState(false);
    const [ok, setOk] = useState(false);

    // Estados para mostrar ou ocultar campos
    const [mostrarDocumentacao, setMostrarDocumentacao] = useState(false);
    const [mostrarCamposProtocolo, setMostrarCamposProtocolo] = useState(false);
    const [mostrarCamposRNM, setMostrarCamposRNM] = useState(false);
    const [mostrarCamposCRNM, setMostrarCamposCRNM] = useState(false);
    const [mostrarCamposPassaporte, setMostrarCamposPassaporte] = useState(false);
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [errorCPF, setError] = useState(false);
    const [errorMessageDtExpRg, setErrorMessageDtExpRg] = useState('');
    const [errorMessageDtExpCpf, setErrorMessageDtExpCpf] = useState('');

    // Novos estados para Brasil
    const [mostrarCamposBrasil, setMostrarCamposBrasil] = useState(false);
    const [cidades, setCidades] = useState<string[]>([]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setDados((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "paisOrigem") {
            setMostrarDocumentacao(value !== "Brazil");
            setMostrarCamposBrasil(value === "Brazil");
            resetDocumentacao();
            if (value === "Brazil") {
                setCidades([]);
                setDados((prevState) => ({
                    ...prevState,
                    uf: "",
                    cidade: "",
                }));
            }
        }

        if (name === "documentacao") {
            handleDocumentacaoChange(value);
        }

        if (name === "uf") {
            setCidades(cidadesPorEstado[value as Estado] || []);
            setDados((prevState) => ({
                ...prevState,
                cidade: "",
            }));
        }

        

        if (name === "dataExpedicaoRg") {
            try {
                const objTempoExpedicao = calcularAnosMeses(value);
                const idade = localStorage.getItem('idade') as unknown as number

                if (dados.fonteRg === "RG") {
                    if (idade < 12) {
                        if (objTempoExpedicao.anos >= 5) {
                            throw new Error('A data de expedição não pode ser maior que 5 anos para menos de 12 anos.');
                        }
                    }
                    if (idade < 60) {
                        if (objTempoExpedicao.anos >= 10) {
                            throw new Error("A data de expedição não pode ser maior que 10 anos para pessoas entre 12 e 60 anos.");
                        }
                    }
                }
                setErrorMessageDtExpRg('');
                setDados((prevState) => ({
                    ...prevState,
                    [name]: value, // Atualiza a data no formato correto
                    tempoExpedicao: { anos: objTempoExpedicao.anos, meses: objTempoExpedicao.meses } // Atualiza os anos e meses calculados
                }));
            } catch (e: any) {
                setErrorMessageDtExpRg(e.message);
                setDados((prevState) => ({
                    ...prevState,
                    [name]: value, // Atualiza a data no formato correto
                    tempoExpedicao: { anos: 0, meses: 0 } // Atualiza os anos e meses calculados
                }));
            }
        }

        
        if (name === "dataExpedicaoCpf") {
            try {
                const objTempoExpedicao = calcularAnosMeses(value);
                const idade = localStorage.getItem('idade') as unknown as number
                if (dados.fonteCpf === "CIN") {
                    if (idade < 12) {
                        if (objTempoExpedicao.anos >= 5) {
                            throw new Error("A data de expedição não pode ser maior que 5 anos para menos de 12 anos.");
                        }
                    }
                    if (idade < 60) {
                        if (objTempoExpedicao.anos >= 10) {
                            throw new Error("A data de expedição não pode ser maior que 10 anos para pessoas entre 12 e 60 anos.");
                        }
                    }
                }
                setErrorMessageDtExpCpf('');
                setDados((prevState) => ({
                    ...prevState,
                    [name]: value, // Atualiza a data no formato correto
                    tempoExpedicaoCpf: { anos: objTempoExpedicao.anos, meses: objTempoExpedicao.meses } // Atualiza os anos e meses calculados
                }));
            } catch (e: any) {
                setErrorMessageDtExpCpf(e.message);
                setDados((prevState) => ({
                    ...prevState,
                    [name]: value, // Atualiza a data no formato correto
                    tempoExpedicaoCpf: { anos: 0, meses: 0 } // Atualiza os anos e meses calculados
                }));
            }
            
        }

        if (name === "cpf") {
            const formattedCPF = formatCPF(e.target.value);
            setDados({ ...dados, cpf: formattedCPF });

            // Valida o CPF somente se estiver completo
            if (formattedCPF.length === 14) {
                setError(!isValidCPF(formattedCPF));
            } else {
                setError(false); // Enquanto o CPF está incompleto, não exibe erro
            }
        }
    };


    const calcularAnosMeses = (dataExped: string) => {
        const hoje = new Date();
        const dataParse = parse(dataExped, 'dd/MM/yyyy', new Date());

        // Valida se a data é válida
        if (!isValid(dataParse)) {
            throw new Error('Data inválida. Por favor, use o formato DD/MM/AAAA.');
        }
        const expedicao = new Date(dataExped);

        // Valida se a data de expedição é maior que a data atual
        if (dataParse > hoje) {
            throw new Error('A data de expedição não pode ser maior que a data atual.');
        }

        let anos = hoje.getFullYear() - dataParse.getFullYear();
        let meses = hoje.getMonth() - dataParse.getMonth();

        if (meses < 0) {
            anos--;
            meses += 12;
        }

        return { anos, meses }; // Retorna anos e meses como um objeto
    };

    const resetDocumentacao = () => {
        setMostrarCamposProtocolo(false);
        setMostrarCamposRNM(false);
        setMostrarCamposCRNM(false);
        setMostrarCamposPassaporte(false);
        setDados((prevState) => ({
            ...prevState,
            documentacao: "",
            numeroProtocolo: "",
            numeroRNM: "",
            statusRNM: "",
            numeroCRNM: "",
            statusCRNM: "",
            numeroPassaporte: "",
        }));
    };

    const handleDocumentacaoChange = (doc: string) => {
        resetDocumentacao();
        switch (doc) {
            case "Protocolo":
                setDados((prevState) => ({
                    ...prevState,
                    documentacao: doc,
                }));
                setMostrarCamposProtocolo(true);
                break;
            case "RNM":
                setDados((prevState) => ({
                    ...prevState,
                    documentacao: doc,
                }));
                setMostrarCamposRNM(true);
                break;
            case "CRNM":
                setDados((prevState) => ({
                    ...prevState,
                    documentacao: doc,
                }));
                setMostrarCamposCRNM(true);
                break;
            case "Passaporte":
                setDados((prevState) => ({
                    ...prevState,
                    documentacao: doc,
                }));
                setMostrarCamposPassaporte(true);
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        if (dados.paisOrigem === "Brazil") {
            setMostrarCamposBrasil(true);
            setMostrarDocumentacao(false);
        } else {
            setMostrarCamposBrasil(false);
            setMostrarDocumentacao(true);
        }
    }, [dados.paisOrigem]);

    const countryList = Object.values(countries).map((country) => (
        <MenuItem key={country.name} value={country.name}>
            {country.name === "Brazil" ? "Brasil" : country.name}
        </MenuItem>
    ));

    const handleSave = async () => {
        if (errorCPF !== true) {
            try {
                if (dados.idLocal === "not") {

                    await axios.post(`${URLs.DEV}/formulario-imigrante-4-arrolamento/`, dados, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    alert('Dados salvos com sucesso!');
                    setMostrarIdentificacao(!mostrarIdentificacao);
                    setOk(!ok);
                } else {
                    await axios.put(`${URLs.DEV}/formulario-imigrante-4-arrolamento/${dados.idLocal}`, dados, {
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
        } else {
            alert("Cpf inválido")
        }
    };

    return (
        <>
            <div
                className="section-header"
                onClick={() => setMostrarIdentificacao(!mostrarIdentificacao)}
                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', borderRadius: '15px' }}
            >
                {ok ? "✅- 3. DOCUMENTAÇÃO DA PESSOA RESPONSÁVEL" : "3. DOCUMENTAÇÃO  DA PESSOA RESPONSÁVEL"}
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
                    {/* Campo País de Origem */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="paisOrigem-label" sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >
                                País de Origem</InputLabel>
                            <Select
                                labelId="paisOrigem-label"
                                name="paisOrigem"
                                value={dados.paisOrigem}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">
                                    <em>Selecione um país</em>
                                </MenuItem>
                                {countryList}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Campos específicos para o Brasil */}
                    {mostrarCamposBrasil && (
                        <>
                            {/* Campo UF */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="uf-label" sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >
                                        Estado (UF)</InputLabel>
                                    <Select
                                        labelId="uf-label"
                                        name="uf"
                                        value={dados.uf}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione um estado</em>
                                        </MenuItem>
                                        {estados.map((estado: any) => (
                                            <MenuItem key={estado.sigla} value={estado.sigla}>
                                                {estado.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Campo Cidade */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="cidade-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Cidade</InputLabel>
                                    <Select
                                        labelId="cidade-label"
                                        name="cidade"
                                        value={dados.cidade}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione uma cidade</em>
                                        </MenuItem>
                                        {cidades.map((cidade) => (
                                            <MenuItem key={cidade} value={cidade}>
                                                {cidade}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Campo Fonte para RG */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="fonteRG-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Fonte para RG</InputLabel>
                                    <Select
                                        labelId="fonteRG-label"
                                        name="fonteRg"
                                        value={dados.fonteRg}
                                        onChange={handleChange}
                                        disabled={naoAplica}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione uma fonte</em>
                                        </MenuItem>
                                        <MenuItem value="CNH">CNH</MenuItem>
                                        <MenuItem value="RG">RG</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Campo RG */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Número do RG"
                                    name="rg"
                                    value={dados.rg}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled={naoAplica}
                                    required
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="naoSeAplica"
                                            checked={naoAplica}
                                            onChange={(e) => {
                                                if (naoAplica === true) {
                                                    setNaoAplica(false)
                                                }
                                                if (e.target.checked) {
                                                    setNaoAplica(true);
                                                    setDados(prevState => ({
                                                        ...prevState,
                                                        fonteRg: '',
                                                        rg: '',
                                                    }));
                                                }
                                            }}
                                        />
                                    }
                                    label="Não se aplica"
                                />
                            </Grid>

                            {/* Campo Órgão Expedidor RG */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Órgão Expedidor"
                                    name="orgaoExpedidor"
                                    value={dados.orgaoExpedidor}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* Campo Estado de Emissão do RG */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="estadoEmissaoRG-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Estado de Emissão do RG</InputLabel>
                                    <Select
                                        labelId="estadoEmissaoRG-label"
                                        name="estadoEmissaoRg"
                                        value={dados.estadoEmissaoRg}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione um estado</em>
                                        </MenuItem>
                                        {estados.map((estado: any) => (
                                            <MenuItem key={estado.sigla} value={estado.sigla}>
                                                {estado.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Campo Data de Expedição */}
                            <Grid item xs={12} sm={6}>
                                <InputMask
                                    mask="99/99/9999"
                                    value={dados.dataExpedicaoRg}
                                    onChange={handleChange}
                                >
                                    {(inputProps: any) => (
                                        <TextField
                                            {...inputProps}
                                            label="Data de Expedição"
                                            type="text"
                                            name="dataExpedicaoRg"
                                            InputLabelProps={{
                                                shrink: true, // Garante que o label esteja sempre acima do campo
                                            }}
                                            placeholder="DD/MM/AAAA" // Exibe um placeholder no formato desejado
                                            fullWidth
                                            required
                                            helperText={errorMessageDtExpRg}
                                        />
                                    )}
                                </InputMask>
                                {errorMessageDtExpRg === '' && (
                                    <span>Tempo do RG: {dados.tempoExpedicao.anos} anos e {dados.tempoExpedicao.meses} meses.</span>
                                )}
                            </Grid>
                            {/* Campo CPF */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="CPF"
                                    name="cpf"
                                    value={dados.cpf}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    helperText={errorCPF ? "CPF inválido" : "Formato: 123.456.789-09"}
                                    error={errorCPF}
                                />
                            </Grid>
                            {/* Campo Fonte para CPF */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="fonteCPF-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Fonte para CPF</InputLabel>
                                    <Select
                                        labelId="fonteCPF-label"
                                        name="fonteCpf"
                                        value={dados.fonteCpf}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione uma fonte</em>
                                        </MenuItem>
                                        <MenuItem value="CNH">CNH</MenuItem>
                                        <MenuItem value="RG">RG</MenuItem>
                                        <MenuItem value="Receita Federal">Receita Federal</MenuItem>
                                        <MenuItem value="CIN">CIN - Carteira de Identidade Nacional</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Campo Data de Expedição */}
                            <Grid item xs={12} sm={6}>
                                <InputMask
                                    mask="99/99/9999"
                                    value={dados.dataExpedicaoCpf}
                                    onChange={handleChange}
                                >
                                    {(inputProps: any) => (
                                        <TextField
                                            {...inputProps}
                                            label="Data de Expedição CPF"
                                            type="text"
                                            name="dataExpedicaoCpf"
                                            InputLabelProps={{
                                                shrink: true, // Garante que o label esteja sempre acima do campo
                                            }}
                                            placeholder="DD/MM/AAAA" // Exibe um placeholder no formato desejado
                                            fullWidth
                                            required
                                            helperText={errorMessageDtExpCpf}
                                        />
                                    )}
                                </InputMask>
                                {errorMessageDtExpCpf === '' && (
                                    <span>Tempo do CPF: {dados.tempoExpedicaoCpf.anos} anos e {dados.tempoExpedicaoCpf.meses} meses.</span>
                                )}
                            </Grid>
                        </>
                    )}

                    {/* Campo de Documentação */}
                    {mostrarDocumentacao && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="documentacao-label"
                                    sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                >Tipo de Documentação</InputLabel>
                                <Select
                                    labelId="documentacao-label"
                                    name="documentacao"
                                    value={dados.documentacao}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Selecione um tipo</em>
                                    </MenuItem>
                                    <MenuItem value="Protocolo">Número de Protocolo de Registro Nacional Migratório (documento expedido pela polícia federal)</MenuItem>
                                    <MenuItem value="RNM">Registro Nacional Migratório (RNM)</MenuItem>
                                    <MenuItem value="CRNM">Carteira de Registro Nacional Migratório (CRNM)</MenuItem>
                                    <MenuItem value="Passaporte">Passaporte</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {/* Campos de entrada para a documentação */}
                    {mostrarCamposProtocolo && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Número do Protocolo"
                                    name="numeroProtocolo"
                                    value={dados.numeroProtocolo}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </>
                    )}

                    {mostrarCamposRNM && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Número do RNM"
                                    name="numeroRnm"
                                    value={dados.numeroRnm}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="statusRNM-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Status do RNM</InputLabel>
                                    <Select
                                        labelId="statusRNM-label"
                                        name="statusRnm"
                                        value={dados.statusRnm}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione um status</em>
                                        </MenuItem>
                                        <MenuItem value="Permanente">Permanente </MenuItem>
                                        <MenuItem value="Temporário">Temporário</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    )}

                    {mostrarCamposCRNM && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Número do CRNM"
                                    name="numeroCrnm"
                                    value={dados.numeroCrnm}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="statusCRNM-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Status do CRNM</InputLabel>
                                    <Select
                                        labelId="statusCRNM-label"
                                        name="statusCrnm"
                                        value={dados.statusCrnm}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>Selecione um status</em>
                                        </MenuItem>
                                        <MenuItem value="Permanente">Permanente </MenuItem>
                                        <MenuItem value="Temporário">Temporário</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    )}

                    {mostrarCamposPassaporte && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Número do Passaporte"
                                    name="numeroPassaporte"
                                    value={dados.numeroPassaporte}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </>
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

export default FormularioImigrante;
