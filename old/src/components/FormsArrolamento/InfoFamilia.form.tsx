import { Button, Grid, Collapse, FormControlLabel, Radio, RadioGroup, TextField, FormLabel, Autocomplete } from "@mui/material";
import axios from "axios";
import { countries } from "countries-list";
import { useEffect, useState } from "react";
import { URLs } from "../../env";
import { formatCurrency } from "../formatReal";

interface InfoFamiliaFormProps {
    id: string;
    arrolamento_id?: string;
    idLocal?: string;
    rendaFamiliar?: string;
    criancas0a3?: number;
    criancas4a6?: number;
    criancas7a11?: number;
    adolescentes12a18?: number;
    adultos19a59?: number;
    idosos60?: number;
    pessoasComDeficiencia?: number;
    usaTecnologiaAssistiva?: false;
    tecnologiasAssistivas: [
        'Aparelho Auditivo',
        'Órteses/Próteses',
        'Cadeira de Rodas',
        'Cama Hospitalar',
        'Muleta/Bengala 4 Pontas/Andador',
        'Lupas/Lentes/Fonte Ampliadas ou Contraste',
        'Braille ou Equipamento com Síntese de Voz',
        'Libras',
        'Leitura Facial/Labial',
        'Bengala Branca ou Verde Vermelha',
        'Cão Guia',
        'Prancha de Comunicação Alternativa',
        'Outro'
    ];
    tecnologiaEspecifica?: '';
    totalPessoas?: number;
    naoTemInformacao?: false;
    naoSabeInformar?: false;
    quantidadePessoasUsaTecAssis?: [];
    pessoasComDoencasCronicas?: number;
    pessoasImigrantes?: number;
    gestantes?: number;
    nacionalidadesSelecionadas?: [];
    numerosPorPais?: { [key: string]: number };
    numerosPorDef?: { [key: string]: number };
}

