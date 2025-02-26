import React, { useState } from "react";
import { Button, Grid, Collapse, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { URLs } from "../../env";

interface CaractInfraUrbTerriUnidaFormProps {
    id: string;
    selagem_id?: string;
    idLocal?: string;
    banheiro?: string,
    descBanheiro?: string,
    cozinha?: string,
    descCozinha?: string,
    demaisComodos?: string,
    descDemiasComodos?: string,
    peDireito?: string,
    descPeDireito?: string,
    iluminacaoNatural?: string,
    janelasExternas?: string,
    temInsalubridade?: string,
    infultracaoMofo?: string,
    descInfultMofo?: string,
    separaResiduos?: string,
    destinoOrganico?: [],
    outroDestinoOrganico?: string,
    destinoReciclavel?: [],
    outroDestinoReciclavel?: string,
    destinoDomestico?: [],
    outroDestinoDomestico?: string,
    materialParede?: string,
    descMaterial?: string,
    ligacaoEletrica?: string,
    descLigaEletri?: string,
    abastecimentoAgua?: string,
    outroAbasteAgua?: string,
    esgotamentoSanitario?: string,
    outroEsgoto?: string,
}


const CaractInfraUrbTerriUnidaForm: React.FC<CaractInfraUrbTerriUnidaFormProps> = ({
    id,
    idLocal,
    selagem_id,
    banheiro,
    descBanheiro,
    cozinha,
    descCozinha,
    demaisComodos,
    descDemiasComodos,
    peDireito,
    descPeDireito,
    iluminacaoNatural,
    janelasExternas,
    temInsalubridade,
    infultracaoMofo,
    descInfultMofo,
    separaResiduos,
    destinoOrganico,
    outroDestinoOrganico,
    destinoReciclavel,
    outroDestinoReciclavel,
    destinoDomestico,
    outroDestinoDomestico,
    materialParede,
    descMaterial,
    ligacaoEletrica,
    descLigaEletri,
    abastecimentoAgua,
    outroAbasteAgua,
    esgotamentoSanitario,
    outroEsgoto,
}) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [dados, setDados] = useState({
        banheiro: banheiro ? banheiro : '',
        descBanheiro: descBanheiro ? descBanheiro : '',
        cozinha: cozinha ? cozinha : '',
        descCozinha: descCozinha ? descCozinha : '',
        demaisComodos: demaisComodos ? demaisComodos : '',
        descDemiasComodos: descDemiasComodos ? descDemiasComodos : '',
        peDireito: peDireito ? peDireito : '',
        descPeDireito: descPeDireito ? descPeDireito : '',
        iluminacaoNatural: iluminacaoNatural ? iluminacaoNatural : '',
        janelasExternas: janelasExternas ? janelasExternas : '',
        temInsalubridade: temInsalubridade ? temInsalubridade : '',
        infultracaoMofo: infultracaoMofo ? infultracaoMofo : '',
        descInfultMofo: descInfultMofo ? descInfultMofo : '',
        separaResiduos: separaResiduos ? separaResiduos : '',
        destinoOrganico: destinoOrganico ? destinoOrganico : [] as string[],
        outroDestinoOrganico: outroDestinoOrganico ? outroDestinoOrganico : '',
        destinoReciclavel: destinoReciclavel ? destinoReciclavel : [] as string[],
        outroDestinoReciclavel: outroDestinoReciclavel ? outroDestinoReciclavel : '',
        destinoDomestico: destinoDomestico ? destinoDomestico : [] as string[],
        outroDestinoDomestico: outroDestinoDomestico ? outroDestinoDomestico : '',
        materialParede: materialParede ? materialParede : '',
        descMaterial: descMaterial ? descMaterial : '',
        ligacaoEletrica: ligacaoEletrica ? ligacaoEletrica : '',
        descLigaEletri: descLigaEletri ? descLigaEletri : '',
        abastecimentoAgua: abastecimentoAgua ? abastecimentoAgua : '',
        outroAbasteAgua: outroAbasteAgua ? outroAbasteAgua : '',
        esgotamentoSanitario: esgotamentoSanitario ? esgotamentoSanitario : '',
        outroEsgoto: outroEsgoto ? outroEsgoto : '',
        selagem_id: id,
        idLocal: idLocal ? idLocal : "not",
        descVentilacao: '',
        descIluminacaoNatural: ''
    });
    dados.selagem_id = id;
    const [mostrarCamposInsalubridade, setMostrarCamposInsalubridade] = useState(false);
    const [ok, setOk] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setDados((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/infra-urb-terri-uni-5-selagem/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
                setMostrarIdentificacao(!mostrarIdentificacao);
                setOk(!ok);
            } else {
                await axios.put(`${URLs.DEV}/infra-urb-terri-uni-5-selagem/${dados.idLocal}`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados editados com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
            alert('Erro ao salvar os dados');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
        }
    };

    return (
        <>
            <div
                className="section-header"
                onClick={() => setMostrarIdentificacao(!mostrarIdentificacao)}
                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', borderRadius: '15px' }}
            >
                {ok ? "✅- 3.2. CARACTERIZAÇÃO DA INFRAESTRUTURA URBANA E DA UNIDADE" : "3.2. CARACTERIZAÇÃO DA INFRAESTRUTURA URBANA E DA UNIDADE"}
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
                    {/* Material das paredes externas */}
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="material-parede-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >Material predominante nas paredes externas</InputLabel>
                            <Select
                                labelId="material-parede-label"
                                id="material-parede"
                                value={dados.materialParede}
                                onChange={(e) => setDados({ ...dados, materialParede: e.target.value })}
                            >
                                <MenuItem value="Alvenaria">Alvenaria</MenuItem>
                                <MenuItem value="Madeira">Madeira</MenuItem>
                                <MenuItem value="Misto madeira/alvenaria">Misto madeira/alvenaria</MenuItem>
                                <MenuItem value="Material Reaproveitado">Material Reaproveitado</MenuItem>
                                <MenuItem value="Outros">Outros</MenuItem>
                            </Select>
                            {dados.materialParede === 'Outros' && (
                                <TextField onChange={handleChange} value={dados.descMaterial} name="descMaterial" label="Especifique o material" fullWidth margin="normal" />
                            )}
                        </FormControl>
                    </Grid>
                    {/* Insalubridade */}
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="insalubridade-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >Unidade apresenta condições de insalubridade?</InputLabel>
                            <Select
                                labelId="temInsalubridade-label"
                                id="temInsalubridade"
                                value={dados.temInsalubridade}
                                name="temInsalubridade"
                                onChange={(e) => {
                                    handleChange(e);
                                    setMostrarCamposInsalubridade(e.target.value === 'Sim');
                                }}
                            >
                                <MenuItem value="Sim">Sim</MenuItem>
                                <MenuItem value="Nao">Não</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Campos adicionais de insalubridade */}
                    {mostrarCamposInsalubridade && (
                        <>

                            {/* Pé direito 2° */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="pe-direito-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >O pé direito da unidade atende ao mínimo de 2,30m?</InputLabel>
                                    <Select
                                        labelId="pe-direito-label"
                                        id="pe-direito"
                                        value={dados.peDireito}
                                        onChange={handleChange}
                                        name="peDireito"
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Nao">Não</MenuItem>
                                    </Select>
                                    {dados.peDireito === 'Nao' && (
                                        <TextField onChange={handleChange} value={dados.descPeDireito} name="descPeDireito" label="Descreva as condições (Pé direito)" fullWidth margin="normal" />
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Iluminação natural 3° */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="iluminacaoNatural-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Possui iluminação natural na unidade?</InputLabel>
                                    <Select
                                        labelId="iluminacaoNatural-label"
                                        id="iluminacaoNatural"
                                        value={dados.iluminacaoNatural}
                                        onChange={handleChange}
                                        name="iluminacaoNatural"
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Nao">Não</MenuItem>
                                    </Select>
                                    {dados.iluminacaoNatural === 'Nao' && (
                                        <TextField onChange={handleChange} value={dados.descIluminacaoNatural} name="descIluminacaoNatural" label="Descreva as condições (Iluminação Natural)" fullWidth margin="normal" />
                                    )}
                                </FormControl>
                            </Grid>


                            {/* Janelas área externa 4° */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="janelasExternas-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >A área de ventilação da unidade transmite sensação de salubridade? </InputLabel>
                                    <Select
                                        labelId="janelasExternas-label"
                                        id="janelasExternas"
                                        value={dados.janelasExternas}
                                        onChange={handleChange}
                                        name="janelasExternas"
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Nao">Não</MenuItem>
                                    </Select>
                                    {dados.janelasExternas === 'Nao' && (
                                        <TextField onChange={handleChange} value={dados.descVentilacao} name="descVentilacao" label="Descreva as condições (Ventilação)" fullWidth margin="normal" />
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Infultração e/ou mofo 5° */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="infultracaoMofo-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Há infiltração e/ou mofo na unidade?</InputLabel>
                                    <Select
                                        labelId="infultracaoMofo-label"
                                        id="infultracaoMofo"
                                        value={dados.infultracaoMofo}
                                        onChange={handleChange}
                                        name="infultracaoMofo"
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Nao">Não</MenuItem>
                                    </Select>
                                    {dados.infultracaoMofo === 'Nao' && (
                                        <TextField onChange={handleChange} value={dados.descInfultMofo} name="descInfultMofo" label="Descreva as condições de insalubridade sobre infiltração e mofo" fullWidth margin="normal" />
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Cozinha 6° */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="cozinha-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Cozinha: Possui ventilação natural?</InputLabel>
                                    <Select
                                        labelId="cozinha-label"
                                        id="cozinha"
                                        value={dados.cozinha}
                                        onChange={handleChange}
                                        name="cozinha"
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Nao">Não</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {dados.cozinha === 'Sim' && (
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="cozinhaVentilacao-label"
                                            sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                        >A área de ventilação da cozinha transmite sensação de salubridade?  </InputLabel>
                                        <Select
                                            labelId="cozinhaVentilacao-label"
                                            id="cozinhaVentilacao"
                                            value={dados.descCozinha}
                                            onChange={handleChange}
                                            name="descCozinha"
                                        >
                                            <MenuItem value="Sim">Sim</MenuItem>
                                            <MenuItem value="Nao">Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {/* Banheiro 7° */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="banheiro-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Banheiro: Possui ventilação natural?</InputLabel>
                                    <Select
                                        labelId="banheiro-label"
                                        id="banheiro"
                                        value={dados.banheiro}
                                        onChange={handleChange}
                                        name="banheiro"
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Nao">Não</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {dados.banheiro === 'Sim' && (
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="banheiroVentilacao-label"
                                            sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                        >A área de ventilação do banheiro transmite sensação de salubridade?  </InputLabel>
                                        <Select
                                            labelId="banheiroVentilacao-label"
                                            id="banheiroVentilacao"
                                            value={dados.descBanheiro}
                                            onChange={handleChange}
                                            name="descBanheiro"
                                        >
                                            <MenuItem value="Sim">Sim</MenuItem>
                                            <MenuItem value="Nao">Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                            {/* Demais cômodos 8° */}
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demais-comodos-label"
                                        sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                    >Demais cômodos: Possui ventilação natural?</InputLabel>
                                    <Select
                                        labelId="demais-comodos-label"
                                        id="demais-comodos"
                                        value={dados.demaisComodos}
                                        onChange={handleChange}
                                        name="demaisComodos"
                                    >
                                        <MenuItem value="Sim">Sim</MenuItem>
                                        <MenuItem value="Nao">Não</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {dados.demaisComodos === 'Sim' && (
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demaisComodosVentilacao-label"
                                            sx={{ backgroundColor: 'white', padding: '0 4px' }}
                                        >A área de ventilação dos demais cômodos transmite sensação de salubridade?  </InputLabel>
                                        <Select
                                            labelId="demaisComodosVentilacao-label"
                                            id="demaisComodosVentilacao"
                                            value={dados.descDemiasComodos}
                                            onChange={handleChange}
                                            name="descDemiasComodos"
                                        >
                                            <MenuItem value="Sim">Sim</MenuItem>
                                            <MenuItem value="Nao">Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                        </>
                    )}
                    {/* Abastecimento de água */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="abastecimentoAgua-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >Abastecimento de água</InputLabel>
                            <Select
                                labelId="abastecimentoAgua-label"
                                id="abastecimentoAgua"
                                value={dados.abastecimentoAgua}
                                onChange={(e) => setDados({ ...dados, abastecimentoAgua: e.target.value })}
                            >
                                <MenuItem value="Rede pública/ligação individual (oficial)">Rede pública/ligação individual (oficial)</MenuItem>
                                <MenuItem value="Rede pública/ligação coletiva (oficial)">Rede pública/ligação coletiva (oficial)</MenuItem>
                                <MenuItem value="Poço Artesiano">Poço Artesiano</MenuItem>
                                <MenuItem value="Instalação de água não oficial">Instalação de água não oficial</MenuItem>
                                <MenuItem value="Não possui">Não possui</MenuItem>
                                <MenuItem value="Não identificado">Não identificado</MenuItem>
                                <MenuItem value="Outros">Outros</MenuItem>
                            </Select>

                            {/* Campo para digitação se "Outros" for selecionado */}
                            {dados.abastecimentoAgua === "Outros" && (
                                <TextField
                                    label="Especifique o tipo de abastecimento de água"
                                    fullWidth
                                    margin="normal"
                                    name="outroAbasteAgua"
                                    value={dados.outroAbasteAgua}
                                    onChange={handleChange}
                                />
                            )}
                        </FormControl>
                    </Grid>
                    {/* Esgotamento sanitário */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="esgotamentoSanitario-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >Esgotamento sanitário</InputLabel>
                            <Select
                                labelId="esgotamentoSanitario-label"
                                id="esgotamentoSanitario"
                                value={dados.esgotamentoSanitario}
                                onChange={(e) => setDados({ ...dados, esgotamentoSanitario: e.target.value })}
                            >
                                <MenuItem value="Rede pública/ligação individual (oficial)">Rede pública/ligação individual (oficial)</MenuItem>
                                <MenuItem value="Rede pública/ligação coletiva (oficial)">Rede pública/ligação coletiva (oficial)</MenuItem>
                                <MenuItem value="Rede de esgotamento sanitário não oficial">Rede de esgotamento sanitário não oficial</MenuItem>
                                <MenuItem value="Esgotamento Sanitário conectado água pluvial">Esgotamento Sanitário conectado água pluvial</MenuItem>
                                <MenuItem value="Instalação de água não oficial">Instalação de água não oficial</MenuItem>
                                <MenuItem value="A céu aberto córrego/encosta">A céu aberto córrego/encosta</MenuItem>
                                <MenuItem value="Fossa séptica">Fossa séptica</MenuItem>
                                <MenuItem value="Fossa rudimentar">Fossa rudimentar</MenuItem>
                                <MenuItem value="Sistema individualizado de tratamento de esgoto (área de mananciais)">
                                    Sistema individualizado de tratamento de esgoto (área de mananciais)
                                </MenuItem>
                                <MenuItem value="Não possui">Não possui</MenuItem>
                                <MenuItem value="Não identificado">Não identificado</MenuItem>
                                <MenuItem value="Outros">Outros</MenuItem>
                            </Select>

                            {/* Campo para digitação se "Outros" for selecionado */}
                            {dados.esgotamentoSanitario === "Outros" && (
                                <TextField
                                    label="Especifique o tipo de esgotamento sanitário"
                                    fullWidth
                                    margin="normal"
                                    name="outroEsgoto"
                                    value={dados.outroEsgoto}
                                    onChange={handleChange}
                                />
                            )}
                        </FormControl>
                    </Grid>

                    {/* Ligação Elétrica */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="ligacao-eletrica-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >Ligação Elétrica</InputLabel>
                            <Select
                                labelId="ligacao-eletrica-label"
                                id="ligacao-eletrica"
                                value={dados.ligacaoEletrica}
                                onChange={(e) => setDados({ ...dados, ligacaoEletrica: e.target.value })}
                            >
                                <MenuItem value="Relógio próprio/medidor individual">Relógio próprio/medidor individual</MenuItem>
                                <MenuItem value="Instalação de energia Elétrica não oficial">Instalação de energia Elétrica não oficial</MenuItem>
                                <MenuItem value="Relógio comunitário/medidor coletivo">Relógio comunitário/medidor coletivo</MenuItem>
                                <MenuItem value="Não possui">Não possui</MenuItem>
                                <MenuItem value="Não identificado">Não identificado</MenuItem>
                                <MenuItem value="Outros">Outros</MenuItem>
                            </Select>
                            {dados.ligacaoEletrica === 'Outros' && (
                                <TextField onChange={handleChange} value={dados.descLigaEletri} name="descLigaEletri" label="Especifique o tipo de ligação elétrica" fullWidth margin="normal" />
                            )}
                        </FormControl>
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
                </Grid >
            </Collapse >
        </>
    );
};

export default CaractInfraUrbTerriUnidaForm;
