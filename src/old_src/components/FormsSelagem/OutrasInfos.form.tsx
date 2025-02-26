import { Button, Grid, Collapse, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { URLs } from "../../env";

interface OutrasInfosFormProps {
    id: string;
    idLocalP?: string,
    selagem_id?: string
    textoP?: string
  }

const OutrasInfosForm: React.FC<OutrasInfosFormProps> = ({
    id,
    idLocalP,
    selagem_id = id,
    textoP,
     }) => {
    const [texto, setTexto] = useState(textoP ? textoP : '');
    const [idLocal, setIdLocal] = useState(idLocalP ? idLocalP : 'not');
    const [selagemId, setSelagemId] = useState(id);
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [ok, setOk] = useState(false);

    const handleTextoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTexto(event.target.value);
    };
const dados= {
texto: texto,
selagem_id: selagemId
}

useEffect(() => {
    setSelagemId(id); // Atualiza selagemId sempre que o id mudar
  }, [id]);

    const handleSave = async () => {
        try {
            if (idLocal === "not") {
            const response = await axios.post(`${URLs.DEV}/out-inf-rel-6-selagem/`, dados, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados salvos com sucesso!');
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
        } else {
            const response = await axios.put(`${URLs.DEV}/out-inf-rel-6-selagem/${idLocal}`, dados, {
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
                {ok ? "✅- 4. OUTRAS INFORMAÇÕES RELEVANTES" : "4. OUTRAS INFORMAÇÕES RELEVANTES" }
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
                <Grid item xs={12}>
                    <TextField
                        label="Descreva outras informações relevantes"
                        multiline
                        minRows={3} // Quantidade mínima de linhas
                        value={texto}
                        onChange={handleTextoChange}
                        fullWidth
                        variant="outlined"
                    />
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

export default OutrasInfosForm;