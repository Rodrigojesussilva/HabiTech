import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Collapse, Checkbox, FormControlLabel } from '@mui/material';
import './styles/arrolamento.css';
import IdentRespForm from '../components/FormsArrolamento/IdentResp.form';
import InfoContatoForm from '../components/FormsArrolamento/InfoContato.form';
import SituUsoUniForm from '../components/FormsArrolamento/SituUsoUni.form';
import DocForm from '../components/FormsArrolamento/Docs.form';
import IdentEtiRacGeneform from '../components/FormsArrolamento/IdentEtiRacGene.form';
import NupcidadeForm from '../components/FormsArrolamento/Nupcidade.form';
import PessoaDefForm from '../components/FormsArrolamento/PessoaDef.form';
import InfoFamiliaForm from '../components/FormsArrolamento/InfoFamilia.form';
import OutrasInfosForm from '../components/FormsArrolamento/OutrasInfos.form';
import StatusNotasForm from '../components/FormsArrolamento/StatusNotas.form';
import AnexosComponent from '../components/FormsArrolamento/Anexos.form';
import axios from 'axios';
import { URLs } from "../env";


const ArrolamentoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    questionario: '',
    seiNumber: '',
    interviewerName: localStorage.getItem('username'),
    interviewDate: '',
    startTime: '',
    endTime: '',
    sealNumber: '',
    numberFamilies: 1,
    firstVisit: '',
    secondVisit: '',
    thirdVisit: '',
    timeElapsed: '',

  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [idForm, setidForm] = useState('');
  const [showSectsResp, setShowSectsResp] = useState(true);
  const [startForms, setStartForms] = useState(false);



  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    const idFormData = localStorage.getItem('id');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    if (idFormData) {
      setidForm(JSON.parse(idFormData));
    }

    // Limpar apenas as chaves específicas, sem afetar o 'username'
    localStorage.removeItem('formData');
    localStorage.removeItem('id');
  }, []);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`1970-01-01T${formData.startTime}:00`);
      const end = new Date(`1970-01-01T${formData.endTime}:00`);

      const difference = end.getTime() - start.getTime();
      if (difference >= 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setFormData((prevData) => ({
          ...prevData,
          timeElapsed: `${hours}h ${minutes}m`,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          timeElapsed: 'Horário inválido',
        }));
      }
    }
  }, [formData.startTime, formData.endTime]);


  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleStartForm = async () => {

    if (!formData.seiNumber || !formData.interviewerName || !formData.sealNumber) {
      alert('Ops! Todos os campos devem estar preenchidos.');
      return;
    }

    // Faz uma requisição para obter o último questionário
    const response = await axios.get(`${URLs.DEV}/arrolamento-last`);

    const questionarios = response.data.questionario;

    const [numeroAtual, ano] = questionarios.split('/');

    const novoNumero = parseInt(numeroAtual) + 1;
    const questionarioAtualizado = `${novoNumero}/${ano}`;

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();

    const updatedFormData = {
      ...formData,
      startTime: currentTime,
      interviewDate: currentDate,
      questionario: questionarioAtualizado, // Novo valor do questionário
      firstVisit: currentDate,
      timeElapsed: '',
      endTime: ''
    };

    setFormData(updatedFormData);
    setStartForms(true)
    try {
      const response = await axios.post(`${URLs.DEV}/arrolamento/`, updatedFormData);
      setidForm(response.data.id)
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }

  };

  const handleEndForm = async () => {
    const endTime = getCurrentTime();
    // Atualiza o estado com o novo endTime
    setFormData(prevState => {
      const start = new Date(`1970-01-01T${formData.startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);

      const difference = end.getTime() - start.getTime();
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const updatedFormData = {
        ...prevState,
        endTime: endTime,
        timeElapsed: `${hours}h ${minutes}m`,
      };

      // Agora que o estado foi atualizado, você pode enviar para o backend
      sendFormData(updatedFormData);
      return updatedFormData; // Retorna o estado atualizado
    });
  };

  const sendFormData = async (updatedFormData: any) => {
    try {
      // Envia a finalização do formulário para o backend com os dados atualizados
      const response = await axios.put(`${URLs.DEV}/arrolamento/${idForm}`, updatedFormData);
      if (response.status === 200) {
        alert('Formulário encerrado com sucesso!');
        if (formData.numberFamilies > 1) {
          setDialogOpen(true); // Abre o modal de confirmação
          // endTime: endTime,
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      formData.endTime = '';
      formData.timeElapsed = ' ';
      alert('Formulário não pode ser encerrado.');
      console.error('Erro ao encerrar o formulário:', error);
      window.location.reload();
    }
  };

  const handleCloseDialog = (response: boolean) => {
    setDialogOpen(false);

    if (response) {
      alert("Formulário Salvo. Digite os dados da nova Família");
      localStorage.setItem('formData', JSON.stringify(formData));
      localStorage.setItem('id', JSON.stringify(idForm));
      window.location.reload();
    } else {
      localStorage.setItem('formData', JSON.stringify(formData));
      localStorage.setItem('id', JSON.stringify(idForm));
      window.location.reload();
    }
  };
  const handleShowSectsResp = (show: boolean) => {
    setShowSectsResp(show)
  }

  return (
    <form>
      <Typography variant="h4" gutterBottom>
        Identificação das Famílias
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Questionário"
            name="questionario"
            value={formData.questionario ? `SEHAB-<${formData.questionario}>` : ""}
            InputProps={{
              readOnly: true,
            }}
            className="form-field read-only-field"
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Nº SEI"
            name="seiNumber"
            value={formData.seiNumber}
            onChange={(e) => setFormData({ ...formData, seiNumber: e.target.value })}
            className="form-field"
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome completo da(o) Entrevistador(a)"
            name="interviewerName"
            value={formData.interviewerName}
            onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
            className="form-field"
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Data da Entrevista"
            name="interviewDate"
            type="date"
            value={formData.interviewDate}
            InputProps={{
              readOnly: true,
            }}
            className="form-field read-only-field"
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Início"
            name="startTime"
            type="time"
            value={formData.startTime}
            InputProps={{
              readOnly: true,
            }}
            className="form-field read-only-field"
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Término"
            name="endTime"
            type="time"
            value={formData.endTime}
            InputProps={{
              readOnly: true,
            }}
            className="form-field read-only-field"
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Tempo da Entrevista"
            name="timeElapsed"
            value={formData.timeElapsed}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Digite o número do selo"
            name="sealNumber"
            value={formData.sealNumber}
            onChange={(e) => setFormData({ ...formData, sealNumber: e.target.value })}
            className="form-field"
            fullWidth
            required
            inputProps={{
              maxLength: 9, // Limita a digitação a 9 caractere
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Quantas familias nesse formulário?"
            name="numberFamilies"
            type="number"
            inputProps={{ min: 0 }}
            value={formData.numberFamilies}
            fullWidth
            required
            onChange={(e) => {
              const value = +e.target.value;
              if (value >= 0) {
                setFormData({ ...formData, numberFamilies: value });
              }
            }}
          />
        </Grid>
        <Grid item xs={6} >

        </Grid>
        <Grid item xs={9}></Grid>
        <Grid item xs={4}>
          <TextField
            label="Data da Primeira visita"
            name="firstVisit"
            type="date"
            value={formData.firstVisit}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setFormData({ ...formData, firstVisit: e.target.value })}
            className="form-field read-only-field"
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Data da Segunda visita"
            name="secondVisit"
            type="date"
            value={formData.secondVisit}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setFormData({ ...formData, secondVisit: e.target.value })}
            className="form-field read-only-field"
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Data da Terceira visita"
            name="thirdVisit"
            type="date"
            value={formData.thirdVisit}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setFormData({ ...formData, thirdVisit: e.target.value })}
            className="form-field read-only-field"
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className="button"
            onClick={handleStartForm}
          >
            Iniciar Formulário
          </Button>
        </Grid>
        <Collapse in={startForms}>
          {/* Formularios */}
          <Grid item xs={12}>
            <IdentRespForm id={idForm} handleShowSectsResp={handleShowSectsResp} />
            <InfoContatoForm id={idForm} />
            <Collapse in={showSectsResp}>
              <DocForm id={idForm} />
              <SituUsoUniForm id={idForm} />
              <IdentEtiRacGeneform id={idForm} />
              <NupcidadeForm id={idForm} />
              <PessoaDefForm id={idForm} />
              <InfoFamiliaForm id={idForm} tecnologiasAssistivas={[
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
              ]} />
            </Collapse>
            <OutrasInfosForm id={idForm} />
            <StatusNotasForm id={idForm} />
            <AnexosComponent id={idForm} />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              className="button"
              onClick={handleEndForm}
            >
              Finalizar Formulário
            </Button>
          </Grid>
        </Collapse>
      </Grid>
      {/* Dialog para questionamento */}
      <Dialog open={isDialogOpen} onClose={() => handleCloseDialog(false)}>
        <DialogTitle>Finalizar Cadastro</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja cadastrar outro formulário?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(true)} color="primary">
            Sim
          </Button>
          <Button onClick={() => handleCloseDialog(false)} color="secondary">
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default ArrolamentoForm;
