import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    getMergedFormSections
} from "@/components/forms/arrolamento/definitions/pessoaDef.definition";
// Import form section renderer
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "../../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../../service/constants"
interface PessoaDefFormProps {
    id?: string;
    sectionIndex?: number;
    familyIndex: number;
}


const PessoaDefForm = ({ sectionIndex: sectionNumber, familyIndex }: PessoaDefFormProps) => {
    const [mostrarIdentificacao, setMostrarIdentificacao] = useState(false);
    const [initialDate] = useState("")
    const [endDate] = useState("")
    const form = useFormContext();
    // Get form values for conditional logic
    const formValues = form.watch(`families[${familyIndex}]`) || {};

    // Get merged form sections with conditional fields included
    const formSections = getMergedFormSections(formValues);
    const temPessoaDeficienciaFam = form.watch(`families[${familyIndex}].temPessoaDeficienciaFam`);
    // Ou acessando item a item
    const aparelhoAuditivo = form.watch(`families[${familyIndex}].aparelhoAuditivo`);
    const bengalaBrancaOuVerdeVermelha = form.watch(`families[${familyIndex}].bengalaBrancaOuVerdeVermelha`);
    const brailleEquipSinteseVoz = form.watch(`families[${familyIndex}].brailleEquipSinteseVoz`);
    const cadeiraDeRoda = form.watch(`families[${familyIndex}].cadeiraRoda`);
    const camaHospitalar = form.watch(`families[${familyIndex}].camaHospitalar`);
    const caoGuia = form.watch(`families[${familyIndex}].caoGuia`);
    const defAuditiva = form.watch(`families[${familyIndex}].defAuditiva`);
    const defFisica = form.watch(`families[${familyIndex}].defFisica`);
    const defIntelectualMental = form.watch(`families[${familyIndex}].defIntelectualMental`);
    const defMobilidadeReduzida = form.watch(`families[${familyIndex}].defMobilidadeReduzida`);
    const defMultiplas = form.watch(`families[${familyIndex}].defMultiplas`);
    const defOutra = form.watch(`families[${familyIndex}].defOutra`);
    const defSurdo = form.watch(`families[${familyIndex}].defSurdoCegueira`);
    const defVisual = form.watch(`families[${familyIndex}].defVisual`);
    const especifiqueOutraDef = form.watch(`families[${familyIndex}].especifiqueOutras`);
    const especifiqueOutraTecAssistiva = form.watch(`families[${familyIndex}].especifiqueOutraTecAssistiva`);
    const leituraFacialLabial = form.watch(`families[${familyIndex}].leituraFacialLabial`);
    const libras = form.watch(`families[${familyIndex}].libras`);
    const lupaLenteFonteAmpliada = form.watch(`families[${familyIndex}].lupaLenteFontaAmpliada`);
    const muletaBengala4PontasAndador = form.watch(`families[${familyIndex}].muletaBengala4pontasAndador`);
    const orteseProtese = form.watch(`families[${familyIndex}].ortesesProteses`);
    const pranchaComunicacaoAlternativa = form.watch(`families[${familyIndex}].pranchaComunicacaoAlternativa`);

    const possuiLaudo = form.watch(`families[${familyIndex}].responsavelPossuiLaudo`);
    const qtdDefAuditiva = form.watch(`families[${familyIndex}].quantAuditiva`);
    const qtdDefFisica = form.watch(`families[${familyIndex}].quantFisica`);
    const qtdDefIntelectualMental = form.watch(`families[${familyIndex}].quantIntelectual`);
    const qtdDefMobilidadeReduzida = form.watch(`families[${familyIndex}].quantMobilidade`);
    const qtdDefMultiplas = form.watch(`families[${familyIndex}].quantMultiplas`);
    const qtdDefSurdo = form.watch(`families[${familyIndex}].quantSurdo`);
    const qtdDefVisual = form.watch(`families[${familyIndex}].quantVisual`);
    const qtdPessoasComDefFam = form.watch(`families[${familyIndex}].qtdPessoasComDefFam`);
    const responsavelAparelhoAuditivo = form.watch(`families[${familyIndex}].responsavelAparelhoAuditivo`);
    const responsavelBengalaBrancaOuVerdeVermelha = form.watch(`families[${familyIndex}].responsavelBnglBranOuVerdVerm`);
    const responsavelBrailleEquipSinteseVoz = form.watch(`families[${familyIndex}].responsavelBrailleEquipSinteseVoz`);
    const responsavelCadeiraDeRoda = form.watch(`families[${familyIndex}].responsavelCadeiraRoda`);
    const responsavelCamaHospitalar = form.watch(`families[${familyIndex}].responsavelCamaHospitalar`);
    const responsavelCaoGuia = form.watch(`families[${familyIndex}].responsavelCaoGuia`);
    const responsavelLeituraFacialLabial = form.watch(`families[${familyIndex}].responsavelLeituraFacialLabial`);
    const responsavelLibras = form.watch(`families[${familyIndex}].responsavelLibras`);
    const responsavelLupaLenteFonteAmpliada = form.watch(`families[${familyIndex}].responsavelLupaLenteFontaAmpliada`);
    const responsavelMuletaBengala4PontasAndador = form.watch(`families[${familyIndex}].responsavelMuletaBengala4pontasAndador`);
    const responsavelTemDeficiencia = form.watch(`families[${familyIndex}].responsavelTemDeficiencia`);
    const responsavelOrteseProtese = form.watch(`families[${familyIndex}].responsavelOrteseProtese`);
    const responsavelPranchaComAlt = form.watch(`families[${familyIndex}].responsavelPranchaComAlt`);
    const utilizaTecnologiaAssistida = form.watch(`families[${familyIndex}].tecnologiaAssistiva`);
    const outrasTecAssistiva = form.watch(`families[${familyIndex}].outrasTecAssistiva`);

    const responsavelDefFisica = form.watch(`families[${familyIndex}].responsavelDefFisica`);
    const responsavelDefAuditiva = form.watch(`families[${familyIndex}].responsavelDefAuditiva`);
    const responsavelDefIntelectual = form.watch(`families[${familyIndex}].responsavelDefIntelectual`);
    const responsavelDefMobilidade = form.watch(`families[${familyIndex}].responsavelDefMobilidade`);
    const responsavelDefMultipla = form.watch(`families[${familyIndex}].responsavelDefMultipla`);
    const responsavelDefOutra = form.watch(`families[${familyIndex}].responsavelDefOutra`);
    const responsavelDefSurdoCegueira = form.watch(`families[${familyIndex}].responsavelDefSurdoCegueira`);
    const responsavelDefVisual = form.watch(`families[${familyIndex}].responsavelDefVisual`);
    const responsavelOutraTecAssistiva = form.watch(`families[${familyIndex}].responsavelOutraTecAssistiva`);

    const triggeredByBlurRef = useRef(false);

    const prevValuesRef = useRef<Record<string, any>>({
        tem_deficiencia: temPessoaDeficienciaFam,
        qtdPessoasComDefFam: qtdPessoasComDefFam,
        responsavelTemDeficiencia: responsavelTemDeficiencia,
        possui_laudo: possuiLaudo,
        utiliza_tecnologia_assistida: utilizaTecnologiaAssistida,

        aparelho_auditivo: aparelhoAuditivo,
        bengala_branca_ou_verde_vermelha: bengalaBrancaOuVerdeVermelha,
        braille_equip_sintese_voz: brailleEquipSinteseVoz,
        cadeira_de_roda: cadeiraDeRoda,
        cama_hospitalar: camaHospitalar,
        cao_guia: caoGuia,
        def_auditiva: defAuditiva,
        def_fisica: defFisica,
        def_intelectual_mental: defIntelectualMental,
        def_mobilidade_reduzida: defMobilidadeReduzida,
        def_multiplas: defMultiplas,
        def_outra: defOutra,
        def_surdo: defSurdo,
        def_visual: defVisual,
        especifique_outra_def: especifiqueOutraDef,
        especifique_outra_tec_assistida: especifiqueOutraTecAssistiva,
        leitura_facial_labial: leituraFacialLabial,
        libras: libras,
        lupa_lente_fonte_ampliada: lupaLenteFonteAmpliada,
        muleta_bengala4pontas_andador: muletaBengala4PontasAndador,
        ortese_protese: orteseProtese,
        prancha_comunicacao_alternativa: pranchaComunicacaoAlternativa,

        qtd_def_auditiva: qtdDefAuditiva,
        qtd_def_fisica: qtdDefFisica,
        qtd_def_intelectual_mental: qtdDefIntelectualMental,
        qtd_def_mobilidade_reduzida: qtdDefMobilidadeReduzida,
        qtd_def_multiplas: qtdDefMultiplas,
        qtd_def_surdo: qtdDefSurdo,
        qtd_def_visual: qtdDefVisual,

        responsavel_aparelho_auditivo: responsavelAparelhoAuditivo,
        responsavel_bengala_branca_ou_verde_vermelha: responsavelBengalaBrancaOuVerdeVermelha,
        responsavel_braille_equip_sintese_voz: responsavelBrailleEquipSinteseVoz,
        responsavel_cadeira_de_roda: responsavelCadeiraDeRoda,
        responsavel_cama_hospitalar: responsavelCamaHospitalar,
        responsavel_cao_guia: responsavelCaoGuia,
        responsavel_leitura_facial_labial: responsavelLeituraFacialLabial,
        responsavel_libras: responsavelLibras,
        responsavel_lupa_lente_fonte_ampliada: responsavelLupaLenteFonteAmpliada,
        responsavel_muleta_bengala4pontas_andador: responsavelMuletaBengala4PontasAndador,
        responsavel_ortese_protese: responsavelOrteseProtese,
        responsavel_prancha: responsavelPranchaComAlt,
        // Campos que faltavam:
        responsavel_def_fisica: responsavelDefFisica,
        responsavel_def_auditiva: responsavelDefAuditiva,
        responsavel_def_intelectual: responsavelDefIntelectual,
        responsavel_def_mobilidade: responsavelDefMobilidade,
        responsavel_def_multipla: responsavelDefMultipla,
        responsavel_def_outra: responsavelDefOutra,
        responsavel_def_surdo_cegueira: responsavelDefSurdoCegueira,
        responsavel_def_visual: responsavelDefVisual,
    });


    function isGetArrolamentoResponse(
        response: any
    ): response is { arrolamentos: any[] } {
        return response && Array.isArray(response.arrolamentos);
    };

    const fetchData = async () => {
        const seiFromStorageRaw = localStorage.getItem("seiNumber");
        const seiFromStorage = Number(seiFromStorageRaw);

        try {
            const request = {
                numero_sei: seiFromStorage,
                initial_date: initialDate,
                end_date: endDate,
            };

            const response = await fetchArrolamento(request);

            if (isGetArrolamentoResponse(response)) {
                await handlePessoaDeficienteResponse(response);
            }

        } catch (error) {
            console.error("Erro ao buscar arrolamentos:", error);
            showErrorMessage("Erro ao buscar dados do arrolamento");
        }
    };

    const showErrorMessage = (message: string) => {
        Swal.fire({
            icon: "error",
            html: `<div class="text-lg text-center break-words w-full -translate-y-2">${message}<br/><span class="text-sm">Veja o console para mais detalhes.</span></div>`,
            showConfirmButton: true,
            customClass: {
                popup: "w-[200px] h-[160px] flex flex-col justify-start items-center",
            },
        });
    };

    const fetchArrolamento = async (request: any) => {
        return await survey_resource.GetArrolamento(request, async (req: any) => {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
                if (value !== undefined && value !== "") {
                    searchParams.append(key, String(value));
                }
            }

            const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
            const res = await fetch(url, {
                method: req.method,
                headers: {
                    "Content-Type": "application/json",
                    ...(req.headers || {}),
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`);
            }

            return res.json();
        });
    };

    const handlePessoaDeficienteResponse = async (response: any) => {
        const arrolamento = response.arrolamentos?.[0];
        if (!arrolamento) return;

        const arrolamentoId = arrolamento.id;
        const criadoPor = arrolamento.created_by;

        localStorage.setItem("arrolamentoId", arrolamentoId);
        localStorage.setItem("arrolamentoCreated_by", criadoPor);

        const payload = {
            created_by: criadoPor,
            form: {
                family_index: 1, // ou dinâmico

                pessoa_deficiente: {
                    aparelho_auditivo: aparelhoAuditivo === true || aparelhoAuditivo === "sim",
                    bengala_branca_ou_verde_vermelha: bengalaBrancaOuVerdeVermelha === true || bengalaBrancaOuVerdeVermelha === "sim",
                    braille_equip_sintese_voz: brailleEquipSinteseVoz === true || brailleEquipSinteseVoz === "sim",
                    cadeira_de_roda: cadeiraDeRoda === true || cadeiraDeRoda === "sim",
                    cama_hospitalar: camaHospitalar === true || camaHospitalar === "sim",
                    cao_guia: caoGuia === true || caoGuia === "sim",

                    def_auditiva: defAuditiva === true || defAuditiva === "sim",
                    def_fisica: defFisica === true || defFisica === "sim",
                    def_intelectual_mental: defIntelectualMental === true || defIntelectualMental === "sim",
                    def_mobilidade_reduzida: defMobilidadeReduzida === true || defMobilidadeReduzida === "sim",
                    def_multiplas: defMultiplas === true || defMultiplas === "sim",
                    def_outra: defOutra === true || defOutra === "sim",
                    def_surdo: defSurdo === true || defSurdo === "sim",
                    def_visual: defVisual === true || defVisual === "sim",

                    especifique_outra_def: especifiqueOutraDef || "",
                    especifique_outra_tec_assistida: especifiqueOutraTecAssistiva || "",
                    leitura_facial_labial: leituraFacialLabial === true || leituraFacialLabial === "sim",
                    libras: libras === true || libras === "sim",
                    lupa_lente_fonte_ampliada: lupaLenteFonteAmpliada === true || lupaLenteFonteAmpliada === "sim",
                    muleta_bengala4pontas_andador: muletaBengala4PontasAndador === true || muletaBengala4PontasAndador === "sim",
                    ortese_protese: orteseProtese === true || orteseProtese === "sim",
                    outras_tec_assistiva: outrasTecAssistiva === true || outrasTecAssistiva === "sim",
                    prancha_comunicacao_alternativa: pranchaComunicacaoAlternativa === true || pranchaComunicacaoAlternativa === "sim",

                    possui_laudo: possuiLaudo || "",

                    qtd_def_auditiva: (defAuditiva === true || defAuditiva === "sim") ? Number(qtdDefAuditiva || 0) : 0,
                    qtd_def_fisica: (defFisica === true || defFisica === "sim") ? Number(qtdDefFisica || 0) : 0,
                    qtd_def_intelectual_mental: (defIntelectualMental === true || defIntelectualMental === "sim") ? Number(qtdDefIntelectualMental || 0) : 0,
                    qtd_def_mobilidade_reduzida: (defMobilidadeReduzida === true || defMobilidadeReduzida === "sim") ? Number(qtdDefMobilidadeReduzida || 0) : 0,
                    qtd_def_multiplas: (defMultiplas === true || defMultiplas === "sim") ? Number(qtdDefMultiplas || 0) : 0,
                    qtd_def_surdo: (defSurdo === true || defSurdo === "sim") ? Number(qtdDefSurdo || 0) : 0,
                    qtd_def_visual: (defVisual === true || defVisual === "sim") ? Number(qtdDefVisual || 0) : 0,
                    qtd_pessoas_com_def_fam: Number(qtdPessoasComDefFam || 0),

                    responsavel_aparelho_auditivo: responsavelAparelhoAuditivo === true || responsavelAparelhoAuditivo === "sim",
                    responsavel_bengala_branca_ou_verde_vermelha: responsavelBengalaBrancaOuVerdeVermelha === true || responsavelBengalaBrancaOuVerdeVermelha === "sim",
                    responsavel_braille_equip_sintese_voz: responsavelBrailleEquipSinteseVoz === true || responsavelBrailleEquipSinteseVoz === "sim",
                    responsavel_cadeira_de_roda: responsavelCadeiraDeRoda === true || responsavelCadeiraDeRoda === "sim",
                    responsavel_cama_hospitalar: responsavelCamaHospitalar === true || responsavelCamaHospitalar === "sim",
                    responsavel_cao_guia: responsavelCaoGuia === true || responsavelCaoGuia === "sim",
                    responsavel_prancha: responsavelPranchaComAlt === true || responsavelPranchaComAlt === "sim",
                    responsavel_def_auditiva: responsavelDefAuditiva === true || responsavelDefAuditiva === "sim",
                    responsavel_def_fisica: responsavelDefFisica === true || responsavelDefFisica === "sim",
                    responsavel_def_intelectual: responsavelDefIntelectual === true || responsavelDefIntelectual === "sim",
                    responsavel_def_mobilidade: responsavelDefMobilidade === true || responsavelDefMobilidade === "sim",
                    responsavel_def_multipla: responsavelDefMultipla === true || responsavelDefMultipla === "sim",
                    responsavel_def_outra: responsavelDefOutra === true || responsavelDefOutra === "sim",
                    responsavel_def_surdo_cegueira: responsavelDefSurdoCegueira === true || responsavelDefSurdoCegueira === "sim",
                    responsavel_def_visual: responsavelDefVisual === true || responsavelDefVisual === "sim",

                    responsavel_leitura_facial_labial: responsavelLeituraFacialLabial === true || responsavelLeituraFacialLabial === "sim",
                    responsavel_libras: responsavelLibras === true || responsavelLibras === "sim",
                    responsavel_lupa_lente_fonte_ampliada: responsavelLupaLenteFonteAmpliada === true || responsavelLupaLenteFonteAmpliada === "sim",
                    responsavel_muleta_bengala4pontas_andador: responsavelMuletaBengala4PontasAndador === true || responsavelMuletaBengala4PontasAndador === "sim",
                    responsavel_ortese_protese: responsavelOrteseProtese === true || responsavelOrteseProtese === "sim",
                    responsavel_outra_tec_assistiva: responsavelOutraTecAssistiva === true || responsavelOutraTecAssistiva === "sim",

                    responsavel_tem_deficiencia: responsavelTemDeficiencia === true || responsavelTemDeficiencia === "sim",
                    tem_deficiencia: temPessoaDeficienciaFam === true || temPessoaDeficienciaFam === "sim",
                    utiliza_tecnologia_assistida: utilizaTecnologiaAssistida === true || utilizaTecnologiaAssistida === "sim",
                }

            },
        };

        try {
            console.log("Payload Pessoa Deficiente:", JSON.stringify(payload, null, 2));
            const token = localStorage.getItem('authToken') || ''
            await survey_resource.SendFormToArrolamentoPessoaDeficiente(SURVEY_RESOURCE_URL, arrolamentoId, payload, token);
        } catch (error) {
            console.error("Erro ao enviar dados de pessoa com deficiência:", error);
            showErrorMessage("Erro ao enviar os dados de pessoa com deficiência");
        }
    };


    const hasArrolamento = async (request: any): Promise<boolean> => {
        try {
            const response = await fetchArrolamento(request);

            const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);

            return !isEmpty;
        } catch (error) {
            console.error("Erro ao verificar arrolamentos:", error);
            return false;
        }
    };

    useEffect(() => {
        const handleBlur = async () => {
            const activeFieldName = document.activeElement?.getAttribute("name");

            const fields = {
                [`pessoa_deficiente.tem_deficiencia`]: temPessoaDeficienciaFam,
                [`pessoa_deficiente.qtdPessoasComDefFam`]: qtdPessoasComDefFam,
                [`pessoa_deficiente.responsavelTemDeficiencia`]: responsavelTemDeficiencia,
                [`pessoa_deficiente.possui_laudo`]: possuiLaudo,
                [`pessoa_deficiente.utiliza_tecnologia_assistida`]: utilizaTecnologiaAssistida,

                [`pessoa_deficiente.aparelho_auditivo`]: aparelhoAuditivo,
                [`pessoa_deficiente.bengala_branca_ou_verde_vermelha`]: bengalaBrancaOuVerdeVermelha,
                [`pessoa_deficiente.braille_equip_sintese_voz`]: brailleEquipSinteseVoz,
                [`pessoa_deficiente.cadeira_de_roda`]: cadeiraDeRoda,
                [`pessoa_deficiente.cama_hospitalar`]: camaHospitalar,
                [`pessoa_deficiente.cao_guia`]: caoGuia,
                [`pessoa_deficiente.def_auditiva`]: defAuditiva,
                [`pessoa_deficiente.def_fisica`]: defFisica,
                [`pessoa_deficiente.def_intelectual_mental`]: defIntelectualMental,
                [`pessoa_deficiente.def_mobilidade_reduzida`]: defMobilidadeReduzida,
                [`pessoa_deficiente.def_multiplas`]: defMultiplas,
                [`pessoa_deficiente.def_outra`]: defOutra,
                [`pessoa_deficiente.def_surdo`]: defSurdo,
                [`pessoa_deficiente.def_visual`]: defVisual,
                [`pessoa_deficiente.especifique_outra_def`]: especifiqueOutraDef,
                [`pessoa_deficiente.especifique_outra_tec_assistida`]: especifiqueOutraTecAssistiva,
                [`pessoa_deficiente.leitura_facial_labial`]: leituraFacialLabial,
                [`pessoa_deficiente.libras`]: libras,
                [`pessoa_deficiente.lupa_lente_fonte_ampliada`]: lupaLenteFonteAmpliada,
                [`pessoa_deficiente.muleta_bengala4pontas_andador`]: muletaBengala4PontasAndador,
                [`pessoa_deficiente.ortese_protese`]: orteseProtese,
                [`pessoa_deficiente.prancha_comunicacao_alternativa`]: pranchaComunicacaoAlternativa,
                [`pessoa_deficiente.outras_tec_assistiva`]: outrasTecAssistiva,

                [`pessoa_deficiente.qtd_def_auditiva`]: qtdDefAuditiva,
                [`pessoa_deficiente.qtd_def_fisica`]: qtdDefFisica,
                [`pessoa_deficiente.qtd_def_intelectual_mental`]: qtdDefIntelectualMental,
                [`pessoa_deficiente.qtd_def_mobilidade_reduzida`]: qtdDefMobilidadeReduzida,
                [`pessoa_deficiente.qtd_def_multiplas`]: qtdDefMultiplas,
                [`pessoa_deficiente.qtd_def_surdo`]: qtdDefSurdo,
                [`pessoa_deficiente.qtd_def_visual`]: qtdDefVisual,

                [`pessoa_deficiente.responsavel_aparelho_auditivo`]: responsavelAparelhoAuditivo,
                [`pessoa_deficiente.responsavel_bengala_branca_ou_verde_vermelha`]: responsavelBengalaBrancaOuVerdeVermelha,
                [`pessoa_deficiente.responsavel_braille_equip_sintese_voz`]: responsavelBrailleEquipSinteseVoz,
                [`pessoa_deficiente.responsavel_cadeira_de_roda`]: responsavelCadeiraDeRoda,
                [`pessoa_deficiente.responsavel_cama_hospitalar`]: responsavelCamaHospitalar,
                [`pessoa_deficiente.responsavel_cao_guia`]: responsavelCaoGuia,
                [`pessoa_deficiente.responsavel_def_auditiva`]: responsavelDefAuditiva,
                [`pessoa_deficiente.responsavel_def_intelectual`]: responsavelDefIntelectual,
                [`pessoa_deficiente.responsavel_def_mobilidade`]: responsavelDefMobilidade,
                [`pessoa_deficiente.responsavel_def_multipla`]: responsavelDefMultipla,
                [`pessoa_deficiente.responsavel_def_outra`]: responsavelDefOutra,
                [`pessoa_deficiente.responsavel_def_surdo_cegueira`]: responsavelDefSurdoCegueira,
                [`pessoa_deficiente.responsavel_def_visual`]: responsavelDefVisual,
                [`pessoa_deficiente.responsavel_leitura_facial_labial`]: responsavelLeituraFacialLabial,
                [`pessoa_deficiente.responsavel_libras`]: responsavelLibras,
                [`pessoa_deficiente.responsavel_lupa_lente_fonte_ampliada`]: responsavelLupaLenteFonteAmpliada,
                [`pessoa_deficiente.responsavel_muleta_bengala4pontas_andador`]: responsavelMuletaBengala4PontasAndador,
                [`pessoa_deficiente."responsavel_prancha"`]: responsavelPranchaComAlt,
                [`pessoa_deficiente.responsa`]: responsavelOrteseProtese,
                [`pessoa_deficiente.responsavel_outra_tec_assistiva`]: responsavelOutraTecAssistiva,
            };

            let shouldFetch = false;

            for (const [fieldName, currentValue] of Object.entries(fields)) {
                const fieldKey = fieldName.split(".").pop() || "";
                const prevValue = prevValuesRef.current[fieldKey];

                if (currentValue !== prevValue && activeFieldName !== fieldName) {
                    shouldFetch = true;
                    prevValuesRef.current[fieldKey] = currentValue;
                }
            }

            if (shouldFetch) {
                const seiNumber = localStorage.getItem("seiNumber");
                const request = {
                    numero_sei: Number(seiNumber),
                    initial_date: initialDate,
                    end_date: endDate,
                };

                const hasData = await hasArrolamento(request);

                if (!hasData) {
                    console.log("Nenhum Arrolamento Cadastrado");
                    return;
                }
                triggeredByBlurRef.current = true;
                await fetchData();
            }
        };

        window.addEventListener("blur", handleBlur, true);
        return () => {
            window.removeEventListener("blur", handleBlur, true);
        };
    }, [
        temPessoaDeficienciaFam,
        qtdPessoasComDefFam,
        responsavelTemDeficiencia,
        possuiLaudo,
        utilizaTecnologiaAssistida,

        aparelhoAuditivo,
        bengalaBrancaOuVerdeVermelha,
        brailleEquipSinteseVoz,
        cadeiraDeRoda,
        camaHospitalar,
        caoGuia,
        defAuditiva,
        defFisica,
        defIntelectualMental,
        defMobilidadeReduzida,
        defMultiplas,
        defOutra,
        defSurdo,
        defVisual,
        especifiqueOutraDef,
        especifiqueOutraTecAssistiva,
        leituraFacialLabial,
        libras,
        lupaLenteFonteAmpliada,
        muletaBengala4PontasAndador,
        orteseProtese,
        pranchaComunicacaoAlternativa,
        outrasTecAssistiva,

        qtdDefAuditiva,
        qtdDefFisica,
        qtdDefIntelectualMental,
        qtdDefMobilidadeReduzida,
        qtdDefMultiplas,
        qtdDefSurdo,
        qtdDefVisual,

        responsavelAparelhoAuditivo,
        responsavelBengalaBrancaOuVerdeVermelha,
        responsavelBrailleEquipSinteseVoz,
        responsavelCadeiraDeRoda,
        responsavelCamaHospitalar,
        responsavelCaoGuia,
        responsavelDefAuditiva,
        responsavelDefIntelectual,
        responsavelDefMobilidade,
        responsavelDefMultipla,
        responsavelDefOutra,
        responsavelDefSurdoCegueira,
        responsavelDefVisual,
        responsavelLeituraFacialLabial,
        responsavelLibras,
        responsavelLupaLenteFonteAmpliada,
        responsavelMuletaBengala4PontasAndador,
        responsavelOrteseProtese,
        responsavelPranchaComAlt,
        responsavelOutraTecAssistiva,
    ]);

    useEffect(() => {

        const currentValueFisica = form.getValues(`families[${familyIndex}].quantFisica`);
        const currentValueVisual = form.getValues(`familVisualies[${familyIndex}].quantVisual`);
        const currentValueAuditiva = form.getValues(`familVisualies[${familyIndex}].quantAuditiva`);
        const currentValueIntelectual = form.getValues(`families[${familyIndex}].quantIntelectual`);
        const currentValueMultiplas = form.getValues(`families[${familyIndex}].quantMultiplas`);
        const currentValueMobilidade = form.getValues(`families[${familyIndex}].quantMobilidade`);
        const currentValueSurdo = form.getValues(`families[${familyIndex}].quantSurdo`);

        if (currentValueFisica === undefined || currentValueFisica === null) {
            form.setValue(`families[${familyIndex}].quantFisica`, 1); // ou o valor padrão desejado
        }
        if (currentValueVisual === undefined || currentValueVisual === null) {
            form.setValue(`families[${familyIndex}].quantVisual`, 1); // ou o valor padrão desejado
        }
        if (currentValueAuditiva === undefined || currentValueAuditiva === null) {
            form.setValue(`families[${familyIndex}].quantAuditiva`, 1); // ou o valor padrão desejado
        }
        if (currentValueIntelectual === undefined || currentValueIntelectual === null) {
            form.setValue(`families[${familyIndex}].quantIntelectual`, 1); // ou o valor padrão desejado
        }
        if (currentValueMultiplas === undefined || currentValueMultiplas === null) {
            form.setValue(`families[${familyIndex}].quantMultiplas`, 1); // ou o valor padrão desejado
        }
        if (currentValueMobilidade === undefined || currentValueMobilidade === null) {
            form.setValue(`families[${familyIndex}].quantMobilidade`, 1); // ou o valor padrão desejado
        }
        if (currentValueSurdo === undefined || currentValueSurdo === null) {
            form.setValue(`families[${familyIndex}].quantSurdo`, 1); // ou o valor padrão desejado
        }
    }, []);

    useEffect(() => {
        if (!temPessoaDeficienciaFam) {
            form.setValue(`families[${familyIndex}].responsavelTemDeficiencia`, "");
            form.setValue(`families[${familyIndex}].responsavelPossuiLaudo`, "");
            form.setValue(`families[${familyIndex}].defFisica`, "");
            form.setValue(`families[${familyIndex}].defVisual`, "");
            form.setValue(`families[${familyIndex}].defAuditiva`, "");
            form.setValue(`families[${familyIndex}].defIntelectualMental`, "");
            form.setValue(`families[${familyIndex}].defMultiplas`, "");
            form.setValue(`families[${familyIndex}].defMobilidadeReduzida`, "");
            form.setValue(`families[${familyIndex}].defSurdoCegueira`, "");
            form.setValue(`families[${familyIndex}].defOutra`, "");
            form.setValue(`families[${familyIndex}].tecnologiaAssistiva`, "");
            form.setValue(`families[${familyIndex}].aparelhoAuditivo`, "");
            form.setValue(`families[${familyIndex}].ortesesProteses`, "");
            form.setValue(`families[${familyIndex}].cadeiraRoda`, "");
            form.setValue(`families[${familyIndex}].camaHospitalar`, "");
            form.setValue(`families[${familyIndex}].muletaBengala4pontasAndador`, "");
            form.setValue(`families[${familyIndex}].lupaLenteFontaAmpliada`, "");
            form.setValue(`families[${familyIndex}].brailleEquipSinteseVoz`, "");
            form.setValue(`families[${familyIndex}].libras`, "");
            form.setValue(`families[${familyIndex}].leituraFacialLabial`, "");
            form.setValue(`families[${familyIndex}].bengalaBrancaOuVerdeVermelha`, "");
            form.setValue(`families[${familyIndex}].caoGuia`, "");
            form.setValue(`families[${familyIndex}].pranchaComunicacaoAlternativa`, "");
            form.setValue(`families[${familyIndex}].outrasTecAssistiva`, "");
            form.setValue(`families[${familyIndex}].especifiqueOutras`, "");
            form.setValue(`families[${familyIndex}].responsavelDefFisica`, "");
            form.setValue(`families[${familyIndex}].responsavelDefVisual`, "");
            form.setValue(`families[${familyIndex}].responsavelDefAuditiva`, "");
            form.setValue(`families[${familyIndex}].responsavelDefIntelectual`, "");
            form.setValue(`families[${familyIndex}].responsavelDefMultipla`, "");
            form.setValue(`families[${familyIndex}].responsavelDefMobilidade`, "");
            form.setValue(`families[${familyIndex}].responsavelDefSurdoCegueira`, "");
            form.setValue(`families[${familyIndex}].responsavelDefOutra`, "");
            form.setValue(`families[${familyIndex}].responsavelAparelhoAuditivo`, "");
            form.setValue(`families[${familyIndex}].responsavelOrteseProtese`, "");
            form.setValue(`families[${familyIndex}].responsavelCadeiraRoda`, "");
            form.setValue(`families[${familyIndex}].responsavelCamaHospitalar`, "");
            form.setValue(`families[${familyIndex}].responsavelMuletaBengala4pontasAndador`, "");
            form.setValue(`families[${familyIndex}].responsavelLupaLenteFontaAmpliada`, "");
            form.setValue(`families[${familyIndex}].responsavelBrailleEquipSinteseVoz`, "");
            form.setValue(`families[${familyIndex}].responsavelLibras`, "");
            form.setValue(`families[${familyIndex}].responsavelLeituraFacialLabial`, "");
            form.setValue(`families[${familyIndex}].responsavelBnglBranOuVerdVerm`, "");
            form.setValue(`families[${familyIndex}].responsavelCaoGuia`, "");
            form.setValue(`families[${familyIndex}].responsavelPrancha`, "");
            form.setValue(`families[${familyIndex}].responsavelOutraTecAssistiva`, "");
            form.setValue(`families[${familyIndex}].especifiqueOutraTecAssistiva`, "");
        }
    }, [temPessoaDeficienciaFam, familyIndex]);

    useEffect(() => {
        console.log("responsavelTemDeficiencia:", responsavelTemDeficiencia);
        if (!responsavelTemDeficiencia || responsavelTemDeficiencia === "nao") {
            form.setValue(`families[${familyIndex}].responsavelPossuiLaudo`, "");
        }
    }, [responsavelTemDeficiencia, familyIndex]);

    return (
        <div className="text-left">
            <Collapsible open={mostrarIdentificacao} onOpenChange={setMostrarIdentificacao}>
                <CollapsibleTrigger asChild>
                    <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
                        <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {formSections.map((section, sectionIndex) => (
                        <FormSectionRenderer
                            key={section.id}
                            section={section}
                            formControl={form.control}
                            getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                            sectionIndex={sectionIndex}
                            formValues={formValues}
                            showSectionLabel={false}
                            familyIndex={familyIndex}
                        />
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default PessoaDefForm; 