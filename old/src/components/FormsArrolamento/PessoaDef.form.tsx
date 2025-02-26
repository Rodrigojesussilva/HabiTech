import { Button, Grid, Collapse, RadioGroup, FormControlLabel, Radio, FormLabel, TextField, Checkbox, FormControl, FormGroup } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface Dados {
    temPessoaDeficienciaFam: string;
    qtdPessoasComDefFam: number;
    responsavelTemDeficiencia: string;
    responsavelPossuiLaudo: string;
    tiposDeficiencia: string[];
    deficienciaEspecifica: string;
    utilizaTecnologiaAssistida: string;
    tecnologiasAssistivas: string[];
    tecnologiaEspecifica: string;
    arrolamento_id: string;
    idLocal?: string,
}


interface PessoaDefFormProps {
    id: string;
    idLocal?: string,
    arrolamento_id?: string
    temPessoaDeficienciaFam?: string
    qtdPessoasComDefFam?: number;
    responsavelTemDeficiencia?: string
    responsavelPossuiLaudo?: string
    tiposDeficiencia?: Array<string>
    deficienciaEspecifica? : string
    utilizaTecnologiaAssistida?: string
    tecnologiasAssistivas?: Array<string>
    tecnologiaEspecifica?: string
}


// Tipo para garantir que apenas chaves válidas de Dados sejam usadas
type DadosKey = keyof Dados;

