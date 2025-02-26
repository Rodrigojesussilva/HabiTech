import { Typography, Grid, TextField, Button, Checkbox, FormControlLabel, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import IdentUnidadeForm from "../components/FormsSelagem/IdentUnidade.form";
import IdentUnidadeEnd from "../components/FormsSelagem/IdentUnidadeEnd.form";
import SituUsoUniForm from "../components/FormsSelagem/SituUsoUni.form";
import CaractUnidaForm from "../components/FormsSelagem/CaractUnida.form";
import CaractInfraUrbTerriUnidaForm from "../components/FormsSelagem/CaractInfraUrbTerriUnida.form";
import OutrasInfosForm from "../components/FormsSelagem/OutrasInfos.form";
import StatusNotasForm from "../components/FormsSelagem/StatusNotas.form";
import AnexosComponent from "../components/FormsSelagem/Anexos.form";
import axios from "axios";
import { URLs } from "../env";

const Selagem = () => {
  const [formData, setFormData] = useState({
    questionario: '',
    seiNumber: '',
    seiNumberNotApplicable: false,
    interviewerName: localStorage.getItem('username') || '',
    interviewDate: '',
    startTime: '',
    endTime: '',
    firstVisit: '',
    secondVisit: '',
    thirdVisit: '',
    timeElapsed: '',
    moradorAusente: false,
  });
  const [showUnidadeGroup, setShowUnidadeGroup] = useState(true);
  const [showCaractUnidInfra, setShowCaractUnidInfra] = useState(true);
  const [idForm, setidForm] = useState('');
  const [startForms, setStartForms] = useState(false);



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
    if ((!formData.seiNumber && !formData.seiNumberNotApplicable) || !formData.interviewerName) {
      alert('Os campos: "N° SEI" e "Nome completo da(o) Entrevistador(a)", devem estar preenchidos.');
      return;
    }
    // Faz uma requisição para obter o último questionário
    const response = await axios.get(`${URLs.DEV}/selagem-last`);

    const questionarios = response.data.questionario;

    const [numeroAtual,] = questionarios.split('/');

    const year = new Date().getFullYear();
    const novoNumero = parseInt(numeroAtual) + 1;
    const questionarioAtualizado = `${novoNumero}/${year}`;

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

    // Atualiza o estado
    setFormData(updatedFormData);

    // Salva os dados no endpoint
    try {
      const response = await axios.post(`${URLs.DEV}/selagem/`, updatedFormData);
      setidForm(response.data.id)
      setStartForms(!startForms)
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
      const response = await axios.put(`${URLs.DEV}/selagem/${idForm}`, updatedFormData);
      if (response.status === 200) {
        alert('Formulário encerrado com sucesso!');
        window.location.reload();
      }
    } catch (error) {
      formData.endTime = '';
      formData.timeElapsed = ' ';
      alert('Formulário não pode ser encerrado.');
      console.error('Erro ao encerrar o formulário:', error);
      window.location.reload();
    }
  };

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    console.log("name:", name);
    if (name === 'moradorAusente') {
      setFormData((prevState) => ({
        ...prevState,
        moradorAusente: checked, // Atualiza a propriedade moradorAusente
      }));
      setShowUnidadeGroup(!checked); // Se você ainda precisar alternar showUnidadeGroup
    } else if (name === 'seiNumberNotApplicable') {
      setFormData((prevState) => ({
        ...prevState,
        seiNumberNotApplicable: checked, // Atualiza a propriedade moradorAusente
      }));
    }
  };

  const handleShowCaractUnidInfra = (show: boolean) => {
    setShowCaractUnidInfra(show);
  }

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


  return (
    <form>
      <Typography variant="h4" gutterBottom>
        Informações para selagem
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
            className="form-field read-only-field" // Aplicando estilo
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Nº SEI"
            name="seiNumber"
            disabled={formData.seiNumberNotApplicable}
            value={formData.seiNumber}
            onChange={(e) => setFormData({ ...formData, seiNumber: e.target.value })}
            className="form-field"
            fullWidth
            required={!formData.seiNumberNotApplicable}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="seiNumberNotApplicable"
                checked={formData.seiNumberNotApplicable}
                onChange={(e) => {
                  handleCheckboxChange(e);
                  if (e.target.checked) {
                    setFormData(prevState => ({
                      ...prevState,
                      seiNumber: '',
                    }));
                  }
                }}
              />
            }
            label="Não se aplica"
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
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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

        <Grid item xs={6} >
          <FormControlLabel
            control={
              <Checkbox
                name="moradorAusente"
                checked={formData.moradorAusente}
                onChange={handleCheckboxChange}
              />
            }
            label="Morador ausente (itens 3, 3.1 e 3.2 serão desabilitados)"
          />
        </Grid>
        <Grid item xs={6} >
          <FormControlLabel
            control={
              <Checkbox
                name="moradorAusente"
                checked={formData.moradorAusente}
                onChange={handleCheckboxChange}
              />
            }
            label="Morador recusou (itens 3, 3.1 e 3.2 serão desabilitados)"
          />
        </Grid>
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
            <IdentUnidadeForm id={idForm} />
            <IdentUnidadeEnd id={idForm} />
            <Collapse in={showUnidadeGroup}>
              <SituUsoUniForm id={idForm} handleShowCaractUnidInfra={handleShowCaractUnidInfra} />
              {showCaractUnidInfra && (
                <>
                  <CaractUnidaForm id={idForm} />
                  <CaractInfraUrbTerriUnidaForm id={idForm} />
                </>)}
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
    </form>
  );
};
export default Selagem;