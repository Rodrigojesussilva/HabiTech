import { Button, FormControl, Grid, InputLabel, FormHelperText, Typography, Box, MenuItem, Select, TextField, Collapse, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";
import { formatCurrency } from "../formatReal";
interface SituUsoUniFormProps {
    id: string;
    idLocal?: string,
    arrolamento_id?: string
    regime_ocupacao?: string
    valor_locacao?: string
    nsi_valor_locacao?: boolean
    contrato_locacao?: string
    nome_proprietario?: string
    contato_proprietario?: string
    cozinhaCompartilhada?: string
    banheiroCompartilhado?: string
    separaResiduos?: string
    destinoReciclavel?: string[]
    outroDestinoReciclavel?: string
    destinoOrganico?: string[]
    outroDestinoOrganico?: string
    destinoDomestico?: string[]
    outroDestinoDomestico?: string
    nsi_contato_proprietario?: boolean
}


const SituUsoUniForm: React.FC<SituUsoUniFormProps> = ({
    id,
    idLocal,
    arrolamento_id = id,
    contato_proprietario,
    contrato_locacao,
    nome_proprietario,
    nsi_contato_proprietario,
    nsi_valor_locacao,
    regime_ocupacao,
    cozinhaCompartilhada,
    banheiroCompartilhado,
    separaResiduos,
    destinoReciclavel,
    outroDestinoReciclavel,
    destinoOrganico,
    outroDestinoOrganico,
    destinoDomestico,
    outroDestinoDomestico,
    valor_locacao
}) => {
    const [regimeOcupacao, setRegimeOcupacao] = useState(regime_ocupacao ? regime_ocupacao : '');
    const [dados, setDados] = useState({
        regime_ocupacao: '',
        valor_locacao: valor_locacao ? valor_locacao : '',
        nsi_valor_locacao: nsi_valor_locacao ? nsi_valor_locacao : false,
        contrato_locacao: contrato_locacao ? contrato_locacao : '',
        nome_proprietario: nome_proprietario ? nome_proprietario : '',
        contato_proprietario: contato_proprietario ? contato_proprietario : '',
        nsi_contato_proprietario: nsi_contato_proprietario ? nsi_contato_proprietario : false,
        cozinhaCompartilhada: cozinhaCompartilhada ? cozinhaCompartilhada : '',
        banheiroCompartilhado: banheiroCompartilhado ? banheiroCompartilhado : '',
        separaResiduos: separaResiduos ? separaResiduos : '',
        destinoReciclavel: destinoReciclavel ? destinoReciclavel : [],
        outroDestinoReciclavel: outroDestinoReciclavel ? outroDestinoReciclavel : '',
        destinoOrganico: destinoOrganico ? destinoOrganico : [],
        outroDestinoOrganico: outroDestinoOrganico ? outroDestinoOrganico : '',
        destinoDomestico: destinoDomestico ? destinoDomestico : [],
        outroDestinoDomestico: outroDestinoDomestico ? outroDestinoDomestico : '',

        tempoMoradiaAnos: '',
        tempoMoradiaMeses: '',
        tempoMoradiaNaoSabe: false,

        naoSabeContratoLocacao: false,
        idLocal: idLocal ? idLocal : "not",
        arrolamento_id: id,
        documentoComprovacao: '',
        descricaoDocumento: '',
        telefone_proprietario_cedida: '',
        nome_proprietario_cedida: ''
    });
    const [ok, setOk] = useState(false);
    dados.arrolamento_id = id;
    const [mostrarContatos, setMostrarContatos] = useState(false);
    const handleSave = async () => {
        dados.regime_ocupacao = regimeOcupacao;
        try {
            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/situ-uso-uni-3-arrolamento/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
                setMostrarContatos(!mostrarContatos);
                setOk(!ok)
            } else {
                await axios.put(`${URLs.DEV}/situ-uso-uni-3-arrolamento/${dados.idLocal}`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados editados com sucesso!');
                setMostrarContatos(!mostrarContatos);
                setOk(!ok)
            }
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
            alert('Erro ao salvar os dados');
        }
    };

    const handleChangeRegime = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegimeOcupacao(event.target.value);
        setDados({
            valor_locacao: '',
            contrato_locacao: '',
            nome_proprietario: '',
            contato_proprietario: '',
            nsi_valor_locacao: false,
            naoSabeContratoLocacao: false,
            cozinhaCompartilhada: '',
            banheiroCompartilhado: '',
            separaResiduos: '',
            destinoReciclavel: [],
            outroDestinoReciclavel: '',
            destinoOrganico: [],
            outroDestinoOrganico: '',
            destinoDomestico: [],
            outroDestinoDomestico: '',
            nsi_contato_proprietario: false,
            arrolamento_id: '',
            idLocal: idLocal ? idLocal : "not",
            regime_ocupacao: '',
            documentoComprovacao: '',
            descricaoDocumento: '',
            telefone_proprietario_cedida: '',
            nome_proprietario_cedida: '',
            tempoMoradiaAnos: '',
            tempoMoradiaMeses: '',
            tempoMoradiaNaoSabe: false,
        });
    };

    const handleChangeValorAluguel = (event: React.ChangeEvent<HTMLInputElement>) => {

        const formattedValue = formatCurrency(event.target.value);
        setDados({ ...dados, valor_locacao: formattedValue });

    };
    const handleChangeValorAluguel_ = (value: string | undefined) => {

        console.log('Valor digitado:', value); // Exibe o valor bruto (ex: "30000")
        //const rawValue = value.replace(/\D/g, '').replace(/^0+/, '') || '0';
        setDados((prev) => ({
            ...prev,
            valor_locacao: value || '', // Atualiza o estado com o valor bruto
        }));

    };

    const handleChange = (event: any) => {
        const { name, value } = event.target;

        if (name === "valor_locacao") {
            const rawValue = value.replace(/\D/g, '').replace(/^0+/, '') || '0';
            setDados((prev) => ({
                ...prev,
                [name]: rawValue,
            }));
        } else {
            setDados((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setDados((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleTempoMoradiaNaoSabeChange = (event: any) => {
        const { name, value, type, checked } = event.target;
        if (name === 'tempoMoradiaNaoSabe' && dados.tempoMoradiaNaoSabe === false) {
            dados.tempoMoradiaAnos = ''
            dados.tempoMoradiaMeses = ''
        }
        setDados((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

   
    return (
        <>
            <div
                className="section-header"
                onClick={() => setMostrarContatos(!mostrarContatos)}
                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', marginTop: '5px', borderRadius: '15px' }}
            >
                {ok ? "✅-  4. SITUAÇÃO E USO DA UNIDADE" : "4. SITUAÇÃO E USO DA UNIDADE"}
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
                    <Grid item xs={12}>
                        <FormLabel component="legend">Regime de Ocupação da Unidade</FormLabel>
                        <FormControl component="fieldset" fullWidth>
                            {/* <FormLabel component="legend">Regime de Ocupação da Unidade</FormLabel> */}
                            <RadioGroup name="regimeOcupacao" value={regimeOcupacao} onChange={handleChangeRegime}>
                                <FormControlLabel value="alugada" control={<Radio />} label="Alugada" />
                                <FormControlLabel value="cedida" control={<Radio />} label="Cedida (Emprestada)" />
                                <FormControlLabel value="ocupada" control={<Radio />} label="Ocupada" />
                                <FormControlLabel value="propria" control={<Radio />} label="Própria" />
                                <FormControlLabel value="naoSabeInformar" control={<Radio />} label="Não sabe informar" />
                            </RadioGroup>
                        </FormControl>
                        <Grid item xs={12} sm={12} >
                            <Box height={20} />
                        </Grid>

                        {regimeOcupacao === 'alugada' && (
                            <Collapse in={regimeOcupacao === 'alugada'}>
                                <Grid container spacing={3}>
                                    {/* Valor do aluguel */}
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Informe o valor do aluguel"
                                            name="valorAluguel"
                                            value={dados.valor_locacao}
                                            onChange={handleChangeValorAluguel}
                                            fullWidth
                                            InputProps={{
                                                inputMode: "numeric",
                                            }}
                                            disabled={dados.nsi_valor_locacao}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="nsi_valor_locacao"
                                                    checked={dados.nsi_valor_locacao}
                                                    onChange={(e) => {
                                                        handleCheckboxChange(e);
                                                        if (e.target.checked) {
                                                            setDados(prevState => ({
                                                                ...prevState,
                                                                valor_locacao: '',
                                                            }));
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Não sabe informar valor do aluguel"
                                        />

                                    </Grid>

                                    {/* Contrato de locação */}
                                    <Grid item xs={12}>
                                        <FormLabel component="legend">Contrato de locação</FormLabel>
                                        <RadioGroup
                                            name="contrato_locacao"
                                            value={dados.contrato_locacao}
                                            onChange={handleChange}
                                            row
                                        >
                                            <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                                            <FormControlLabel value="nao" control={<Radio />} label="Não" />
                                            <FormControlLabel
                                                value="naoSabeInformar"
                                                control={<Radio />}
                                                label="Não sabe informar"
                                                onChange={(e: any) =>
                                                    setDados((prev) => ({
                                                        ...prev,
                                                        naoSabeContratoLocacao: e.target.value === "naoSabeInformar",
                                                    }))
                                                }
                                            />
                                        </RadioGroup>
                                    </Grid>

                                    {/* Nome do proprietário */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Nome completo do proprietário da unidade"
                                            type="text"
                                            name="nome_proprietario"
                                            value={dados.nome_proprietario}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>

                                    {/* Contato do proprietário */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Contato do proprietário da unidade (Celular)"
                                            type="text"
                                            name="contato_proprietario"
                                            value={dados.contato_proprietario}
                                            onChange={handleChange}
                                            fullWidth
                                            disabled={dados.nsi_contato_proprietario}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    name="nsi_contato_proprietario"
                                                    checked={dados.nsi_contato_proprietario}
                                                    onChange={handleCheckboxChange}
                                                />
                                            }
                                            label="Não sabe informar"
                                        />
                                    </Grid>
                                </Grid>
                            </Collapse>
                        )}

                        {regimeOcupacao === "propria" && (
                            <Collapse in={regimeOcupacao === "propria"}>
                                <Grid container spacing={3}>
                                    {/* Documento de comprovação de aquisição */}
                                    <Grid item xs={12}>
                                        <FormLabel component="legend">Qual é o documento de comprovação de aquisição da unidade?</FormLabel>
                                        <RadioGroup
                                            name="documentoComprovacao"
                                            value={dados.documentoComprovacao}
                                            onChange={handleChange}
                                            row
                                        >
                                            <FormControlLabel
                                                value="contratoVendaCompra"
                                                control={<Radio />}
                                                label="Contrato de venda e compra"
                                            />
                                            <FormControlLabel
                                                value="somenteRecibo"
                                                control={<Radio />}
                                                label="Somente recibo de compra"
                                            />
                                            <FormControlLabel
                                                value="escritura"
                                                control={<Radio />}
                                                label="Escritura"
                                            />
                                            <FormControlLabel
                                                value="acaoUsucapiao"
                                                control={<Radio />}
                                                label="Ação Judicial de usucapião"
                                            />
                                            <FormControlLabel
                                                value="outro"
                                                control={<Radio />}
                                                label="Outro"
                                            />
                                        </RadioGroup>
                                    </Grid>

                                    {/* Campo digitável para "Outro" */}
                                    {dados.documentoComprovacao === "outro" && (
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Descreva o documento"
                                                type="text"
                                                name="descricaoDocumento"
                                                value={dados.descricaoDocumento}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Collapse>
                        )}

                        {regimeOcupacao === "cedida" && (
                            <Collapse in={regimeOcupacao === "cedida"}>
                                <Grid container spacing={3}>
                                    {/* Nome do proprietário */}
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Nome do proprietário"
                                            type="text"
                                            name="nome_proprietario_cedida"
                                            value={dados.nome_proprietario_cedida}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>

                                    {/* Telefone do proprietário */}
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Telefone do proprietário"
                                            type="text"
                                            name="telefone_proprietario_cedida"
                                            value={dados.telefone_proprietario_cedida}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Collapse>
                        )}

                        <Grid item xs={12} sm={12}></Grid>
                        <>
                            <Grid item xs={12}>
                                Tempo de moradia na Unidade
                                <TextField
                                    label="Anos"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    name="tempoMoradiaAnos"
                                    fullWidth
                                    value={dados.tempoMoradiaAnos}
                                    onChange={(e) => setDados({ ...dados, tempoMoradiaAnos: e.target.value })}
                                    disabled={dados.tempoMoradiaNaoSabe}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <br />
                                <TextField
                                    label="Meses"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    name="tempoMoradiaMeses"
                                    fullWidth
                                    value={dados.tempoMoradiaMeses}
                                    onChange={(e) => setDados({ ...dados, tempoMoradiaMeses: e.target.value })}
                                    disabled={dados.tempoMoradiaNaoSabe}
                                />
                            </Grid>
                        </>
                        <Grid xs={12} sm={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="tempoMoradiaNaoSabe"
                                        checked={dados.tempoMoradiaNaoSabe}
                                        onChange={handleTempoMoradiaNaoSabeChange}
                                    />
                                }
                                label="Não se aplica"
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ margin: '0 0 32px 0', padding: '12px 0' }}>
                            <FormLabel component="legend" sx={{ margin: '16px 0' }}>Regime de Ocupação da Unidade</FormLabel>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel id="cozinhaCompartilhada-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >
                                        A cozinha é compartilhada com outras famílias?
                                    </InputLabel>
                                    <Select
                                        labelId="cozinhaCompartilhada-label"
                                        name="cozinhaCompartilhada"
                                        value={dados.cozinhaCompartilhada}
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
                            <br />
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel id="banheiroCompartilhado-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >
                                        O banheiro é compartilhado com outras famílias?
                                    </InputLabel>
                                    <Select
                                        labelId="banheiroCompartilhado-label"
                                        name="banheiroCompartilhado"
                                        value={dados.banheiroCompartilhado}
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
                        {/* Separa os resíduos domésticos */}
                        <Grid item xs={12} sx={{ margin: '0 0 32px 0' }}>
                            <Grid item xs={12} marginBottom={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="separaResiduos-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Você separa os resíduos domésticos?</InputLabel>
                                    <Select
                                        labelId="separaResiduos-label"
                                        id="separaResiduos"
                                        value={dados.separaResiduos}
                                        onChange={(e) => setDados({ ...dados, separaResiduos: e.target.value })}
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Não">Não</MenuItem>
                                        <MenuItem value="Não sabe informar">Não sabe informar</MenuItem>
                                        <MenuItem value="Não respondeu">Não respondeu</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Se a resposta for "Sim", mostrar questionamentos sobre resíduo orgânico e reciclável */}
                            {dados.separaResiduos === "Sim" && (
                                <>
                                    {/* Destinação do resíduo reciclável */}
                                    <Grid item xs={12} marginBottom={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="destinoReciclavel-label"
                                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                            >Qual a destinação do resíduo reciclável?</InputLabel>
                                            <Select
                                                labelId="destinoReciclavel-label"
                                                id="destinoReciclavel"
                                                multiple
                                                value={dados.destinoReciclavel}
                                                onChange={(e) => setDados({ ...dados, destinoReciclavel: e.target.value as string[] })}
                                                renderValue={(selected) => selected.join(', ')}
                                            >
                                                <MenuItem value="Retirado pelo caminhão de coleta seletiva prefeitura">Retirado pelo caminhão de coleta seletiva prefeitura</MenuItem>
                                                <MenuItem value="Coletado em lixeiras coletivas / caçambas">Coletado em lixeiras coletivas / caçambas</MenuItem>
                                                <MenuItem value="Coletado por cooperativas e/ou catadores de materiais recicláveis">Coletado por cooperativas e/ou catadores de materiais recicláveis</MenuItem>
                                                <MenuItem value="Não faz separação dos resíduos, segue destinação do resíduo orgânico">Não faz separação dos resíduos, segue destinação do resíduo orgânico</MenuItem>
                                                <MenuItem value="Ecoponto da região">Ecoponto da região</MenuItem>
                                                <MenuItem value="Não possui destinação oficial">Não possui destinação oficial</MenuItem>
                                                <MenuItem value="Não identificado" onClick={() => setDados({ ...dados, destinoReciclavel: ['Não identificado'] })}>
                                                    Não identificado
                                                </MenuItem>
                                                <MenuItem value="Outros">Outros</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </ Grid>
                                    {/* Campo para digitação se "Outros" for selecionado no resíduo reciclável */}
                                    {dados.destinoReciclavel.includes("Outros") && (
                                        <Grid item xs={12} marginTop={-3}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label="Especifique o destino do resíduo reciclável"
                                                    fullWidth
                                                    margin="normal"
                                                    name="outroDestinoReciclavel"
                                                    value={dados.outroDestinoReciclavel}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </ Grid>
                                    )}
                                    <Grid item xs={12} marginTop={3}>
                                        <FormControl fullWidth>
                                            {/* Destinação do resíduo orgânico */}
                                            <InputLabel id="destinoOrganico-label"
                                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                            >Qual a destinação do resíduo orgânico?</InputLabel>
                                            <Select
                                                labelId="destinoOrganico-label"
                                                id="destinoOrganico"
                                                multiple
                                                value={dados.destinoOrganico}
                                                onChange={(e) => setDados({ ...dados, destinoOrganico: e.target.value as string[] })}
                                                renderValue={(selected) => selected.join(', ')}
                                            >
                                                <MenuItem value="Retirado pelo caminhão de coleta seletiva prefeitura">Retirado pelo caminhão de coleta seletiva prefeitura</MenuItem>
                                                <MenuItem value="Coletado em lixeiras coletivas / caçambas">Coletado em lixeiras coletivas / caçambas</MenuItem>
                                                <MenuItem value="Compostagem doméstica">Compostagem doméstica</MenuItem>
                                                <MenuItem value="Não identificado" onClick={() => setDados({ ...dados, destinoOrganico: ['Não identificado'] })}>
                                                    Não identificado
                                                </MenuItem>
                                                <MenuItem value="Outros">Outros</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </ Grid>
                                    {/* Campo para digitação, se selcionado "Outros" */}
                                    {dados.destinoOrganico.includes("Outros") && (
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label="Especifique o destino do resíduo orgânico"
                                                    fullWidth
                                                    margin="normal"
                                                    name="outroDestinoOrganico"
                                                    value={dados.outroDestinoOrganico}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </ Grid>
                                    )}
                                </>
                            )}

                            {/* Se a resposta for "Não", mostrar questionamento sobre destinação dos resíduos domésticos */}
                            {dados.separaResiduos === "Não" && (
                                <>
                                    <Grid item xs={12} >
                                        <FormControl fullWidth>
                                            <InputLabel id="destinoDomestico-label"
                                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                            >Qual a destinação dos resíduos domésticos?</InputLabel>
                                            <Select
                                                labelId="destinoDomestico-label"
                                                id="destinoDomestico"
                                                multiple
                                                value={dados.destinoDomestico}
                                                onChange={(e) => setDados({ ...dados, destinoDomestico: e.target.value as string[] })}
                                                renderValue={(selected) => selected.join(', ')}
                                            >
                                                <MenuItem value="Retirado pelo caminhão de coleta seletiva prefeitura">Retirado pelo caminhão de coleta seletiva prefeitura</MenuItem>
                                                <MenuItem value="Coletado em lixeiras coletivas / caçambas">Coletado em lixeiras coletivas / caçambas</MenuItem>
                                                <MenuItem value="Jogado no córrego">Jogado no córrego</MenuItem>
                                                <MenuItem value="Jogado em terreno vazio/rua">Jogado em terreno vazio/rua</MenuItem>
                                                <MenuItem value="Queimado em local próximo">Queimado em local próximo</MenuItem>
                                                <MenuItem value="Não possui destinação oficial">Não possui destinação oficial</MenuItem>
                                                <MenuItem value="Não identificado" onClick={() => setDados({ ...dados, destinoDomestico: ['Não identificado'] })}>
                                                    Não identificado
                                                </MenuItem>
                                                <MenuItem value="Outros">Outros</MenuItem>
                                            </Select>

                                            {/* Campo para digitação se "Outros" for selecionado no resíduo doméstico */}
                                            {dados.destinoDomestico.includes("Outros") && (
                                                <TextField
                                                    label="Especifique"
                                                    fullWidth
                                                    margin="normal"
                                                    name="outroDestinoDomestico"
                                                    value={dados.outroDestinoDomestico}
                                                    onChange={handleChange}
                                                />
                                            )}
                                        </FormControl>
                                    </ Grid>
                                </>
                            )}
                            {/* </FormControl> */}
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
                </Grid>
            </Collapse >
        </>
    );
};

export default SituUsoUniForm;