const PessoaDefForm: React.FC<PessoaDefFormProps> = ({
    id,
    idLocal,
    arrolamento_id = id,
    responsavelPossuiLaudo,
    tecnologiaEspecifica,
    tecnologiasAssistivas,
    responsavelTemDeficiencia,
    temPessoaDeficienciaFam,
    qtdPessoasComDefFam,
    tiposDeficiencia,
    deficienciaEspecifica,
    utilizaTecnologiaAssistida
}) => {
    const [dados, setDados] = useState({
        temPessoaDeficienciaFam: temPessoaDeficienciaFam ? temPessoaDeficienciaFam : '',
        qtdPessoasComDefFam: qtdPessoasComDefFam ? qtdPessoasComDefFam : 0,
        responsavelTemDeficiencia: responsavelTemDeficiencia ? responsavelTemDeficiencia : '',
        responsavelPossuiLaudo: responsavelPossuiLaudo ? responsavelPossuiLaudo : '',
        tiposDeficiencia: tiposDeficiencia ? tiposDeficiencia : [],
        deficienciaEspecifica: deficienciaEspecifica ? deficienciaEspecifica : '',
        utilizaTecnologiaAssistida: utilizaTecnologiaAssistida ? utilizaTecnologiaAssistida : '',
        tecnologiasAssistivas: tecnologiasAssistivas ? tecnologiasAssistivas : [],
        tecnologiaEspecifica: tecnologiaEspecifica ? tecnologiaEspecifica : '',
        idLocal: idLocal ? idLocal : "not",
        arrolamento_id: id,
    });
    dados.arrolamento_id = id;
    const [ok, setOk] = useState(false);

    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target as { name: DadosKey; value: string | number };
        setDados((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target as { name: DadosKey; value: string };
        setDados((prev) => {
            const currentValues = prev[name];

            // Verifica se currentValues é um array
            if (Array.isArray(currentValues)) {
                const newValues = currentValues.includes(value)
                    ? currentValues.filter((item) => item !== value) // Remove if already present
                    : [...currentValues, value]; // Add if not present

                return {
                    ...prev,
                    [name]: newValues,
                };
            }

            // Se não for um array (deve ser uma string), apenas retorna o estado anterior
            return prev;
        });
    };

    const checkRespHasDef = (tipoDeficiencia: string) => {
        const regex = /^.*\%/i;

        dados.tiposDeficiencia.map((item) => {
            if (item.startsWith(tipoDeficiencia)) {
                const result = item.match(regex);
                console.log('result' + result)
                return result;
            }
        })
        return false;
    }
    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/pessoa-def-7-arrolamento/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
                setMostrarIdentificacao(!mostrarIdentificacao);
                setOk(!ok);
            } else {
                await axios.put(`${URLs.DEV}/pessoa-def-7-arrolamento/${dados.idLocal}`, dados, {
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

    const deficiencias = [
        { deficiencia: 'Física', quantidade: 0, defDoResponsavel: false },
        { deficiencia: 'Visual', quantidade: 0, defDoResponsavel: false },
        { deficiencia: 'Auditiva', quantidade: 0, defDoResponsavel: false },
        { deficiencia: 'Intelectual/Mental', quantidade: 0, defDoResponsavel: false },
        { deficiencia: 'Múltiplas', quantidade: 0, defDoResponsavel: false },
        { deficiencia: 'Mobilidade Reduzida', quantidade: 0, defDoResponsavel: false },
        { deficiencia: 'Surdo-cegueira', quantidade: 0, defDoResponsavel: false },
        { deficiencia: 'Outra', quantidade: 0, defDoResponsavel: false }
    ];

    const tecnologias = [
        { tecnologia: "Aparelho Auditivo", defDoResponsavel: false },
        { tecnologia: "Órteses/Próteses", defDoResponsavel: false },
        { tecnologia: "Cadeira de Rodas", defDoResponsavel: false },
        { tecnologia: "Cama Hospitalar", defDoResponsavel: false },
        { tecnologia: "Muleta/Bengala 4 Pontas/Andador", defDoResponsavel: false },
        { tecnologia: "Lupas/Lentes/Fonte Ampliadas ou Contraste", defDoResponsavel: false },
        { tecnologia: "Braille ou Equipamento com Síntese de Voz", defDoResponsavel: false },
        { tecnologia: "Libras", defDoResponsavel: false },
        { tecnologia: "Leitura Facial/Labial", defDoResponsavel: false },
        { tecnologia: "Bengala Branca ou Verde Vermelha", defDoResponsavel: false },
        { tecnologia: "Cão Guia", defDoResponsavel: false },
        { tecnologia: "Prancha de Comunicação Alternativa", defDoResponsavel: false },
        { tecnologia: "Outro", defDoResponsavel: false }
    ];


    return (
        <>
            <div
                className="section-header"
                onClick={() => setMostrarIdentificacao(!mostrarIdentificacao)}
                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', borderRadius: '15px' }}
            >
                {ok ? "✅- 7. PESSOA COM DEFICIÊNCIA" : "7. PESSOA COM DEFICIÊNCIA"}
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

                    <Grid item xs={12}>
                        <FormLabel component="legend">Alguma pessoa da família tem deficiência?</FormLabel>
                        <RadioGroup
                            name="temPessoaDeficienciaFam"
                            value={dados.temPessoaDeficienciaFam}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                            <FormControlLabel value="nao" control={<Radio />} label="Não" />
                        </RadioGroup>
                    </Grid>

                    {dados.temPessoaDeficienciaFam === 'sim' && (
                        <>
                            <Grid item xs={12}>

                                <TextField
                                    type="number"
                                    inputProps={{ min: 1 }}
                                    label="Quantidade de pessoas com deficiência na família"
                                    variant="outlined"
                                    margin="normal"
                                    name="qtdPessoasComDefFam"
                                    fullWidth
                                    value={dados.qtdPessoasComDefFam || 1}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel component="legend">A pessoa responsável pela unidade tem deficiência?</FormLabel>
                                <RadioGroup
                                    name="responsavelTemDeficiencia"
                                    value={dados.responsavelTemDeficiencia}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                                    <FormControlLabel value="nao" control={<Radio />} label="Não" />
                                </RadioGroup>
                            </Grid>

                            {/* Campo possui laudo médico */}
                            {dados.responsavelTemDeficiencia === 'sim' && (
                                <Grid item xs={12}>
                                    <FormLabel component="legend">A pessoa responsável possui laudo médico</FormLabel>
                                    <RadioGroup
                                        name="responsavelPossuiLaudo"
                                        value={dados.responsavelPossuiLaudo}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                                        <FormControlLabel value="nao" control={<Radio />} label="Não" />
                                    </RadioGroup>
                                </Grid>
                            )}

                            {/* Campo qual/quais os tipos de deficiência */}

                            <Grid item xs={12}>
                                <FormLabel component="legend">Qual/quais os tipos de deficiência?</FormLabel>
                                <FormControl component="fieldset">
                                    <FormGroup>
                                        {deficiencias.map((objeto) => (
                                            <div key={objeto.deficiencia}>
                                                <FormControlLabel
                                                    key={objeto.deficiencia}
                                                    control={
                                                        <Checkbox
                                                            checked={dados.tiposDeficiencia.some((item) => {
                                                                const o = JSON.parse(item);
                                                                return o.deficiencia.startsWith(objeto.deficiencia)
                                                            }
                                                            )}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setDados((prev) => {
                                                                    const updated = checked
                                                                        ? [...prev.tiposDeficiencia, JSON.stringify(objeto)] // Default value
                                                                        : prev.tiposDeficiencia.filter((item) => !JSON.parse(item).deficiencia.startsWith(objeto.deficiencia));
                                                                    return { ...prev, tiposDeficiencia: updated };
                                                                });
                                                            }}
                                                            name="tiposDeficiencia"
                                                            value={objeto.deficiencia}
                                                        />
                                                    }
                                                    label={objeto.deficiencia}
                                                />
                                                {dados.tiposDeficiencia.some((item) => JSON.parse(item).deficiencia.startsWith(objeto.deficiencia)) && (
                                                    <>
                                                        <TextField sx={{ marginLeft: '20px' }}
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                            label={objeto.deficiencia.startsWith('Outra') ? 'Quantidade de outra deficiência' : objeto.deficiencia.startsWith('Múltiplas') ? 'Quantidade de Múltiplas deficiências' : `Quantidade de deficiência ${objeto.deficiencia}`}
                                                            variant="outlined"
                                                            margin="normal"
                                                            fullWidth
                                                            value={dados.tiposDeficiencia.map(item => JSON.parse(item)).find((item) => item.deficiencia.startsWith(objeto.deficiencia))?.quantidade || 0}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setDados((prev) => ({
                                                                    ...prev,
                                                                    tiposDeficiencia: prev.tiposDeficiencia.map((item) => {
                                                                        let def = JSON.parse(item);
                                                                        console.log(def);
                                                                        def.quantidade = def.deficiencia.startsWith(objeto.deficiencia) ? value : def.quantidade;
                                                                        console.log(def.quantidade);
                                                                        return JSON.stringify(def);
                                                                    }
                                                                    ),
                                                                }));
                                                            }}
                                                        />
                                                        {dados.responsavelTemDeficiencia === 'sim' && (<FormControlLabel sx={{ marginLeft: '8px' }}
                                                            key={objeto.deficiencia}
                                                            control={
                                                                <Checkbox
                                                                    checked={dados.tiposDeficiencia.map(item => JSON.parse(item)).find((item) => item.deficiencia.startsWith(objeto.deficiencia))?.defDoResponsavel || false}
                                                                    onChange={(e) => {
                                                                        const checked = e.target.checked;
                                                                        setDados((prev) => {
                                                                            const newTiposDeficiencia = prev.tiposDeficiencia.map((item) => {
                                                                                let def = JSON.parse(item);
                                                                                def.defDoResponsavel = def.deficiencia.startsWith(objeto.deficiencia) ? checked : def.defDoResponsavel;
                                                                                return JSON.stringify(def);
                                                                            });
                                                                            return { ...prev, tiposDeficiencia: newTiposDeficiencia };
                                                                        });
                                                                    }}
                                                                    name="tiposDeficienciaCheck"
                                                                    value="Responsável tem essa deficiência?"
                                                                />
                                                            }
                                                            label="Responsável tem essa deficiência?"
                                                        />)}
                                                    </>
                                                )}
                                            </div>

                                        ))}
                                    </FormGroup>
                                </FormControl>
                                {dados.tiposDeficiencia.find((item) => JSON.parse(item).deficiencia.startsWith('Outra')) && <TextField
                                        sx={{marginLeft: '20px'}}
                                        label="Especificar outro tipo de deficiência"
                                        variant="outlined"
                                        fullWidth
                                        value={dados.deficienciaEspecifica}
                                        margin="normal"
                                        onChange={(e) => setDados(prev => ({ ...prev, deficienciaEspecifica: e.target.value }))}
                                    />}
                            </Grid>


                            {/* Campo utiliza tecnologia assistida */}
                            <Grid item xs={12} >
                                <FormLabel component="legend">Utiliza tecnologia assistiva?</FormLabel>
                                <RadioGroup
                                    name="utilizaTecnologiaAssistida"
                                    value={dados.utilizaTecnologiaAssistida}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                                    <FormControlLabel value="nao" control={<Radio />} label="Não" />
                                </RadioGroup>
                            </Grid>

                            {/* Campo Qual Tecnologia Assistiva Utiliza? */}
                            {dados.utilizaTecnologiaAssistida === 'sim' && (
                                <Grid item xs={12}>
                                    <FormLabel component="legend">Qual tecnologia assistiva utiliza?</FormLabel>
                                    <FormGroup>
                                        {tecnologias.map((objeto) => (
                                            <>
                                                <div key={objeto.tecnologia}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dados.tecnologiasAssistivas.some((item) => {
                                                                    const o = JSON.parse(item);
                                                                    return o.tecnologia.startsWith(objeto.tecnologia)
                                                                }
                                                                )}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    setDados((prev) => {
                                                                        const updated = checked
                                                                            ? [...prev.tecnologiasAssistivas, JSON.stringify(objeto)] // Default value
                                                                            : prev.tecnologiasAssistivas.filter((item) => !JSON.parse(item).tecnologia.startsWith(objeto.tecnologia));
                                                                        return { ...prev, tecnologiasAssistivas: updated };
                                                                    });
                                                                }}
                                                                name="tecnologiasAssistivas"
                                                                value={objeto.tecnologia}
                                                            />
                                                        }
                                                        label={objeto.tecnologia}
                                                    />
                                                </div>
                                                {dados.tecnologiasAssistivas.some((item) => JSON.parse(item).tecnologia.startsWith(objeto.tecnologia)) && dados.responsavelTemDeficiencia === 'sim' && (
                                                    <div>
                                                        <FormControlLabel sx={{ marginLeft: '18px' }}
                                                            key={objeto.tecnologia}
                                                            control={
                                                                <Checkbox
                                                                    checked={dados.tecnologiasAssistivas.map(item => JSON.parse(item)).find((item) => item.tecnologia.startsWith(objeto.tecnologia))?.defDoResponsavel || false}
                                                                    onChange={(e) => {
                                                                        const checked = e.target.checked;
                                                                        setDados((prev) => {
                                                                            const newTecnologiasAssistivas = prev.tecnologiasAssistivas.map((item) => {
                                                                                let def = JSON.parse(item);
                                                                                def.defDoResponsavel = def.tecnologia.startsWith(objeto.tecnologia) ? checked : def.defDoResponsavel;
                                                                                return JSON.stringify(def);
                                                                            });
                                                                            return { ...prev, tecnologiasAssistivas: newTecnologiasAssistivas };
                                                                        });
                                                                    }}
                                                                    name="tecnologiasAssistivasCheck"
                                                                    value="Responsável usa essa tecnologia assistiva?"
                                                                />
                                                            }
                                                            label="Responsável usa essa tecnologia assistiva?"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ))}
                                    </FormGroup>
                                    {dados.tecnologiasAssistivas.find((item) => JSON.parse(item).tecnologia.startsWith('Outro')) && <TextField
                                        sx={{marginLeft: '20px'}}
                                        label="Especificar outro tipo de tecnologia assistiva"
                                        variant="outlined"
                                        value={dados.tecnologiaEspecifica}
                                        fullWidth
                                        margin="normal"
                                        onChange={(e) => setDados((prev) => ({ ...prev, tecnologiaEspecifica: e.target.value }))}
                                    />}
                                </Grid>
                            )}
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

export default PessoaDefForm;
