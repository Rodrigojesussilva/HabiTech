import React, { useEffect, useState } from 'react';
import { TextField, FormControlLabel, Button, Typography, Grid, Radio, RadioGroup, FormControl, FormLabel, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import IdentUnidadeForm from "../components/FormsSelagem/IdentUnidade.form";
import IdentUnidadeEnd from "../components/FormsSelagem/IdentUnidadeEnd.form";
import SituUsoUniForm from "../components/FormsArrolamento/SituUsoUni.form";
import SituUsoUniFormSelagem from "../components/FormsSelagem/SituUsoUni.form";
import CaractUnidaForm from "../components/FormsSelagem/CaractUnida.form";
import CaractInfraUrbTerriUnidaForm from "../components/FormsSelagem/CaractInfraUrbTerriUnida.form";
import OutrasInfosForm from "../components/FormsArrolamento/OutrasInfos.form";
import OutrasInfosFormSelagem from "../components/FormsSelagem/OutrasInfos.form";
import StatusNotasForm from "../components/FormsArrolamento/StatusNotas.form";
import StatusNotasFormSelagem from "../components/FormsSelagem/StatusNotas.form";
import InfoContatoForm from '../components/FormsArrolamento/InfoContato.form';
import DocForm from '../components/FormsArrolamento/Docs.form';
import IdentEtiRacGeneform from '../components/FormsArrolamento/IdentEtiRacGene.form';
import NupcidadeForm from '../components/FormsArrolamento/Nupcidade.form';
import PessoaDefForm from '../components/FormsArrolamento/PessoaDef.form';
import InfoFamiliaForm from '../components/FormsArrolamento/InfoFamilia.form';
import AnexosComponent from '../components/FormsSelagem/Anexos.form';
import AnexosComponentArrolamento from '../components/FormsArrolamento/Anexos.form';
import { URLs } from '../env';
import IdentRespForm from '../components/FormsArrolamento/IdentResp.form';

const SearchForms = () => {
  const [formData, setFormData] = useState({
    numeroFormulario: '',
    nomeEntrevistador: localStorage.getItem('username'),
    statusIncompleta: ''
  });

  const [formType, setFormType] = useState(''); // 'selagem' or 'arrolamento'
  const [formTypeSearch, setFormTypeSearch] = useState(''); // 'selagem' or 'arrolamento'
  const [idForm, setidForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<any>();
  const [error, setError] = useState('');
  const [showCaractUnidInfra, setShowCaractUnidInfra] = useState(true);
  const [showSectsResp, setShowSectsResp] = useState(true);


  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    const idFormData = localStorage.getItem('id');
    const formNumber = localStorage.getItem('formNumber');
    const arrolamento = localStorage.getItem('arrolamento');
    const selagem = localStorage.getItem('selagem');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    if (idFormData) {
      setidForm(JSON.parse(idFormData));
    }

    if (formNumber) {
      formData.numeroFormulario = formNumber
    }
    if (arrolamento) {
      setFormType("arrolamento")
    }
    if (selagem) {
      setFormType("selagem")
    }

    // Limpar apenas as chaves específicas, sem afetar o 'username'
    localStorage.removeItem('formData');
    localStorage.removeItem('id');
    localStorage.removeItem('arrolamento');
    localStorage.removeItem('formNumber');
    localStorage.removeItem('selagem');
  }, [formData]);

  // useEffect(() => {
  //   localStorage.removeItem('idade')
  // }, [])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFormTypeChange = (e: any) => {
    setFormType(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const requestBody = {
        numeroFormulario: formData.numeroFormulario,
        nomeEntrevistador: formData.nomeEntrevistador,
        statusIncompleta: formData.statusIncompleta,
        tipoFormulario: formType, // 'selagem' ou 'arrolamento'
      };
      if (formType === 'arrolamento') {
        const response = await axios.get(`${URLs.DEV}/busca/arrolamento/`, {
          params: requestBody,
        });
        // Verificando a resposta da API
        if (response.data && response.data) {
          setResultados(response.data);
          setidForm(response.data.arrolamento.id)
        }
      } else {
        const response = await axios.get(`${URLs.DEV}/busca/selagem/`, {
          params: requestBody,
        });
        // Verificando a resposta da API
        if (response.data && response.data) {
          setResultados(response.data);
          setidForm(response.data.selagem.id)
        }
      }
      setFormTypeSearch(formType);
      setFormType('')
    } catch (error) {
      setError('Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };
  const handleShowCaractUnidInfra = (show: boolean) => {
    setShowCaractUnidInfra(show);
  }
  const handleShowSectsResp = (show: boolean) => {
    setShowSectsResp(show)
  }
  return (
    <>
      <Typography variant="h6" gutterBottom>
        BUSCAR FORMULÁRIOS
      </Typography>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel id="situacao-label"
            sx={{ backgroundColor: 'white', padding: '0 4px' }}
          >Status do Formulário</InputLabel>
          <Select
            labelId="situacao-label"
            name="statusIncompleta"
            value={formData.statusIncompleta}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Selecione uma opção</em>
            </MenuItem>
            <MenuItem value="concluida">Concluida</MenuItem>
            <MenuItem value="incompleta">Incompleta</MenuItem>
            <MenuItem value="morador ausente">Morador Ausente</MenuItem>
            <MenuItem value="recusa">Recusa</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Número do formulário"
            name="numeroFormulario"
            value={formData.numeroFormulario}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome do Entrevistador"
            name="nomeEntrevistador"
            value={formData.nomeEntrevistador}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Escolha o tipo de formulário</FormLabel>
            <RadioGroup row value={formType} onChange={handleFormTypeChange}>
              <FormControlLabel value="selagem" control={<Radio />} label="Selagem" />
              <FormControlLabel value="arrolamento" control={<Radio />} label="Arrolamento" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginTop: '20px', width: '10%' }}
      >
        {formTypeSearch ? 'Limpar🧹' : 'Buscar🔎'}
      </Button>

      {loading && <Typography variant="subtitle1">Carregando...</Typography>}
      {error && <Typography variant="subtitle1" color="error">{error}</Typography>}

      {resultados && (
        <Grid container spacing={2} style={{ marginTop: '10px' }}>
          <Grid item xs={12}>
            {formTypeSearch === 'selagem' && (
              <>
                <IdentUnidadeForm
                  id={idForm}
                  identificacaoSeloComplemento={resultados.identidades?.[0]?.identificacaoSeloComplemento}
                  identificacaoSeloLote={resultados.identidades?.[0]?.identificacaoSeloLote}
                  identificacaoSeloSetor={resultados.identidades?.[0]?.identificacaoSeloSetor}
                  identificacaoSeloUnidade={resultados.identidades?.[0]?.identificacaoSeloUnidade}
                  idLocal={resultados.identidades?.[0]?.id}
                  nomeEspacoHabitado={resultados.identidades?.[0]?.nomeEspacoHabitado}
                  numeroSelo={resultados.identidades?.[0]?.numeroSelo}
                />
                <IdentUnidadeEnd
                  id={idForm}
                  bairro={resultados.identidades_end2?.[0]?.bairro}
                  cep={resultados.identidades_end2?.[0]?.cep}
                  cidade={resultados.identidades_end2?.[0]?.cidade}
                  complemento={resultados.identidades_end2?.[0]?.complemento}
                  distrito={resultados.identidades_end2?.[0]?.distrito}
                  idLocal={resultados.identidades_end2?.[0]?.id}
                  logradouro={resultados.identidades_end2?.[0]?.logradouro}
                  numero={resultados.identidades_end2?.[0]?.numero}
                  subprefeitura={resultados.identidades_end2?.[0]?.subprefeitura}
                  uf={resultados.identidades_end2?.[0]?.uf}
                />
                <SituUsoUniFormSelagem
                  id={idForm}
                  idLocal={resultados.situ_uso_uni3?.[0]?.id}
                  situacao={resultados.situ_uso_uni3?.[0]?.situacao}
                  uso={resultados.situ_uso_uni3?.[0]?.uso}
                  usoNaoIdentificado={resultados.situ_uso_uni3?.[0]?.usoNaoIdentificado}
                  quaisTipos={resultados.situ_uso_uni3?.[0]?.quaisTipos}
                  qualUso={resultados.situ_uso_uni3?.[0]?.qualUso}
                  nomeResponsavel={resultados.situ_uso_uni3?.[0]?.nomeResponsavel}
                  telefoneResponsavel={resultados.situ_uso_uni3?.[0]?.telefoneResponsavel}
                  responsavelIdentificado={resultados.situ_uso_uni3?.[0]?.responsavelIdentificado}
                  usoTerreno={resultados.situ_uso_uni3?.[0]?.usoTerreno}
                  handleShowCaractUnidInfra={handleShowCaractUnidInfra}
                />
                {showCaractUnidInfra && (
                  <>
                    <CaractUnidaForm
                      id={idForm}
                      banheiroCompartilhado={resultados.caract_uni4?.[0]?.banheiroCompartilhado}
                      cozinhaCompartilhada={resultados.caract_uni4?.[0]?.cozinhaCompartilhada}
                      idLocal={resultados.caract_uni4?.[0]?.id}
                      numComodos={resultados.caract_uni4?.[0]?.numComodos}
                      numPavimentos={resultados.caract_uni4?.[0]?.numPavimentos}
                      numSanitarios={resultados.caract_uni4?.[0]?.numSanitarios}
                      selagem_id={resultados.caract_uni4?.[0]?.selagem_id}
                      tempoMoradiaAnos={resultados.caract_uni4?.[0]?.tempoMoradiaAnos}
                      tempoMoradiaMeses={resultados.caract_uni4?.[0]?.tempoMoradiaMeses}
                      usoNaoIdentificado={resultados.caract_uni4?.[0]?.usoNaoIdentificado}
                      tempoMoradiaNaoSabe={resultados.caract_uni4?.[0]?.tempoMoradiaNaoSabe}
                    />
                    <CaractInfraUrbTerriUnidaForm
                      id={idForm}
                      abastecimentoAgua={resultados.carac_infra_urb_terri_uni5?.[0]?.abastecimentoAgua}
                      banheiro={resultados.carac_infra_urb_terri_uni5?.[0]?.banheiro}
                      cozinha={resultados.carac_infra_urb_terri_uni5?.[0]?.cozinha}
                      demaisComodos={resultados.carac_infra_urb_terri_uni5?.[0]?.demaisComodos}
                      descBanheiro={resultados.carac_infra_urb_terri_uni5?.[0]?.descBanheiro}
                      descCozinha={resultados.carac_infra_urb_terri_uni5?.[0]?.descCozinha}
                      descDemiasComodos={resultados.carac_infra_urb_terri_uni5?.[0]?.descDemiasComodos}
                      descInfultMofo={resultados.carac_infra_urb_terri_uni5?.[0]?.descInfultMofo}
                      descLigaEletri={resultados.carac_infra_urb_terri_uni5?.[0]?.descLigaEletri}
                      descMaterial={resultados.carac_infra_urb_terri_uni5?.[0]?.descMaterial}
                      descPeDireito={resultados.carac_infra_urb_terri_uni5?.[0]?.descPeDireito}
                      destinoDomestico={resultados.carac_infra_urb_terri_uni5?.[0]?.destinoDomestico}
                      destinoOrganico={resultados.carac_infra_urb_terri_uni5?.[0]?.destinoOrganico}
                      destinoReciclavel={resultados.carac_infra_urb_terri_uni5?.[0]?.destinoReciclavel}
                      esgotamentoSanitario={resultados.carac_infra_urb_terri_uni5?.[0]?.esgotamentoSanitario}
                      idLocal={resultados.carac_infra_urb_terri_uni5?.[0]?.id}
                      iluminacaoNatural={resultados.carac_infra_urb_terri_uni5?.[0]?.iluminacaoNatural}
                      infultracaoMofo={resultados.carac_infra_urb_terri_uni5?.[0]?.infultracaoMofo}
                      janelasExternas={resultados.carac_infra_urb_terri_uni5?.[0]?.janelasExternas}
                      ligacaoEletrica={resultados.carac_infra_urb_terri_uni5?.[0]?.ligacaoEletrica}
                      materialParede={resultados.carac_infra_urb_terri_uni5?.[0]?.materialParede}
                      outroAbasteAgua={resultados.carac_infra_urb_terri_uni5?.[0]?.outroAbasteAgua}
                      outroDestinoDomestico={resultados.carac_infra_urb_terri_uni5?.[0]?.outroDestinoDomestico}
                      outroDestinoOrganico={resultados.carac_infra_urb_terri_uni5?.[0]?.outroDestinoOrganico}
                      outroDestinoReciclavel={resultados.carac_infra_urb_terri_uni5?.[0]?.outroDestinoReciclavel}
                      outroEsgoto={resultados.carac_infra_urb_terri_uni5?.[0]?.outroEsgoto}
                      peDireito={resultados.carac_infra_urb_terri_uni5?.[0]?.peDireito}
                      separaResiduos={resultados.carac_infra_urb_terri_uni5?.[0]?.separaResiduos}
                      temInsalubridade={resultados.carac_infra_urb_terri_uni5?.[0]?.temInsalubridade}
                    />
                  </>)}
                <OutrasInfosFormSelagem
                  id={idForm}
                  idLocalP={resultados.out_inf_rele6?.[0]?.id}
                  textoP={resultados.out_inf_rele6?.[0]?.texto}
                />
                <StatusNotasFormSelagem
                  id={idForm}
                  idLocal={resultados.status_notas7?.[0]?.id}
                  justificativa={resultados.status_notas7?.[0]?.justificativa}
                  nomeSupervisor={resultados.status_notas7?.[0]?.nomeSupervisor}
                  observacao={resultados.status_notas7?.[0]?.observacao}
                  status={resultados.status_notas7?.[0]?.status}
                />
                <AnexosComponent id={idForm} />
              </>
            )}
            {formTypeSearch === 'arrolamento' && (
              <>
                {Array.from({ length: resultados.arrolamento.numberFamilies }).map((_, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    Familia {resultados.identidades1?.[index]?.nomeCompleto}
                    <IdentRespForm
                      id={idForm}
                      idLocal={resultados.identidades1?.[index]?.id}
                      nomeCompleto={resultados.identidades1?.[index]?.nomeCompleto}
                      responsavel={resultados.identidades1?.[index]?.responsavel}
                      nomeSocial={resultados.identidades1?.[index]?.nomeSocial}
                      dataNascimento={resultados.identidades1?.[index]?.dataNascimento}
                      naoSeAplica={resultados.identidades1?.[index]?.naoSeAplica}
                      relacaoResponsavel={resultados.identidades1?.[index]?.relacaoResponsavel}
                      nomeCompletoEntrevistado={resultados.identidades1?.[index]?.nomeCompletoEntrevistado}
                      nomeSocialEntrevistado={resultados.identidades1?.[index]?.nomeSocialEntrevistado}
                      naoSeAplicaEntrevistado={resultados.identidades1?.[index]?.naoSeAplicaEntrevistado}
                      idade={resultados.identidades1?.[index]?.idade}
                      DescrevParentesco={resultados.identidades1?.[index]?.DescrevParentesco}
                      handleShowSectsResp={handleShowSectsResp}
                    />
                    <InfoContatoForm
                      id={idForm}
                      email={resultados.identidades_end2?.[index]?.email}
                      escrevParentesco={resultados.identidades_end2?.[index]?.escrevParentesco}
                      idLocal={resultados.identidades_end2?.[index]?.id}
                      naoSabeEmail={resultados.identidades_end2?.[index]?.naoSabeEmail}
                      naoSabeTelefoneComercial={resultados.identidades_end2?.[index]?.naoSabeTelefoneComercial}
                      nomeRecado={resultados.identidades_end2?.[index]?.nomeRecado}
                      parentesco={resultados.identidades_end2?.[index]?.parentesco}
                      recado={resultados.identidades_end2?.[index]?.recado}
                      telefoneComercial={resultados.identidades_end2?.[index]?.telefoneComercial}
                      telefoneRecado={resultados.identidades_end2?.[index]?.telefoneRecado}
                      telefoneResidencial={resultados.identidades_end2?.[index]?.telefoneResidencial}
                    />
                    {showSectsResp && (
                      <>
                        <DocForm
                          id={idForm}
                          cidade={resultados.caract_uni4?.[index]?.cidade}
                          cpf={resultados.caract_uni4?.[index]?.cpf}
                          dataExpedicaoRg={resultados.caract_uni4?.[index]?.dataExpedicaoRg}
                          documentacao={resultados.caract_uni4?.[index]?.documentacao}
                          estadoEmissaoRg={resultados.caract_uni4?.[index]?.estadoEmissaoRg}
                          fonteCpf={resultados.caract_uni4?.[index]?.fonteCpf}
                          fonteRg={resultados.caract_uni4?.[index]?.fonteRg}
                          idLocal={resultados.caract_uni4?.[index]?.id}
                          numeroCrnm={resultados.caract_uni4?.[index]?.numeroCrnm}
                          numeroPassaporte={resultados.caract_uni4?.[index]?.numeroPassaporte}
                          numeroProtocolo={resultados.caract_uni4?.[index]?.numeroProtocolo}
                          numeroRnm={resultados.caract_uni4?.[index]?.numeroRnm}
                          orgaoExpedidor={resultados.caract_uni4?.[index]?.orgaoExpedidor}
                          paisOrigem={resultados.caract_uni4?.[index]?.paisOrigem}
                          rg={resultados.caract_uni4?.[index]?.rg}
                          statusCrnm={resultados.caract_uni4?.[index]?.statusCrnm}
                          statusRnm={resultados.caract_uni4?.[index]?.statusRnm}
                          uf={resultados.caract_uni4?.[index]?.uf}
                        />
                        <SituUsoUniForm
                          id={idForm}
                          idLocal={resultados.situ_uso_uni3?.[index]?.id}
                          contato_proprietario={resultados.situ_uso_uni3?.[index]?.contato_proprietario}
                          contrato_locacao={resultados.situ_uso_uni3?.[index]?.contrato_locacao}
                          nome_proprietario={resultados.situ_uso_uni3?.[index]?.nome_proprietario}
                          nsi_contato_proprietario={resultados.situ_uso_uni3?.[index]?.nsi_contato_proprietario}
                          nsi_valor_locacao={resultados.situ_uso_uni3?.[index]?.nsi_valor_locacao}
                          cozinhaCompartilhada={resultados.situ_uso_uni3?.[index]?.cozinhaCompartilhada}
                          banheiroCompartilhado={resultados.situ_uso_uni3?.[index]?.banheiroCompartilhado}
                          separaResiduos={resultados.situ_uso_uni3?.[index]?.separaResiduos}
                          destinoReciclavel={resultados.situ_uso_uni3?.[index]?.destinoReciclavel}
                          outroDestinoReciclavel={resultados.situ_uso_uni3?.[index]?.outroDestinoReciclavel}
                          destinoOrganico={resultados.situ_uso_uni3?.[index]?.destinoOrganico}
                          outroDestinoOrganico={resultados.situ_uso_uni3?.[index]?.outroDestinoOrganico}
                          destinoDomestico={resultados.situ_uso_uni3?.[index]?.destinoDomestico}
                          outroDestinoDomestico={resultados.situ_uso_uni3?.[index]?.outroDestinoDomestico}
                          regime_ocupacao={resultados.situ_uso_uni3?.[index]?.regime_ocupacao}
                          valor_locacao={resultados.situ_uso_uni3?.[index]?.valor_locacao}
                        />
                        <IdentEtiRacGeneform
                          id={idForm}
                          etnicoRacial={resultados.carac_infra_urb_terri_uni5?.[index]?.etnicoRacial}
                          genero={resultados.carac_infra_urb_terri_uni5?.[index]?.genero}
                          generoOutro={resultados.carac_infra_urb_terri_uni5?.[index]?.generoOutro}
                          idLocal={resultados.carac_infra_urb_terri_uni5?.[index]?.id}
                        />
                        <NupcidadeForm
                          id={idForm}
                          idLocal={resultados.out_inf_rele6?.[index]?.id}
                          estadoCivil={resultados.out_inf_rele6?.[index]?.estadoCivil}
                          nomeCompanheiro={resultados.out_inf_rele6?.[index]?.nomeCompanheiro}
                          viveComCompanheiro={resultados.out_inf_rele6?.[index]?.viveComCompanheiro}
                        />
                        <PessoaDefForm
                          id={idForm}
                          idLocal={resultados.status_notas7?.[index]?.id}
                          qtdPessoasComDefFam={resultados.status_notas7?.[index]?.qtdPessoasComDefFam}
                          temPessoaDeficienciaFam={resultados.status_notas7?.[index]?.temPessoaDeficienciaFam}
                          deficienciaEspecifica={resultados.status_notas7?.[index]?.deficienciaEspecifica}
                          responsavelPossuiLaudo={resultados.status_notas7?.[index]?.responsavelPossuiLaudo}
                          tecnologiaEspecifica={resultados.status_notas7?.[index]?.tecnologiaEspecifica}
                          tecnologiasAssistivas={resultados.status_notas7?.[index]?.tecnologiasAssistivas}
                          responsavelTemDeficiencia={resultados.status_notas7?.[index]?.responsavelTemDeficiencia}
                          tiposDeficiencia={resultados.status_notas7?.[index]?.tiposDeficiencia}
                          utilizaTecnologiaAssistida={resultados.status_notas7?.[index]?.utilizaTecnologiaAssistida}
                        />
                        <InfoFamiliaForm
                          id={idForm}
                          idLocal={resultados.InfoFamilia8?.[index]?.id}
                          adolescentes12a18={resultados.InfoFamilia8?.[index]?.adolescentes12a18}
                          adultos19a59={resultados.InfoFamilia8?.[index]?.adultos19a59}
                          criancas0a3={resultados.InfoFamilia8?.[index]?.criancas0a3}
                          criancas4a6={resultados.InfoFamilia8?.[index]?.criancas4a6}
                          criancas7a11={resultados.InfoFamilia8?.[index]?.criancas7a11}
                          gestantes={resultados.InfoFamilia8?.[index]?.gestantes}
                          idosos60={resultados.InfoFamilia8?.[index]?.idosos60}
                          nacionalidadesSelecionadas={resultados.InfoFamilia8?.[index]?.nacionalidadesSelecionadas}
                          naoSabeInformar={resultados.InfoFamilia8?.[index]?.naoSabeInformar}
                          naoTemInformacao={resultados.InfoFamilia8?.[index]?.naoTemInformacao}
                          numerosPorDef={resultados.InfoFamilia8?.[index]?.numerosPorDef}
                          numerosPorPais={resultados.InfoFamilia8?.[index]?.numerosPorPais}
                          pessoasComDeficiencia={resultados.InfoFamilia8?.[index]?.pessoasComDeficiencia}
                          pessoasComDoencasCronicas={resultados.InfoFamilia8?.[index]?.pessoasComDoencasCronicas}
                          pessoasImigrantes={resultados.InfoFamilia8?.[index]?.pessoasImigrantes}
                          quantidadePessoasUsaTecAssis={resultados.InfoFamilia8?.[index]?.quantidadePessoasUsaTecAssis}
                          rendaFamiliar={resultados.InfoFamilia8?.[index]?.rendaFamiliar}
                          tecnologiaEspecifica={resultados.InfoFamilia8?.[index]?.tecnologiaEspecifica}
                          tecnologiasAssistivas={resultados.InfoFamilia8?.[index]?.tecnologiasAssistivas}
                          totalPessoas={resultados.InfoFamilia8?.[index]?.totalPessoas}
                          usaTecnologiaAssistiva={resultados.InfoFamilia8?.[index]?.usaTecnologiaAssistiva}
                        />
                      </>)
                    }

                    <OutrasInfosForm
                      id={idForm}
                      idLocalP={resultados.OutrasInfos9?.[index]?.id}
                      textoP={resultados.OutrasInfos9?.[index]?.texto}
                    />
                    <StatusNotasForm
                      id={idForm}
                      idLocal={resultados.StatusNotas10?.[index]?.id}
                      justificativa={resultados.StatusNotas10?.[index]?.justificativa}
                      nomeSupervisor={resultados.StatusNotas10?.[index]?.nomeSupervisor}
                      observacao={resultados.StatusNotas10?.[index]?.observacao}
                      status={resultados.StatusNotas10?.[index]?.status}
                    />
                    <AnexosComponentArrolamento id={idForm} />
                    ____________________________________________________________________________________________________________________
                    <br />
                  </div>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default SearchForms;
