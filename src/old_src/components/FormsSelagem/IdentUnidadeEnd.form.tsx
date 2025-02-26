import { Button, Grid, Collapse, TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, FormControlLabel, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { estados, cidadesPorEstado } from "../estadosCidades";
import { distritosPorSubprefeitura } from "./distritosPorSubPref";
import { subprefeituras } from "./subPrefeituras";
import axios from "axios";
import { URLs } from "../../env";

type Estado = keyof typeof cidadesPorEstado;

interface IdentUnidadeEndFormProps {
    id: string;
    selagem_id?: string;
    idLocal?: string;
    cep?: string
    logradouro?: string
    numero?: string
    bairro?: string
    complemento?: string
    uf?: string
    cidade?: string
    subprefeitura?: string
    distrito?: string
}

const IdentUnidadeEndForm: React.FC<IdentUnidadeEndFormProps> = ({
    id,
    bairro,
    cep,
    cidade,
    complemento,
    distrito,
    idLocal,
    logradouro,
    numero,
    selagem_id,
    subprefeitura,
    uf
}) => {
    const [naoAplica, setNaoAplica] = useState(false);
    const [dados, setDados] = useState({
        cep: cep ? cep : '',
        logradouro: logradouro ? logradouro : '',
        numero: numero ? numero : '',
        bairro: bairro ? bairro : '',
        complemento: complemento ? complemento : '',
        uf: uf ? uf : 'SP', // Inicializando com SP
        cidade: cidade ? cidade : 'São Paulo', // Inicializando com São Paulo
        subprefeitura: subprefeitura ? subprefeitura : '',
        distrito: distrito ? distrito : '',
        selagem_id: id,
        idLocal: idLocal ? idLocal : "not",
    });
    dados.selagem_id = id;
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [cidades, setCidades] = useState<string[]>([]); // Cidades filtradas por UF
    const [distritos, setDistritos] = useState<string[]>([]); // Distritos filtrados por Subprefeitura
    const [ok, setOk] = useState(false);

    // Atualiza os dados do formulário
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setDados({ ...dados, [name]: value });

        if (name === "cep") {
            buscarEndereco(value);
        }

        if (name === "uf") {
            setCidades(cidadesPorEstado[value as Estado] || []);
            setDados((prevState) => ({
                ...prevState,
                cidade: "",
            }));
        }
        if (name === 'subprefeitura') {
            const subprefeitura = value as keyof typeof distritosPorSubprefeitura['subprefeituras'];
            setDistritos(distritosPorSubprefeitura.subprefeituras[subprefeitura] || []);
            //seleciona distrito automaticamente quando houver apenas um distrito
            if (distritosPorSubprefeitura.subprefeituras[subprefeitura].length === 1) {
                setDados((prevDados) => {
                    return {
                        ...prevDados,
                        distrito: distritosPorSubprefeitura.subprefeituras[subprefeitura][0]
                    }
                } )
            } else {
                setDados((prevDados) => {
                    return {
                        ...prevDados,
                        distrito: ''
                    }
                } )
            }
        }
    };

    useEffect(() => {
        setCidades(cidadesPorEstado[dados.uf as Estado] || []);
    }, [dados.uf]);

    const buscarEndereco = async (cep: string) => {
        // Remove caracteres não numéricos
        const cepFormatado = cep.replace(/\D/g, '');

        if (cepFormatado.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setDados((prevState) => ({
                        ...prevState,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        uf: data.uf,
                        cidade: data.localidade,
                    }));
                    // Atualiza as cidades baseadas na UF
                    setCidades(cidadesPorEstado[data.uf as Estado] || []);
                } else {
                    alert('CEP não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar endereço:', error);
                alert('Erro ao buscar endereço. Tente novamente.');
            }
        }
    };

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/ident-uni-end-2-selagem/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
                setMostrarIdentificacao(!mostrarIdentificacao);
                setOk(!ok);
            } else {
                await axios.put(`${URLs.DEV}/ident-uni-end-2-selagem/${dados.idLocal}`, dados, {
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
                {ok ? "✅- 2. IDENTIFICAÇÃO DA UNIDADE" : "2. IDENTIFICAÇÃO DA UNIDADE"}
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
                    {/* Campo CEP */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="CEP"
                            name="cep"
                            value={dados.cep}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ maxLength: 9 }}
                            disabled={naoAplica}
                            helperText="Formato: 03025-000"
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
                                                cep: '',
                                            }));
                                        }
                                    }}
                                />
                            }
                            label="Não se aplica"
                        />
                    </Grid>

                    {/* Campo Logradouro */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Logradouro"
                            name="logradouro"
                            value={dados.logradouro}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    {/* Campo Número */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Número"
                            name="numero"
                            value={dados.numero}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    {/* Campo Bairro */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Bairro"
                            name="bairro"
                            value={dados.bairro}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    {/* Campo Complemento */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Complemento"
                            name="complemento"
                            value={dados.complemento}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    {/* Campo UF */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="UF"
                            name="uf"
                            value={dados.uf}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {estados.map((estado: any) => (
                                <MenuItem key={estado.sigla} value={estado.sigla}>
                                    {estado.nome}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Campo Cidade */}
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            freeSolo
                            options={cidades}
                            value={dados.cidade}
                            onChange={handleChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cidade"
                                    fullWidth
                                    onFocus={(e) => e.target.select()} // Abre o teclado ao focar
                                    InputProps={{
                                        ...params.InputProps,
                                        type: "text",
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    {/* Campo Subprefeitura */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Subprefeitura"
                            name="subprefeitura"
                            value={dados.subprefeitura}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {subprefeituras.subprefeituras.map((sub) => (
                                <MenuItem key={sub} value={sub}>
                                    {sub}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Campo Distrito */}
                    <Grid item xs={12} sm={6}>
                        {dados.distrito ? (
                            // Exibe o campo de texto quando há um valor em dados.distrito
                            <TextField
                                label="Distrito"
                                name="distrito"
                                value={dados.distrito}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={!dados.subprefeitura}
                            />
                        ) : (
                            // Exibe o campo de seleção quando dados.distrito está vazio
                            <TextField
                                select
                                label="Distrito"
                                name="distrito"
                                value={dados.distrito}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={!dados.subprefeitura}
                            >
                                {distritos.map((distrito) => (
                                    <MenuItem key={distrito} value={distrito}>
                                        {distrito}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
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

export default IdentUnidadeEndForm;
