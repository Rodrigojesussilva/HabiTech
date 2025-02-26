import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Collapse } from '@mui/material';
import axios from 'axios';
import { URLs } from '../../env';

interface Anexo {
    id: number;
    nome: string;
    base64: string | null;
}

const AnexosComponent: React.FC<{ id: string }> = ({ id }) => {
    // Estado para armazenar os blocos de anexos (RG, CPF, etc.)
    const [anexos, setAnexos] = useState<{ [key: string]: Anexo[] }>({
        RG: [],
        CPF: [],
        Certidoes: [],
        CNH: [],
        Outros: [],
        RNM: [],
        CRNM: [],
        ProcRegNaciMigra: [],
        Passaport: [],
        Declaracoes: [],
        CertiInterdicaoTotal: [],
        CertiInterdicaoParcial: []
    });
    const [selagemId, setSelagemId] = useState('');
    const [ok, setOk] = useState(false);

    useEffect(() => {
        setSelagemId(id); // Atualiza selagemId sempre que o id mudar
      }, [id]);
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
console.log(id);

    // Função para adicionar um novo anexo em um bloco específico
    const handleAddAnexo = (tipoDocumento: string, base64: string, nomeArquivo: string) => {
        setAnexos((prev) => ({
            ...prev,
            [tipoDocumento]: [
                ...prev[tipoDocumento],
                { id: Date.now(), nome: nomeArquivo || 'Novo Documento', base64 }
            ]
        }));
    };

    // Função para renomear um anexo
    const handleRenameAnexo = (tipoDocumento: string, id: number, novoNome: string) => {
        setAnexos((prev) => ({
            ...prev,
            [tipoDocumento]: prev[tipoDocumento].map((anexo) =>
                anexo.id === id ? { ...anexo, nome: novoNome } : anexo
            )
        }));
    };

    // Função para remover um anexo
    const handleRemoveAnexo = (tipoDocumento: string, id: number) => {
        setAnexos((prev) => ({
            ...prev,
            [tipoDocumento]: prev[tipoDocumento].filter((anexo) => anexo.id !== id)
        }));
    };

    // Função para converter arquivo em base64
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Função para anexar fotos pela câmera (web)
    const handleCameraUpload = async (tipoDocumento: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'camera';
        input.onchange = async (event: any) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    const base64 = await convertFileToBase64(file);
                    handleAddAnexo(tipoDocumento, base64, file.name);
                } catch (error) {
                    console.error('Erro ao converter o arquivo para base64', error);
                }
            }
        };
        input.click();
    };

    // Função para anexar um arquivo selecionado
    const handleFileUpload = async (tipoDocumento: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpeg, .jpg, .png, .mp4, .avi, .mov, .mkv, .wmv, .flv, .webm, .doc, .docx, .xls, .xlsx, .csv, .ppt, .pptx, .pdf';  // Permitir apenas imagens
        input.onchange = async (event: any) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    const base64 = await convertFileToBase64(file);
                    handleAddAnexo(tipoDocumento, base64, file.name);
                } catch (error) {
                    console.error('Erro ao converter o arquivo para base64', error);
                }
            }
        };
        input.click();
    };
    // Função para enviar os anexos ao backend
    const handleEnviarAnexos = async () => {
        // Organizando os anexos no formato necessário para o backend
        const payload = {
            selagem_id: selagemId,  // Garantindo que o selagem_id esteja no payload
            anexos: Object.entries(anexos).map(([tipoDocumento, arquivos]) => ({
                tipoDocumento,
                arquivos: arquivos.map(anexo => ({
                    id: anexo.id,  // Incluir o ID do anexo
                    nome: anexo.nome,
                    base64: anexo.base64,
                }))
            }))
        };
    
        try {
            // await axios.post(`${URLs.DEV}/anexos-8-selagem/`, payload, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });
            setMostrarIdentificacao(!mostrarIdentificacao);
            setOk(!ok);
            alert('Dados salvos com sucesso!');
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
                {ok ? "✅- 6. ANEXOS" : "6. ANEXOS"}
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
                                 {/* Bloco de Anexos para Selo */}
                                 <Grid item xs={12}>
                                     <Typography variant="h6">Anexos - Selo</Typography>
                                     <Box sx={{ display: 'flex', gap: 2 }}>
                                         <Button variant="contained" onClick={() => handleFileUpload('CPF')}>Anexar Selo</Button>
                                         <Button variant="contained" onClick={() => handleCameraUpload('CPF')}>Câmera</Button>
                                     </Box>
             
                                     {anexos.CPF.map((anexo) => (
                                         <>
                                             <br />
                                             <Grid container key={anexo.id} spacing={2} alignItems="center">
                                                 <Grid item xs={10}>
                                                     <TextField
                                                         label="Nome do Documento"
                                                         value={anexo.nome}
                                                         onChange={(e) => handleRenameAnexo('CPF', anexo.id, e.target.value)}
                                                         fullWidth
                                                     />
                                                 </Grid>
                                                 <Grid item xs={2}>
                                                     <Button variant="outlined" color="error" onClick={() => handleRemoveAnexo('CPF', anexo.id)}>
                                                         Remover
                                                     </Button>
                                                 </Grid>
                                             </Grid>
                                         </>
                                     ))}
                                 </Grid>
             
                                 {/* Bloco de Anexos para Fachada */}
                                 <Grid item xs={12}>
                                     <Typography variant="h6">Anexos - Fachada</Typography>
                                     <Box sx={{ display: 'flex', gap: 2 }}>
                                         <Button variant="contained" onClick={() => handleFileUpload('Certidoes')}>Anexar Fachada</Button>
                                         <Button variant="contained" onClick={() => handleCameraUpload('Certidoes')}>Câmera</Button>
                                     </Box>
             
                                     {anexos.Certidoes.map((anexo) => (
                                         <>
                                             <br />
                                             <Grid container key={anexo.id} spacing={2} alignItems="center">
                                                 <Grid item xs={10}>
                                                     <TextField
                                                         label="Nome do Documento"
                                                         value={anexo.nome}
                                                         onChange={(e) => handleRenameAnexo('Certidoes', anexo.id, e.target.value)}
                                                         fullWidth
                                                     />
                                                 </Grid>
                                                 <Grid item xs={2}>
                                                     <Button variant="outlined" color="error" onClick={() => handleRemoveAnexo('Certidoes', anexo.id)}>
                                                         Remover
                                                     </Button>
                                                 </Grid>
                                             </Grid>
                                         </>
                                     ))}
                                 </Grid>
             
                                 {/* Bloco de Anexos para Morador */}
                                 <Grid item xs={12}>
                                     <Typography variant="h6">Anexos - Morador</Typography>
                                     <Box sx={{ display: 'flex', gap: 2 }}>
                                         <Button variant="contained" onClick={() => handleFileUpload('CNH')}>Anexar Morador</Button>
                                         <Button variant="contained" onClick={() => handleCameraUpload('CNH')}>Câmera</Button>
                                     </Box>
             
                                     {anexos.CNH.map((anexo) => (
                                         <>
                                             <br />
                                             <Grid container key={anexo.id} spacing={2} alignItems="center">
                                                 <Grid item xs={10}>
                                                     <TextField
                                                         label="Nome do Documento"
                                                         value={anexo.nome}
                                                         onChange={(e) => handleRenameAnexo('CNH', anexo.id, e.target.value)}
                                                         fullWidth
                                                     />
                                                 </Grid>
                                                 <Grid item xs={2}>
                                                     <Button variant="outlined" color="error" onClick={() => handleRemoveAnexo('CNH', anexo.id)}>
                                                         Remover
                                                     </Button>
                                                 </Grid>
                                             </Grid>
                                         </>
                                     ))}
                                 </Grid>
             
                                 {/* Bloco de Anexos para Outros */}
                                 <Grid item xs={12}>
                                     <Typography variant="h6">Anexos - Outros</Typography>
                                     <Box sx={{ display: 'flex', gap: 2 }}>
                                         <Button variant="contained" onClick={() => handleFileUpload('Outros')}>Anexar Outros</Button>
                                         <Button variant="contained" onClick={() => handleCameraUpload('Outros')}>Câmera</Button>
                                     </Box>
             
                                     {anexos.Outros.map((anexo) => (
                                         <>
                                             <br />
                                             <Grid container key={anexo.id} spacing={2} alignItems="center">
                                                 <Grid item xs={10}>
                                                     <TextField
                                                         label="Nome do Documento"
                                                         value={anexo.nome}
                                                         onChange={(e) => handleRenameAnexo('Outros', anexo.id, e.target.value)}
                                                         fullWidth
                                                     />
                                                 </Grid>
                                                 <Grid item xs={2}>
                                                     <Button variant="outlined" color="error" onClick={() => handleRemoveAnexo('Outros', anexo.id)}>
                                                         Remover
                                                     </Button>
                                                 </Grid>
                                             </Grid>
                                         </>
                                     ))}
                                 </Grid>
                      
                    <Grid item xs={12}>
___________________________________________________________________________________________________
                    </Grid>
                    {/* Botão para enviar todos os anexos */}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleEnviarAnexos}>
                            Enviar Anexos
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
___________________________________________________________________________________________________
                    </Grid>
                    <Grid item xs={12}></Grid>
                </Grid>
            </Collapse>
        </>
    );
};

export default AnexosComponent;