const InfoFamiliaForm: React.FC<InfoFamiliaFormProps> = ({
    id,
    arrolamento_id,
    idLocal,
    criancas0a3,
    criancas4a6,
    criancas7a11,
    adolescentes12a18,
    adultos19a59,
    idosos60,
    gestantes,
    nacionalidadesSelecionadas,
    naoSabeInformar,
    naoTemInformacao,
    numerosPorDef,
    numerosPorPais,
    pessoasComDeficiencia,
    pessoasComDoencasCronicas,
    pessoasImigrantes,
    quantidadePessoasUsaTecAssis,
    rendaFamiliar,
    tecnologiaEspecifica,
    tecnologiasAssistivas,
    totalPessoas,
    usaTecnologiaAssistiva
}) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [ok, setOk] = useState(false);
    const [dados, setDados] = useState({
        rendaFamiliar: rendaFamiliar ? rendaFamiliar : '',
        criancas0a3: criancas0a3 ? criancas0a3 : 0,
        criancas4a6: criancas4a6 ? criancas4a6 : 0,
        criancas7a11: criancas7a11 ? criancas7a11 : 0,
        adolescentes12a18: adolescentes12a18 ? adolescentes12a18 : 0,
        adultos19a59: adultos19a59 ? adultos19a59 : 0,
        idosos60: idosos60 ? idosos60 : 0,
        pessoasComDeficiencia: pessoasComDeficiencia ? pessoasComDeficiencia : 0,
        usaTecnologiaAssistiva: usaTecnologiaAssistiva ? usaTecnologiaAssistiva : false,
        tecnologiasAssistivas: tecnologiasAssistivas ? tecnologiasAssistivas : [
            'Aparelho Auditivo',
            'Órteses/Próteses',
            'Cadeira de Rodas',
            'Cama Hospitalar',
            'Muleta/Bengala 4 Pontas/Andador',
            'Lupas/Lentes/Fonte Ampliadas ou Contraste',
            'Braille ou Equipamento com Síntese de Voz',
            'Libras',
            'Leitura Facial/Labial',
            'Bengala Branca ou Verde Vermelha',
            'Cão Guia',
            'Prancha de Comunicação Alternativa',
            'Outro'
        ] as string[],
        tecnologiaEspecifica: tecnologiaEspecifica ? tecnologiaEspecifica : '',
        totalPessoas: totalPessoas ? totalPessoas : 0,
        naoTemInformacao: naoTemInformacao ? naoTemInformacao : false,
        naoSabeInformar: naoSabeInformar ? naoSabeInformar : false,
        quantidadePessoasUsaTecAssis: quantidadePessoasUsaTecAssis ? quantidadePessoasUsaTecAssis : [] as string[],
        pessoasComDoencasCronicas: pessoasComDoencasCronicas ? pessoasComDoencasCronicas : 0,
        pessoasImigrantes: pessoasImigrantes ? pessoasImigrantes : 0,
        gestantes: gestantes ? gestantes : 0,
        nacionalidadesSelecionadas: nacionalidadesSelecionadas ? nacionalidadesSelecionadas : [] as string[],
        numerosPorPais: numerosPorPais ? numerosPorPais : {} as { [key: string]: number },
        numerosPorDef: numerosPorDef ? numerosPorDef : {} as { [key: string]: number },
        arrolamento_id: id,
        idLocal: idLocal ? idLocal : "not",
    });
    dados.arrolamento_id = id;
    const listaPaises = Object.values(countries).map((country) => country.name);
    const listaDefs = Object.values(tecnologiasAssistivas || []).map((def) => def);

    // Função para atualizar o estado dos inputs numéricos e texto
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDados((prev) => ({
            ...prev,
            [name]: value === '' ? 0 : value,
        }));
        if (name === "rendaFamiliar") {
            const formattedValue = formatCurrency(event.target.value);
            setDados({ ...dados, rendaFamiliar: formattedValue });
        }
    };

    // Função para o radio button de tecnologia assistiva
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setDados((prev) => ({
            ...prev,
            usaTecnologiaAssistiva: value === 'sim',
        }));
    };

    // Calcula o total de pessoas nas faixas de idade
    const totalPessoasFaixaEtaria =
        parseInt(dados.criancas0a3.toString(), 10) +
        parseInt(dados.criancas4a6.toString(), 10) +
        parseInt(dados.criancas7a11.toString(), 10) +
        parseInt(dados.adolescentes12a18.toString(), 10) +
        parseInt(dados.adultos19a59.toString(), 10) +
        parseInt(dados.idosos60.toString(), 10) 
    // Calcula o total de pessoas imigrantes
    useEffect(() => {
        const total = Object.values(dados.numerosPorPais).reduce((acc, curr) => acc + curr, 0);
        setDados((prev) => ({
            ...prev,
            pessoasImigrantes: total,
        }));
    }, [dados.numerosPorPais]);

     // Sincroniza os países selecionados com os números por país
     useEffect(() => {
        setDados((prev) => {
            const novosNumerosPorPais = Object.keys(prev.numerosPorPais)
                .filter((pais) => prev.nacionalidadesSelecionadas.includes(pais))
                .reduce((acc, pais) => {
                    acc[pais] = prev.numerosPorPais[pais];
                    return acc;
                }, {} as { [key: string]: number });

            return {
                ...prev,
                numerosPorPais: novosNumerosPorPais,
            };
        });
    }, [dados.nacionalidadesSelecionadas]);

    // Função para controlar as nacionalidades selecionadas
    const handleNacionalidadesChange = (_: any, valores: string[]) => {
        setDados((prev) => ({
            ...prev,
            nacionalidadesSelecionadas: valores,
            // Atualiza o estado com campos para cada país selecionado, mantendo os anteriores
            numerosPorPais: {
                ...prev.numerosPorPais,
                ...valores.reduce((acc, pais) => {
                    if (!prev.numerosPorPais[pais]) acc[pais] = 0; // Inicializa com 0 se o país não tiver valor
                    return acc;
                }, {} as { [key: string]: number }),
            }
        }));
    };

    const handleDefChange = (_: any, valores: string[]) => {
        setDados((prev) => ({
            ...prev,
            quantidadePessoasUsaTecAssis: valores,
            // Atualiza o estado com campos para cada país selecionado, mantendo os anteriores
            numerosPorDef: {
                ...prev.numerosPorDef,
                ...valores.reduce((acc, def) => {
                    if (!prev.numerosPorDef[def]) acc[def] = 0; // Inicializa com 0 se o país não tiver valor
                    return acc;
                }, {} as { [key: string]: number }),
            }
        }));
    };

    // Função para controlar a mudança de número para cada país
    const handleNumeroPorPaisChange = (pais: string, valor: number) => {
        setDados((prev) => ({
            ...prev,
            numerosPorPais: {
                ...prev.numerosPorPais,
                [pais]: valor || 0,
            }
        }));
    };

    // Função para controlar a mudança de número para cada país
    const handleNumeroPorDefChange = (def: string, valor: number) => {
        setDados((prev) => ({
            ...prev,
            numerosPorDef: {
                ...prev.numerosPorDef,
                [def]: valor,
            }
        }));
    };

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
                await axios.post(`${URLs.DEV}/info-familia-8-arrolamento/`, dados, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert('Dados salvos com sucesso!');
                setMostrarIdentificacao(!mostrarIdentificacao);
                setOk(!ok);
            } else {
                await axios.put(`${URLs.DEV}/info-familia-8-arrolamento/${dados.idLocal}`, dados, {
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
                {ok ? "✅- 8. INFORMAÇÕES SOBRE A FAMÍLIA" : "8. INFORMAÇÕES SOBRE A FAMÍLIA"}
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
                    {/* Campo para a quantidade total de pessoas */}
                    <Grid item xs={6}>
                        <TextField
                            label="Quantidade total de pessoas"
                            value={totalPessoasFaixaEtaria}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            disabled
                        />
                    </Grid>

                    {/* Campo de renda familiar */}
                    <Grid item xs={3}>
                        <TextField
                            label="Informe a renda familiar"
                            name="rendaFamiliar"
                            value={dados.rendaFamiliar}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                inputMode: "numeric",
                            }}
                        />
                    </Grid>

                    {/* Campos para cada faixa etária */}
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de crianças (0 a 3 anos)"
                            name="criancas0a3"
                            value={dados.criancas0a3}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de crianças (4 a 6 anos)"
                            name="criancas4a6"
                            value={dados.criancas4a6}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de crianças (7 a 11 anos)"
                            name="criancas7a11"
                            value={dados.criancas7a11}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de adolescentes (12 a 18 anos)"
                            name="adolescentes12a18"
                            value={dados.adolescentes12a18}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de pessoas adultas (19 a 59 anos)"
                            name="adultos19a59"
                            value={dados.adultos19a59}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de pessoas idosas (a partir de 60 anos)"
                            name="idosos60"
                            value={dados.idosos60}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>

                    {/* Novo campo: Nº de pessoas com doenças crônicas graves */}
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de pessoas com doenças crônicas graves"
                            name="pessoasComDoencasCronicas"
                            value={dados.pessoasComDoencasCronicas}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>

                    {/* Novo campo: Nº de gestantes */}
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de gestantes"
                            name="gestantes"
                            value={dados.gestantes}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                        />
                    </Grid>

                    {/* Novo campo: Nº de pessoas imigrantes */}
                    <Grid item xs={3}>
                        <TextField
                            label="Nº de pessoas imigrantes"
                            value={dados.pessoasImigrantes}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    {/* Campo de seleção de nacionalidades */}
                    {

                        <Grid item xs={3}>
                            <Autocomplete
                                multiple
                                options={listaPaises}
                                getOptionLabel={(option) => option}
                                onChange={handleNacionalidadesChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Selecione as nacionalidades"
                                        placeholder="Países"
                                    />
                                )}
                            />
                        </Grid>
                    }

                    {/* Campos gerados dinamicamente com base nos países selecionados */}
                    {dados.nacionalidadesSelecionadas.map((pais) => (
                        <Grid item xs={3} key={pais}>
                            <TextField
                                label={`Quantidade de pessoas do país: ${pais}`}
                                type="number"
                                inputProps={{ min: 0 }}
                                value={dados.numerosPorPais[pais] || 0}
                                onChange={(e) => handleNumeroPorPaisChange(pais, parseInt(e.target.value))}
                                fullWidth
                            />
                        </Grid>
                    ))}
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

export default InfoFamiliaForm;
