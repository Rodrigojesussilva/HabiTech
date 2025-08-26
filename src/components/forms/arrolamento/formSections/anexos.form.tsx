import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/arrolamento/definitions/anexos.definition";
import Swal from 'sweetalert2';
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import survey_resource from "@/service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL, SURVEY_RESOURCE_URL } from "@/service/constants"
import useViewMode from '@/hooks/useViewMode'
import { useCameraModal } from "@/components/camera/useCameraModal";
import { useAtualizaOnClickBotao } from "@/components/camera/useAtualizaOnClickBotao";

interface AnexosFormProps {
  id?: string;
  sectionIndex?: number;
  familyIndex: number;
}

type AttachmentItem = {
  id: string
  filename: string
  mime?: string
  size?: number
  url?: string
  dataUrl?: string
  metadado?: Record<string, any>
}

const SECTION_KEY = 'anexos'

const AnexosForm = ({ sectionIndex: sectionNumber, familyIndex }: AnexosFormProps) => {

  const isViewMode = useViewMode();
  const isCompletedNow = () => localStorage.getItem('arrolamentoCompleted') === 'true';

  const [open, setOpen] = useState(false)
  const form = useFormContext();
  const formValues = form.watch(`families[${familyIndex}]`) || {};
  const formSections = getMergedFormSections(formValues);

  const [attachmentsByField, setAttachmentsByField] = useState<Record<string, AttachmentItem[]>>({})
  const params = useParams<{ id: string }>()
  const routeArrolamentoId = params.id || ''
  const arrolamentoIdLS = localStorage.getItem('arrolamentoId') || ''
  console.log('[Arrolamento][Anexos][Init] routeArrolamentoId:', routeArrolamentoId, 'arrolamentoIdLS:', arrolamentoIdLS, 'familyIndex:', familyIndex)
  // ... dentro do AnexosForm:
  const { abrirCamera } = useCameraModal();
  const camposComOnClick = useAtualizaOnClickBotao(
    formSections[0]?.fields || [],
    familyIndex,
    abrirCamera
  );
  const getAuthToken = (): string => {
    const keys = ['authToken', 'authorization_token', 'token', 'access_token', 'jwt', 'idToken']
    for (const k of keys) {
      const v = localStorage.getItem(k)
      if (v) {
        console.log('[Arrolamento][Anexos][Auth] token source:', k, 'length:', v.length)
        return v
      }
    }
    console.warn('[Arrolamento][Anexos][Auth] token not found in localStorage')
    return ''
  }
  const authToken = getAuthToken()
  const createdBy = localStorage.getItem('userEmail') || ''
  console.log('[Arrolamento][Anexos][Init] createdBy:', createdBy)

  const ensureIds = () => {
    const currentId = routeArrolamentoId || localStorage.getItem('arrolamentoId') || arrolamentoIdLS
    const token = getAuthToken() || authToken
    console.log('[Arrolamento][Anexos][ensureIds] currentId:', currentId, 'tokenPresent:', Boolean(token))
    return { currentId, token }
  }

  const localKey = (sid: string) => `arrolamento_attachments_${sid}`



 

  const loadFromLocal = (sid: string) => {
    try {
      const key = localKey(sid)
      const parsed = JSON.parse(localStorage.getItem(key) || '{}')
      if (parsed && typeof parsed === 'object') {
        setAttachmentsByField(parsed)
        console.log('[Arrolamento][Anexos][Local][Load] key:', key, 'parsed:', parsed)
      }
    } catch (e) {
      console.warn('[Arrolamento][Anexos][Local][Load] failed:', e)
    }
  }

  const loadAttachments = async () => {
    const { currentId, token } = ensureIds()
    console.log('[Arrolamento][Anexos][Load] begin. id:', currentId, 'tokenPresent:', Boolean(token))
    if (!currentId) {
      console.warn('[Arrolamento][Anexos][Load] id missing; skipping')
      return
    }
    /* if (!token) {
       console.warn('[Arrolamento][Anexos][Load] token missing; using local fallback')
       loadFromLocal(currentId)
       return
     }
     */
    try {
      // signed_url primeiro
      const response = await survey_resource.GetArrolamentoAttachments({ id: currentId, authorization_token: token, download_mode: 'signed_url' as any }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_URL}${req.path}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
        console.log('[Arrolamento][Anexos][Load][HTTP] GET signed_url url:', `${url}?download_mode=signed_url`, 'headersAuth:', Boolean(headers['Authorization']))
        const res = await fetch(`${url}?download_mode=signed_url`, { method: req.method, headers })
        console.log('[Arrolamento][Anexos][Load][HTTP] GET signed_url status:', res.status)
        if (!res.ok) {
          const txt = await res.text()
          console.warn('[Arrolamento][Anexos][Load][HTTP] GET signed_url error:', res.status, txt)
          throw new Error(txt)
        }
        const json = await res.json()
        console.log('[Arrolamento][Anexos][Load][HTTP] GET signed_url ok, attachments count:', Array.isArray((json as any)?.attachments) ? (json as any).attachments.length : 'n/a')
        return json
      })
      const list = (response as any)?.attachments || []
      console.log('[Arrolamento][Anexos][Load] signed_url attachments raw length:', list.length)
      if (!Array.isArray(list) || list.length === 0) throw new Error('Empty signed_url response; fallback metadata_only')
      const grouped: Record<string, AttachmentItem[]> = {}
      const parseMetadata = (m: unknown) => {
        if (!m) return {};
        if (typeof m === 'string') {
          try { return JSON.parse(m); } catch { return {}; }
        }
        return m as Record<string, any>;
      };
      for (const f of list) {
        console.log('[Arrolamento][Anexos][Load] map item raw:', f);
        const meta = parseMetadata(f.metadata.metadata || f.metadado || {})
        const fieldKey = meta.field || 'outros'
        const filename = meta.filename || f.name || 'arquivo'
        const mime = f.mime_type || f.mime
        const size = f.size
        console.log('[Arrolamento][Anexos][Load] map item:', { id: f.id, filename, section: meta.section, field: fieldKey, hasUrl: Boolean(f.url) })
        //if (meta.section !== SECTION_KEY) continue
        if (!grouped[fieldKey]) grouped[fieldKey] = []
        grouped[fieldKey].push({
          id: f.id,
          filename,
          mime,
          size,
          url: f.metadata.download_link,
          metadado: meta,
        })
      }
      console.log('[Arrolamento][Anexos][Load] grouped keys:', Object.keys(grouped))
      setAttachmentsByField(grouped)
    } catch (e) {
      console.warn('[Arrolamento][Anexos][Load] signed_url unavailable, fallback metadata_only. reason:', e)
      try {
        const { currentId, token } = ensureIds()
        if (!token) loadFromLocal(currentId)
        else {
          const response2 = await survey_resource.GetArrolamentoAttachments({ id: currentId, authorization_token: token, download_mode: 'metadata_only' as any }, async (req: any) => {
            const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
            if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
            console.log('[Arrolamento][Anexos][Load][HTTP] GET metadata_only url:', `${url}?download_mode=metadata_only`, 'headersAuth:', Boolean(headers['Authorization']))
            const res = await fetch(`${url}?download_mode=metadata_only`, { method: req.method, headers })
            console.log('[Arrolamento][Anexos][Load][HTTP] GET metadata_only status:', res.status)
            if (!res.ok) {
              const txt = await res.text()
              console.warn('[Arrolamento][Anexos][Load][HTTP] GET metadata_only error:', res.status, txt)
              throw new Error(txt)
            }
            const json = await res.json()
            console.log('[Arrolamento][Anexos][Load][HTTP] GET metadata_only ok, attachments count:', Array.isArray((json as any)?.attachments) ? (json as any).attachments.length : 'n/a')
            return json
          })
          const list2 = (response2 as any)?.attachments || []
          console.log('[Arrolamento][Anexos][Load] metadata_only attachments raw length:', list2.length)
          const grouped2: Record<string, AttachmentItem[]> = {}
          for (const f of list2) {
            const meta = f.metadado || {}
            const fieldKey = meta.field || 'outros'
            console.log('[Arrolamento][Anexos][Load] map item (metadata_only):', { id: f.id, filename: f.filename, section: meta.section, field: fieldKey })
            if (meta.section !== SECTION_KEY) continue
            if (!grouped2[fieldKey]) grouped2[fieldKey] = []
            grouped2[fieldKey].push({ id: f.id, filename: f.filename || f.name || 'arquivo', mime: f.mime, size: f.size, metadado: meta })
          }
          console.log('[Arrolamento][Anexos][Load] grouped2 keys:', Object.keys(grouped2))
          setAttachmentsByField(grouped2)
        }
      } catch (e2) {
        console.error('[Arrolamento][Anexos][Load] metadata/local fallback failed:', e2)
        const { currentId } = ensureIds()
        loadFromLocal(currentId)
      }
    } finally {
    }
  }

  useEffect(() => { console.log('[Arrolamento][Anexos][Effect] routeArrolamentoId changed:', routeArrolamentoId); loadAttachments() }, [routeArrolamentoId])
  useEffect(() => { console.log('[Arrolamento][Anexos][Effect] familyIndex changed:', familyIndex); loadAttachments() }, [familyIndex])

  useEffect(() => {
    console.log('[Arrolamento][Anexos][Effect] open changed:', open)
    if (open) loadAttachments()
  }, [open])

  const handleUpload = async (file: File, fieldName: string) => {
    if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Anexos] Upload blocked: viewMode/completed'); return; }
    try {
      const { currentId, token } = ensureIds()
      console.log('[Arrolamento][Anexos][Upload] ids:', { currentId, tokenPresent: Boolean(token) })
      if (!currentId) {
        Swal.fire({ icon: 'error', title: 'Arrolamento não identificado', text: 'ID do arrolamento ausente. Salve metadados primeiro.' })
        return
      }
      console.log('[Arrolamento][Anexos][Upload] file:', { name: file.name, size: file.size, type: file.type })
      const reader = new FileReader()
      const previewDataUrl: string = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const metadado = {
        survey_id: currentId,
        visit_count: form.getValues('visitNumber') || '',
        section: SECTION_KEY,
        family_index: familyIndex,
        field: fieldName,
        filename: file.name,
        mime: file.type,
        uploaded_by: createdBy,
        uploaded_at: new Date().toISOString(),
      }
      console.log('[Arrolamento][Anexos][Upload] metadado:', metadado)

      const uploaded = await survey_resource.SendFileToUploadV2Multipart(
        SURVEY_RESOURCE_URL,
        currentId,
        file,
        metadado as any,
      )
      console.log('[Arrolamento][Anexos][Upload] response:', uploaded)

      try {
        const id = uploaded?.file?.id || uploaded?.id || `temp_${Date.now()}`
        const url = uploaded?.file?.url || uploaded?.url
        const newItem: AttachmentItem = { id, filename: file.name, mime: file.type, size: file.size, url, dataUrl: previewDataUrl, metadado }
        setAttachmentsByField(prev => {
          const next = { ...prev }
          if (!next[fieldName]) next[fieldName] = []
          next[fieldName] = [...(next[fieldName] || []), newItem]
          return next
        })
        console.log('[Selagem][Anexos][Upload] UI updated for field:', fieldName, 'id:', id, 'hasUrl:', Boolean(url))
        // Persistir localmente para carregamento futuro sem token
        //saveLocalAttachment(currentSelagemId, fieldName, newItem)
      } catch (e) {
        console.warn('[Arrolamento][Anexos][Upload] could not reflect response in UI:', e)
      }

      await loadAttachments()     
      Swal.fire({ icon: 'success', title: 'Anexo enviado!', timer: 1200, showConfirmButton: false })
    } catch (e) {
      console.error('[Arrolamento][Anexos][Upload] error:', e)
      Swal.fire({ icon: 'error', title: 'Erro ao enviar anexo' })
    }
  }

  const handleRemove = async (attachmentId: string, fieldName: string) => {
    if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Anexos] Remove blocked: viewMode/completed'); return; }
    try {
      const { currentId, token } = ensureIds()
      console.log('[Arrolamento][Anexos][Remove] id:', attachmentId, 'field:', fieldName, 'arrolamentoId:', currentId, 'tokenPresent:', Boolean(token))
      if (!currentId) return
      //if (token) {
        await survey_resource.RemoveArrolamentoAttachment({ id: currentId, attachments: [attachmentId], authorization_token: token }, async (req: any) => {
          const url = `${SURVEY_RESOURCE_URL}${req.path}`
          const headers: Record<string, string> = { 'Content-Type': 'application/json' }
          const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
          if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
          console.log('[Arrolamento][Anexos][Remove][HTTP] POST url:', url, 'headersAuth:', Boolean(headers['Authorization']))
          const res = await fetch(url, { method: req.method, headers, body: JSON.stringify(req.body || {}) })
          console.log('[Arrolamento][Anexos][Remove][HTTP] status:', res.status)
          if (!res.ok) {
            const txt = await res.text()
            console.warn('[Arrolamento][Anexos][Remove][HTTP] error:', res.status, txt)
            throw new Error(txt)
          }
          return res.json()
        })
      //}
      setAttachmentsByField(prev => {
        const next = { ...prev }
        next[fieldName] = (next[fieldName] || []).filter(a => a.id !== attachmentId)
        return next
      })
      //removeLocalAttachment(currentId, fieldName, attachmentId)
      //console.log('[Arrolamento][Anexos][Remove] removed locally:', attachmentId)
    } catch (e) {
      console.error('[Arrolamento][Anexos][Remove] error:', e)
    }
  }

  const openAttachment = async (fieldName: string, id: string) => {
    const items = attachmentsByField[fieldName] || []
    const a = items.find(x => x.id === id)
    console.log('[Arrolamento][Anexos][Open] field:', fieldName, 'id:', id, 'found:', Boolean(a))
    if (!a) return
    const filename = a.metadado?.filename || a.filename || 'anexo'
    try {
      let blob: Blob | null = null
      if (a.url) {
        console.log('[Arrolamento][Anexos][Open] fetching signed URL')
        const res = await fetch(a.url)
        console.log('[Arrolamento][Anexos][Open] fetch status:', res.status)
        if (!res.ok) throw new Error(await res.text())
        blob = await res.blob()
      } else if (a.dataUrl) {
        console.log('[Arrolamento][Anexos][Open] using dataUrl')
        const resp = await fetch(a.dataUrl)
        blob = await resp.blob()
      }
      if (!blob) throw new Error('Sem dados para download')
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
      console.log('[Arrolamento][Anexos][Open] download triggered for:', filename)
    } catch (e) {
      console.error('[Arrolamento][Anexos][Open] download error:', e)
      Swal.fire({ icon: 'error', title: 'Erro ao baixar anexo' })
    }
  }

  const renderAttachmentList = (fieldName: string) => {
    const itemsAll = attachmentsByField[fieldName] || []
    const items = itemsAll.filter(a => a.metadado?.family_index === familyIndex)
    if (!items.length) return null
    return (
      <ul className="mt-2 space-y-1">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded border px-2 py-1 text-xs">
            <button type="button" className="truncate mr-2 text-blue-700 hover:underline text-left" onClick={() => openAttachment(fieldName, a.id)} title={a.filename}>{a.filename}</button>
            <span className="flex items-center gap-2">
              {!isViewMode && !isCompletedNow() && (
                <button type="button" className="text-red-600" onClick={() => handleRemove(a.id, fieldName)}>remover</button>
              )}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  const handleSendAll = async () => {
    if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Anexos] SendAll blocked: viewMode/completed'); return; }
    try {
      console.log('[Arrolamento][Anexos] Iniciando envio em lote...')
      const { currentId, token } = ensureIds()
      console.log('[Arrolamento][Anexos] IDs:', { currentId, tokenPresent: Boolean(token) })
      if (!currentId) {
        Swal.fire({ icon: 'error', title: 'Arrolamento não identificado', text: 'ID do arrolamento ausente. Salve metadados primeiro.' })
        return
      }

      const fields = ['anexoComprovanteRenda', 'anexoCarteiraTrabalho', 'anexoArea']
      let sent = 0
      for (const fname of fields) {
        const value: any = form.getValues(`families[${familyIndex}].${fname}`)
        console.log(`[Arrolamento][Anexos] Campo ${fname} valor:`, value)
        if (value && value instanceof File) {
          console.log(`[Arrolamento][Anexos] Enviando arquivo de ${fname}:`, { name: value.name, size: value.size, type: value.type })
          await handleUpload(value, fname)
          sent++
        }
      }

      if (sent === 0) {
        Swal.fire({ icon: 'info', title: 'Nenhum arquivo selecionado', timer: 1200, showConfirmButton: false })
        return
      }

      if (token) await loadAttachments()
      Swal.fire({ icon: 'success', title: `Enviado(s) ${sent} arquivo(s)!`, timer: 1500, showConfirmButton: false })
    } catch (e) {
      console.error('[Arrolamento][Anexos] Falha no envio em lote:', e)
      Swal.fire({ icon: 'error', title: 'Erro no envio dos anexos' })
    }
  }

  return (
    <div className="text-left">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
            <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {formSections.map((section, sectionIndex) => (
            <div key={section.id} className="mb-2">
              <FormSectionRenderer
                section={{ ...formSections[0], fields: camposComOnClick }}
                formControl={form.control}
                getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                sectionIndex={sectionIndex}
                formValues={formValues}
                showSectionLabel={false}
                familyIndex={familyIndex}
              />

              {/* listas por campo */}
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <div className="text-xs font-medium text-gray-600">Comprovante de renda</div>
                  {renderAttachmentList('anexoComprovanteRenda')}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">Carteira de trabalho</div>
                  {renderAttachmentList('anexoCarteiraTrabalho')}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">Área</div>
                  {renderAttachmentList('anexoArea')}
                </div>
              </div>

              {!isViewMode && !isCompletedNow() && (
                <div className="mt-3">
                  <button type="button" onClick={handleSendAll} className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition">
                    Enviar Anexos
                  </button>
                </div>
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default AnexosForm; 