import { Button, Grid, Collapse, RadioGroup, FormControlLabel, Radio, FormLabel, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface IdentEtiRacGeneformProps {
    id: string;
    idLocal?: string,
    arrolamento_id?: string
    etnicoRacial?: string
    genero?: string
    generoOutro?: string
  }

const IdentEtiRacGeneform: React.FC<IdentEtiRacGeneformProps> = ({ 
    id,
    idLocal,
    arrolamento_id = id,
    etnicoRacial,
    genero,
    generoOutro
 }) => {
    const [dados, setDados] = useState({
        etnicoRacial: etnicoRacial ? etnicoRacial : '',
        genero: genero ? genero : '',
        generoOutro: generoOutro ? generoOutro : '',
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
            const response = await axios.post(`${URLs.DEV}/ident-eti-rac-gene-5-arrolamento/`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados salvos com sucesso!');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
        } else {
            const response = await axios.put(`${URLs.DEV}/ident-eti-rac-gene-5-arrolamento/${dados.idLocal}`, dados, {
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
               {ok ? "✅- 5. IDENTIDADE ÉTINICO-RACIAL E DE GÊNERO" : "5. IDENTIDADE ÉTINICO-RACIAL E DE GÊNERO"}
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
                    {/* Campo Identidade Étnico-Racial */}
                    <Grid item xs={12}>
                        <FormLabel component="legend">Identidade Étnico-Racial</FormLabel>
                        <RadioGroup
                            name="etnicoRacial"
                            value={dados.etnicoRacial}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="amarela" control={<Radio />} label="Amarela" />
                            <FormControlLabel value="branca" control={<Radio />} label="Branca" />
                            <FormControlLabel value="indigena" control={<Radio />} label="Indígena" />
                            <FormControlLabel value="parda" control={<Radio />} label="Parda/Negra" />
                            <FormControlLabel value="preta" control={<Radio />} label="Preta/Negra" />
                        </RadioGroup>
                    </Grid>

                    {/* Campo Identidade de Gênero */}
                    <Grid item xs={12}>
                        <FormLabel component="legend">Identidade de Gênero</FormLabel>
                        <RadioGroup
                            name="genero"
                            value={dados.genero}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="agenero" control={<Radio />} label="Agênero" />
                            <FormControlLabel value="generoFluido" control={<Radio />} label="Gênero Fluido" />
                            <FormControlLabel value="homemCis" control={<Radio />} label="Homem Cisgênero" />
                            <FormControlLabel value="homemTrans" control={<Radio />} label="Homem Transexual" />
                            <FormControlLabel value="mulherCis" control={<Radio />} label="Mulher Cisgênero" />
                            <FormControlLabel value="mulherTrans" control={<Radio />} label="Mulher Transexual" />
                            <FormControlLabel value="intersexo" control={<Radio />} label="Intersexo" />
                            <FormControlLabel value="naoBinarie" control={<Radio />} label="Não Binarie" />
                            <FormControlLabel value="travesti" control={<Radio />} label="Travesti" />
                            <FormControlLabel value="naoSabeInformar" control={<Radio />} label="Não sabe informar" />
                            <FormControlLabel value="naoRespondeu" control={<Radio />} label="Não respondeu" />
                            <FormControlLabel value="outros" control={<Radio />} label="Outros" />
                        </RadioGroup>
                        {dados.genero === 'outros' && (
                            <TextField
                                name="generoOutro"
                                label="Especifique o Gênero"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={dados.generoOutro}
                                onChange={handleChange}
                            />
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

export default IdentEtiRacGeneform;
