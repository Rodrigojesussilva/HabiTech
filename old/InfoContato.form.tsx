import { Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Collapse } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { URLs } from "../../env";

interface InfoContatoFormProps {
    id: string;
    telefoneResidencial?: string,
    recado?: boolean,
    telefoneRecado?: string,
    nomeRecado?: string,
    parentesco?: string,
    escrevParentesco?: string,
    telefoneComercial?: string,
    email?: string,
    naoSabeTelefoneComercial?: boolean,
    naoSabeEmail?: boolean,
    idLocal?: string,
    arrolamento_id?: string
  }

const InfoContatoForm: React.FC<InfoContatoFormProps> = ({ 
    id,
    telefoneResidencial,
    recado,
    telefoneRecado,
    nomeRecado,
    parentesco,
    escrevParentesco,
    telefoneComercial,
    email,
    naoSabeTelefoneComercial,
    naoSabeEmail,
    idLocal,
    arrolamento_id = id
 }) => {
    const [dados, setDados] = useState({
        telefones: [{ numero: '', isWhatsApp: false }],
        telefoneResidencial: telefoneResidencial ? telefoneResidencial : '',
        recado: recado ? recado : false,
        telefoneRecado: telefoneRecado ? telefoneRecado : '',
        nomeRecado: nomeRecado ? nomeRecado : '',
        parentesco: parentesco ? parentesco : '',
        escrevParentesco: escrevParentesco ? escrevParentesco : '',
        telefoneComercial: telefoneComercial ? telefoneComercial : '',
        email: email ? email : '',
        naoSabeTelefoneComercial: naoSabeTelefoneComercial ? naoSabeTelefoneComercial : false,
        naoSabeEmail: naoSabeEmail ? naoSabeEmail : false,
        idLocal: idLocal ? idLocal : "not",
        arrolamento_id: id
    });
    dados.arrolamento_id = id;
    const [mostrarContatos, setMostrarContatos] = useState(false);
    const [ok, setOk] = useState(false);
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        if (dados.recado === true && name === 'recado') {
            dados.escrevParentesco = '';
            dados.parentesco = '';
            dados.telefoneRecado = '';
            dados.nomeRecado = '';
        }

        if (dados.naoSabeEmail === false && name === 'naoSabeEmail') {
            dados.email = '';
        }

        if (dados.naoSabeTelefoneComercial === false && name === 'naoSabeTelefoneComercial') {
            dados.telefoneComercial = '';
        }
        setDados((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleTelefoneChange = (index: number, e: any) => {
        const { name, value, checked } = e.target;
        const newTelefones = [...dados.telefones];

        if (name === 'isWhatsApp') {
            newTelefones[index].isWhatsApp = checked;
        } else {
            newTelefones[index].numero = formatarTelefone(value);
        }

        setDados((prevState) => ({
            ...prevState,
            telefones: newTelefones,
        }));
    };

    const formatarTelefone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');

        const limited = cleaned.slice(0, 12);

        if (limited.length <= 2) return `(${limited}`;
        if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 12)}`
    };

    const addTelefone = () => {
        setDados(prevState => ({
            ...prevState,
            telefones: [...prevState.telefones, { numero: '', isWhatsApp: false }],
        }));
    };

    const removeTelefone = (index: number) => {
        const newTelefones = dados.telefones.filter((_, i) => i !== index);
        setDados(prevState => ({
            ...prevState,
            telefones: newTelefones,
        }));
    };

    const handleSave = async () => {
        try {
            if (dados.idLocal === "not") {
            // Criando uma string formatada a partir dos telefones
            const fones = dados.telefones
                .map(fone => `${fone.numero}-${fone.isWhatsApp}`)
                .join(";");
    
            // Criando uma cópia de `dados` e atualizando apenas a propriedade `telefones` com a string formatada
            const dadosParaEnvio = { ...dados, telefones: fones };
    
            // Fazendo a requisição com o `dadosParaEnvio`, mantendo `dados.telefones` como array
            await axios.post(`${URLs.DEV}/info-contato-2-arrolamento/`, dadosParaEnvio, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            alert('Dados salvos com sucesso!');
            setMostrarContatos(!mostrarContatos)
            setOk(!ok)
        } else {
             // Criando uma string formatada a partir dos telefones
             const fones = dados.telefones
             .map(fone => `${fone.numero}-${fone.isWhatsApp}`)
             .join(";");
 
         // Criando uma cópia de `dados` e atualizando apenas a propriedade `telefones` com a string formatada
         const dadosParaEnvio = { ...dados, telefones: fones };
            await axios.put(`${URLs.DEV}/info-contato-2-arrolamento/${dados.idLocal}`, dadosParaEnvio, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Dados editados com sucesso!');
            setMostrarContatos(!mostrarContatos)
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
                onClick={() => setMostrarContatos(!mostrarContatos)}
                style={{ cursor: 'pointer', backgroundColor: '#f1f1f1', padding: '10px', marginBottom: '10px', marginTop: '5px', borderRadius: '15px' }}
            >
               {ok ? "✅- 2. INFORMAÇÕES PARA CONTATO" : "2. INFORMAÇÕES PARA CONTATO"}
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
                        {dados.telefones.map((telefone, index) => (
                            <Grid container item xs={12} sm={6} key={index} alignItems="center">
                                <TextField
                                    label="Telefone Celular"
                                    name="numero"
                                    type="text"
                                    value={telefone.numero}
                                    onChange={(e) => handleTelefoneChange(index, e)}
                                    inputProps={{ maxLength: 15 }}
                                    required
                                    fullWidth
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isWhatsApp"
                                            checked={telefone.isWhatsApp}
                                            onChange={(e) => handleTelefoneChange(index, e)}
                                        />
                                    }
                                    label="É WhatsApp?"
                                />
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => removeTelefone(index)}
                                    disabled={dados.telefones.length === 1} // Não permite deletar se for o único número
                                >
                                    Remover
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={addTelefone}>
                            Adicionar Telefone Celular
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Telefone Residencial"
                            name="telefoneResidencial"
                            type="text"
                            value={formatarTelefone(dados.telefoneResidencial)}
                            onChange={handleChange}
                            inputProps={{ maxLength: 15 }}
                            required
                            fullWidth
                        />
                    </Grid>
                    {/* {dados.recado === false ? dados.descrevParentesco=dados.descrevParentesco : dados.descrevParentesco=''} */}
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="recado"
                                    checked={dados.recado}
                                    onChange={handleChange}
                                />
                            }
                            label="Telefone para Recado?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} visibility={dados.recado ? "visible" : "collapse"}>
                        <TextField
                            label="Telefone para Recado"
                            name="telefoneRecado"
                            type="text"
                            value={formatarTelefone(dados.telefoneRecado)}
                            onChange={handleChange}
                            inputProps={{ maxLength: 15 }}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} visibility={dados.recado ? "visible" : "collapse"}>
                        <TextField
                            label="Nome da Pessoa para Recado"
                            name="nomeRecado"
                            value={dados.nomeRecado}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} visibility={dados.recado ? "visible" : "collapse"}>
                        <FormControl fullWidth required>
                            <InputLabel id="parentesco-label"
                                sx={{ backgroundColor: 'white', padding: '0 4px' }}
                            >Relação de Parentesco</InputLabel>
                            <Select
                                labelId="parentesco-label"
                                name="parentesco"
                                value={dados.parentesco}
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Selecione uma opção</em>
                                </MenuItem>
                                <MenuItem value="conjuge_campanheiro">Cônjuge/Campanheiro</MenuItem>
                                <MenuItem value="filha">Filha</MenuItem>
                                <MenuItem value="filho">Filho</MenuItem>
                                <MenuItem value="enteada">Enteada</MenuItem>
                                <MenuItem value="enteado">Enteado</MenuItem>
                                <MenuItem value="irma">Irmã</MenuItem>
                                <MenuItem value="irmao">Irmão</MenuItem>
                                <MenuItem value="mae">Mãe</MenuItem>
                                <MenuItem value="pai">Pai</MenuItem>
                                <MenuItem value="sogra">Sogra</MenuItem>
                                <MenuItem value="sogro">Sogro</MenuItem>
                                <MenuItem value="neta">Neta</MenuItem>
                                <MenuItem value="neto">Neto</MenuItem>
                                <MenuItem value="Nora">Nora</MenuItem>
                                <MenuItem value="genro">Genro</MenuItem>
                                <MenuItem value="madrasta">Madrasta</MenuItem>
                                <MenuItem value="Padrasto">Padrasto</MenuItem>
                                <MenuItem value="sobrinha">Sobrinha</MenuItem>
                                <MenuItem value="sobrinho">Sobrinho</MenuItem>
                                <MenuItem value="sem_relacao">Sem Relação de Parentesco</MenuItem>
                                <MenuItem value="nao_sabe">Não Sabe Informar</MenuItem>
                                <MenuItem value="outro">Outra Relação de Parentesco</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} visibility={dados.parentesco === "outro" ? "visible" : "collapse"}>
                        <TextField
                            label="Descreva o parentesco"
                            name="escrevParentesco"
                            value={dados.escrevParentesco}
                            onChange={handleChange}
                            // className="form-field"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Telefone Comercial"
                            name="telefoneComercial"
                            type="text"
                            value={formatarTelefone(dados.telefoneComercial)}
                            onChange={handleChange}
                            inputProps={{ maxLength: 15 }}
                            disabled={dados.naoSabeTelefoneComercial}
                            required
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="naoSabeTelefoneComercial"
                                    checked={dados.naoSabeTelefoneComercial}
                                    onChange={handleChange}
                                />
                            }
                            label="Não se aplica"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={dados.email}
                            onChange={handleChange}
                            disabled={dados.naoSabeEmail}
                            required
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="naoSabeEmail"
                                    checked={dados.naoSabeEmail}
                                    onChange={handleChange}
                                />
                            }
                            label="Não se aplica"
                        />
                    </Grid>
                </Grid>
                <br />
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                    >
                        Salvar
                    </Button>
                </Grid>
            </Collapse>
        </>
    );
};

export default InfoContatoForm;
